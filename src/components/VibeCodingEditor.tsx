import React, { useState, useEffect, useRef } from "react";

// Vibe Coding Editor: AI-powered code suggestions for SEI SENTINEL agent builder
export default function VibeCodingEditor({ initialCode = "", onCodeChange }) {
  const [code, setCode] = useState(initialCode);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  // Fetch AI code suggestions from backend after user stops typing for 1s
  useEffect(() => {
    const handler = setTimeout(() => {
      if (code.trim().length < 10) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: code }),
      })
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data.suggestions || []);
          setLoading(false);
        })
        .catch(() => {
          setSuggestions([]);
          setLoading(false);
        });
    }, 1000);

    return () => clearTimeout(handler);
  }, [code]);

  // Insert chosen suggestion at cursor
  const applySuggestion = (suggestion) => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newCode = code.slice(0, start) + suggestion + code.slice(end);
    setCode(newCode);
    onCodeChange(newCode);
    setSuggestions([]);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + suggestion.length, start + suggestion.length);
    }, 0);
  };

  return (
    <div className="relative max-w-full">
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          onCodeChange(e.target.value);
        }}
        spellCheck={false}
        placeholder="Start coding or edit your agent script..."
        className="w-full h-64 p-3 border rounded font-mono text-sm resize-none focus:outline-blue-500"
      />

      {loading && (
        <div className="absolute top-2 right-2 text-xs italic text-gray-500 select-none">
          Loading suggestions...
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 max-h-44 overflow-auto bg-white border rounded mt-1 shadow-lg z-10 text-sm">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              tabIndex={0}
              role="button"
              className="cursor-pointer hover:bg-blue-100 px-3 py-1"
              onClick={() => applySuggestion(s)}
              onKeyDown={(e) => e.key === "Enter" && applySuggestion(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
