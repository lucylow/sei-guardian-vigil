import React from "react";
export default function Tooltip({ text }: { text: string }) {
  return (
    <span className="ml-1 relative group cursor-pointer text-blue-500">
      ℹ️
      <span className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded p-2 -top-8 left-0 w-48 z-10">
        {text}
      </span>
    </span>
  );
}