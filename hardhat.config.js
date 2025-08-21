require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // SEI Testnet (Atlantic-2)
    seiTestnet: {
      url: "https://sei-testnet-rpc.polkachu.com",
      chainId: 713715,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei
    },
    
    // SEI Mainnet (Pacific-1)
    seiMainnet: {
      url: "https://sei-rpc.publicnode.com",
      chainId: 713715,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei
    },
    
    // Local development
    hardhat: {
      chainId: 31337,
    },
  },
  
  etherscan: {
    apiKey: {
      seiTestnet: process.env.SEI_EXPLORER_API_KEY || "",
      seiMainnet: process.env.SEI_EXPLORER_API_KEY || "",
    },
    customChains: [
      {
        network: "seiTestnet",
        chainId: 713715,
        urls: {
          apiURL: "https://sei-testnet-explorer.polkachu.com/api",
          browserURL: "https://sei-testnet-explorer.polkachu.com",
        },
      },
      {
        network: "seiMainnet",
        chainId: 713715,
        urls: {
          apiURL: "https://sei.explorers.guru/api",
          browserURL: "https://sei.explorers.guru",
        },
      },
    ],
  },
  
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    gasPrice: 20,
  },
  
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deployments: "./deployments",
  },
};
