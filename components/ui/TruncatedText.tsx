import { useState } from "react";

interface TruncatedTextProps {
  text: string;
  maxChars?: number;
  className?: string;
}

export default function TruncatedText({
  text,
  maxChars = 150,
  className = "",
}: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncateText = (text: string, maxChars: number) => {
    if (text.length <= maxChars) {
      return { text, isTruncated: false };
    }

    const truncatedText = text.substring(0, maxChars);

    return { text: truncatedText, isTruncated: true };
  };

  const { text: displayText, isTruncated } = truncateText(text, maxChars);
  const shouldShowReadMore = isTruncated && !isExpanded;
  const finalText = isExpanded ? text : displayText;

  return (
    <div className={`whitespace-pre-line ${className}`}>
      {finalText}
      {shouldShowReadMore && (
        <>
          ...
          <button
            onClick={() => setIsExpanded(true)}
            className="ml-1 text-blue-600 hover:text-blue-800 font-medium text-xs"
          >
            Read More
          </button>
        </>
      )}
      {isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          className="ml-1 text-blue-600 hover:text-blue-800 font-medium text-xs"
        >
          Read Less
        </button>
      )}
    </div>
  );
}
