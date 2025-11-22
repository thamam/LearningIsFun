import React from 'react';

interface MathTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * MathText - A reusable wrapper for mathematical expressions
 *
 * Purpose:
 * - Forces Left-to-Right (LTR) layout for math equations (e.g., "10 / 2 = 5")
 * - Uses unicode-bidi: isolate to prevent interference with surrounding RTL Hebrew text
 * - Uses monospace font for consistent math rendering
 *
 * Usage:
 * <MathText>___ / 5 = 8</MathText>
 *
 * Future: This component can be easily extended to use KaTeX or MathJax
 * by modifying only this file, and the entire app will update automatically.
 */
export const MathText = ({ children, className = "" }: MathTextProps) => {
  return (
    <span
      dir="ltr"
      style={{ unicodeBidi: 'isolate' }}
      className={`inline-block font-mono ${className}`}
    >
      {children}
    </span>
  );
};
