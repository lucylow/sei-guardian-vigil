use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
    Uint128, Addr, Storage, Map, MessageInfo, coin, coins, BankMsg, CosmosMsg,
};
use cw2::set_contract_version;
use cw_storage_plus::{Item, Map as CwMap};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

const CONTRACT_NAME: &str = "crates.io:sei-token";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub initial_supply: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Transfer { recipient: Addr, amount: Uint128 },
    Mint { recipient: Addr, amount: Uint128 },
    Burn { amount: Uint128 },
    UpdateOwner { new_owner: Addr },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetBalance { address: Addr },
    GetOwner {},
    GetTokenInfo {},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct TokenInfo {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub total_supply: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct BalanceResponse {
    pub balance: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct OwnerResponse {
    pub owner: Addr,
}

// Storage keys
const OWNER: Item<Addr> = Item::new("owner");
const BALANCES: CwMap<Addr, Uint128> = CwMap::new("balances");
const TOKEN_INFO: Item<TokenInfo> = Item::new("token_info");

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    
    let owner = info.sender.clone();
    OWNER.save(deps.storage, &owner)?;
    
    let token_info = TokenInfo {
        name: msg.name,
        symbol: msg.symbol,
        decimals: msg.decimals,
        total_supply: msg.initial_supply,
    };
    TOKEN_INFO.save(deps.storage, &token_info)?;
    
    // Set initial balance for owner
    BALANCES.save(deps.storage, &owner, &msg.initial_supply)?;
    
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", owner)
        .add_attribute("initial_supply", msg.initial_supply))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::Transfer { recipient, amount } => {
            execute_transfer(deps, info.sender, recipient, amount)
        }
        ExecuteMsg::Mint { recipient, amount } => {
            execute_mint(deps, info.sender, recipient, amount)
        }
        ExecuteMsg::Burn { amount } => {
            execute_burn(deps, info.sender, amount)
        }
        ExecuteMsg::UpdateOwner { new_owner } => {
            execute_update_owner(deps, info.sender, new_owner)
        }
    }
}

pub fn execute_transfer(
    deps: DepsMut,
    sender: Addr,
    recipient: Addr,
    amount: Uint128,
) -> StdResult<Response> {
    if amount == Uint128::zero() {
        return Err(cosmwasm_std::StdError::generic_err("Cannot transfer zero tokens"));
    }
    
    let sender_balance = BALANCES.load(deps.storage, &sender)?;
    if sender_balance < amount {
        return Err(cosmwasm_std::StdError::generic_err("Insufficient balance"));
    }
    
    BALANCES.update(deps.storage, &sender, |balance| -> StdResult<_> {
        Ok(balance.unwrap_or_default() - amount)
    })?;
    
    BALANCES.update(deps.storage, &recipient, |balance| -> StdResult<_> {
        Ok(balance.unwrap_or_default() + amount)
    })?;
    
    Ok(Response::new()
        .add_attribute("method", "transfer")
        .add_attribute("from", sender)
        .add_attribute("to", recipient)
        .add_attribute("amount", amount))
}

pub fn execute_mint(
    deps: DepsMut,
    sender: Addr,
    recipient: Addr,
    amount: Uint128,
) -> StdResult<Response> {
    let owner = OWNER.load(deps.storage)?;
    if sender != owner {
        return Err(cosmwasm_std::StdError::generic_err("Only owner can mint"));
    }
    
    BALANCES.update(deps.storage, &recipient, |balance| -> StdResult<_> {
        Ok(balance.unwrap_or_default() + amount)
    })?;
    
    // Update total supply
    TOKEN_INFO.update(deps.storage, |mut info| -> StdResult<_> {
        info.total_supply += amount;
        Ok(info)
    })?;
    
    Ok(Response::new()
        .add_attribute("method", "mint")
        .add_attribute("to", recipient)
        .add_attribute("amount", amount))
}

pub fn execute_burn(
    deps: DepsMut,
    sender: Addr,
    amount: Uint128,
) -> StdResult<Response> {
    let balance = BALANCES.load(deps.storage, &sender)?;
    if balance < amount {
        return Err(cosmwasm_std::StdError::generic_err("Insufficient balance to burn"));
    }
    
    BALANCES.update(deps.storage, &sender, |balance| -> StdResult<_> {
        Ok(balance.unwrap_or_default() - amount)
    })?;
    
    // Update total supply
    TOKEN_INFO.update(deps.storage, |mut info| -> StdResult<_> {
        info.total_supply -= amount;
        Ok(info)
    })?;
    
    Ok(Response::new()
        .add_attribute("method", "burn")
        .add_attribute("from", sender)
        .add_attribute("amount", amount))
}

pub fn execute_update_owner(
    deps: DepsMut,
    sender: Addr,
    new_owner: Addr,
) -> StdResult<Response> {
    let owner = OWNER.load(deps.storage)?;
    if sender != owner {
        return Err(cosmwasm_std::StdError::generic_err("Only owner can update owner"));
    }
    
    OWNER.save(deps.storage, &new_owner)?;
    
    Ok(Response::new()
        .add_attribute("method", "update_owner")
        .add_attribute("old_owner", owner)
        .add_attribute("new_owner", new_owner))
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetBalance { address } => to_binary(&query_balance(deps, address)?),
        QueryMsg::GetOwner {} => to_binary(&query_owner(deps)?),
        QueryMsg::GetTokenInfo {} => to_binary(&query_token_info(deps)?),
    }
}

fn query_balance(deps: Deps, address: Addr) -> StdResult<BalanceResponse> {
    let balance = BALANCES.load(deps.storage, &address).unwrap_or_default();
    Ok(BalanceResponse { balance })
}

fn query_owner(deps: Deps) -> StdResult<OwnerResponse> {
    let owner = OWNER.load(deps.storage)?;
    Ok(OwnerResponse { owner })
}

fn query_token_info(deps: Deps) -> StdResult<TokenInfo> {
    let token_info = TOKEN_INFO.load(deps.storage)?;
    Ok(token_info)
}
