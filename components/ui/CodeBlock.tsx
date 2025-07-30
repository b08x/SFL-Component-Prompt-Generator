import React, { useState, useCallback } from 'react';

interface CodeBlockProps {
  content: string;
  language?: string;
  wrapText?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ content, language = 'text', wrapText = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [content]);

  return (
    <div className="bg-[#212934] rounded-lg overflow-hidden my-4 relative border border-[#5c6f7e]">
      <div className="flex justify-between items-center px-4 py-2 bg-[#333e48]">
        <span className="text-xs font-semibold text-[#95aac0] uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="text-[#95aac0] hover:text-gray-200 transition-colors text-sm flex items-center"
        >
          {copied ? (
            <span className="flex items-center text-green-400">
              <i className="fas fa-check mr-2"></i> Copied!
            </span>
          ) : (
            <>
              <i className="far fa-copy mr-2"></i> Copy
            </>
          )}
        </button>
      </div>
      <pre className={`p-4 text-sm text-gray-200 overflow-x-auto ${wrapText ? 'whitespace-pre-wrap' : ''}`}>
        <code className={wrapText ? 'break-words' : ''}>{content}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;