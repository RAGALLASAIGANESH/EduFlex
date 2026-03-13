import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function TypingText({ text }) {
  const [out, setOut] = useState("");

  useEffect(() => {
    if (!text) return;
    // Normalize Markdown
    // Normalize Markdown to completely prevent Code Block traps and escapes
    let normalizedText = text
      // 1. Un-escape any asterisks or hashes the AI might have escaped
      .replace(/\\([*#])/g, '$1')
      // 2. Strip all leading spaces/tabs on every line so it NEVER triggers a <pre> Code Block
      .replace(/^[ \t]+/gm, '')
      // 3. Fix missing space after headers
      .replace(/^(#+)([^#\s])/gm, '$1 $2')
      // 4. Fix missing space after bullets (* or -)
      .replace(/^([-*])([^\s*-])/gm, '$1 $2')
      // 5. Ensure double blank line before headers if there's touching text
      .replace(/([^\n])\r?\n(#+ )/g, '$1\n\n$2')
      // 6. Ensure double blank line before bullets if there's touching text
      .replace(/([^\n])\r?\n([-*] )/g, '$1\n\n$2');

    let i = 0;
    const interval = setInterval(() => {
      setOut(normalizedText.slice(0, i++));
      if (i > normalizedText.length) clearInterval(interval);
    }, 5);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="markdown-content" style={{ lineHeight: '1.6', fontSize: '1.05rem', marginTop: "20px" }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{out}</ReactMarkdown>
    </div>
  );
}
