import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function TypingText({ text }) {
  const [out, setOut] = useState("");

  useEffect(() => {
    if (!text) return;
    // Normalize missing spaces for Markdown headers and lists, preserving leading whitespace
    let normalizedText = text
      .replace(/^(\s*)(#+)([^#\s])/gm, '$1$2 $3')
      .replace(/^(\s*)(\*)([^\s*])/gm, '$1* $3');

    let i = 0;
    const interval = setInterval(() => {
      setOut(normalizedText.slice(0, i++));
      if (i > normalizedText.length) clearInterval(interval);
    }, 5);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="markdown-content" style={{ lineHeight: '1.6', fontSize: '1.05rem', marginTop: "20px" }}>
      <ReactMarkdown>{out}</ReactMarkdown>
    </div>
  );
}
