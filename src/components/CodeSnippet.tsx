import React from "react";

export default function CodeSnippet({
  lang,
  children,
}: {
  lang: string;
  children: string;
}) {
  const copy = () => {
    navigator.clipboard.writeText(children);
    alert("Copied to clipboard!");
  };

  return (
    <div className="relative bg-gray-900 text-green-300 font-mono text-sm p-3 rounded mt-2">
      <pre>
        <code className={`language-${lang}`}>{children}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-1 right-1 bg-gray-700 text-white text-xs px-2 py-1 rounded"
      >
        Copy
      </button>
    </div>
  );
}