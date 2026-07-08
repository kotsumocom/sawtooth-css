/**
 * MD3 Spacing トークン生成
 * 4px ベースのスペーシングスケール
 */

const SPACING_SCALE: Record<string, string> = {
  "0": "0",
  "1": "0.25rem", /* 4px */
  "2": "0.5rem", /* 8px */
  "3": "0.75rem", /* 12px */
  "4": "1rem", /* 16px */
  "5": "1.25rem", /* 20px */
  "6": "1.5rem", /* 24px */
  "8": "2rem", /* 32px */
  "10": "2.5rem", /* 40px */
  "12": "3rem", /* 48px */
  "14": "3.5rem", /* 56px */
  "16": "4rem", /* 64px */
};

/**
 * スペーシングトークン CSS を生成する。
 */
export function generateSpacingCSS(): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(SPACING_SCALE)) {
    lines.push(`  --st-sys-spacing-${key}: ${value};`);
  }

  return `/* ==========================================================
 * Sawtooth CSS — Spacing Tokens
 * 4px base scale
 * ========================================================== */

:root {
${lines.join("\n")}
}
`;
}

export { SPACING_SCALE };
