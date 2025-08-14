import { Agent, Task } from "@/components/MultiAgentOrchestrator";

// Utility weights for scoring
const WEIGHTS = {
  responseTime: 0.25,
  successRate: 0.25,
  cost: 0.2,
  workload: 0.15,
  skillMatch: 0.15,
};

// Task classification
export function classifyTask(task: Task) {
  // ...classify by type, urgency, resource, cost...
  return {
    type: task.type,
    urgency: task.priority,
    riskScore: task.metadata?.riskScore || 0,
    tvlImpact: task.metadata?.tvl_usd ? task.metadata.tvl_usd / 1e6 : 0,
    tags: task.metadata?.tags || [],
    origin: task.metadata?.origin || "",
  };
}

// Agent capability scoring
function skillMatch(task: Task, agent: Agent) {
  // Simple keyword match, weighted for Sei-specific skills
  let score = 0;
  if (task.type === "contract_audit" && agent.capabilities.includes("static_analysis")) score += 0.5;
  if (task.type === "vulnerability_patch" && agent.capabilities.includes("code_generation")) score += 0.5;
  if (agent.capabilities.includes("sei_parallel_checks")) score += 0.2;
  return Math.min(score, 1);
}

// Cost estimation (gas, computation)
function gasCostHeuristic(task: Task, agent: Agent) {
  let baseCost = 21000;
  let complexity = (task.metadata?.code?.length || 1000) / 1000;
  let agentDiscount = agent.capabilities.includes("gas_optimization") ? 0.7 : 1;
  if (agent.capabilities.includes("sei_parallel_checks")) baseCost *= 0.6;
  return baseCost + complexity * 15000 * agentDiscount;
}

// Agent scoring function
export function scoreAgent(task: Task, agent: Agent) {
  return (
    WEIGHTS.skillMatch * skillMatch(task, agent) +
    WEIGHTS.workload * (1 - agent.load / 100) +
    WEIGHTS.successRate * (agent.performance.successRate / 100) -
    WEIGHTS.cost * (gasCostHeuristic(task, agent) / 1e6)
  );
}

// Routing decision
export function routeTask(task: Task, agents: Agent[]): Agent | null {
  // Rule-based routing for critical tasks
  if (task.priority === "critical") {
    if (task.type === "contract_audit") {
      const secAgents = agents.filter(a => a.type === "security");
      return secAgents.sort((a, b) => scoreAgent(task, b) - scoreAgent(task, a))[0] || null;
    }
    if (task.type === "vulnerability_patch") {
      const remediationAgents = agents.filter(a => a.type === "remediation");
      return remediationAgents.sort((a, b) => scoreAgent(task, b) - scoreAgent(task, a))[0] || null;
    }
  }
  // Load balancing: least busy agent with matching capability
  const capableAgents = agents.filter(a => skillMatch(task, a) > 0.3);
  if (capableAgents.length === 0) return null;
  return capableAgents.sort((a, b) => scoreAgent(task, b) - scoreAgent(task, a))[0];
}

// Fallback/escalation logic
export function handleRoutingFailure(task: Task, agents: Agent[], attempts: number) {
  if (attempts < 2) {
    return { action: "RETRY", agent: routeTask(task, agents) };
  }
  const nextAgent = agents.filter(a => a.id !== task.assignedAgent).sort((a, b) => scoreAgent(task, b) - scoreAgent(task, a))[0];
  if (nextAgent) {
    return { action: "REROUTE", agent: nextAgent };
  }
  return { action: "ESCALATE", agent: null };
}

// ML-based routing stub (for future extension)
export function mlRouteTask(task: Task, agents: Agent[]): Agent | null {
  // Placeholder: use scoreAgent for now
  return routeTask(task, agents);
}
