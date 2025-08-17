import { useState } from "react";
import VibeCodingEditor from "./VibeCodingEditor";

export function AgentBuilderReview({ agentJson }) {
  const [code, setCode] = useState("// Generated agent code will appear here...");

  return (
    <div>
      {/* ...existing code... */}
      <details>
        <summary className="cursor-pointer font-semibold mb-2">Advanced: Vibe Code Editor</summary>
        <VibeCodingEditor initialCode={code} onCodeChange={setCode} />
      </details>
      {/* ...existing code... */}
    </div>
  );
}