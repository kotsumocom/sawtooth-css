/**
 * MD3 Shape トークン生成
 * border-radius スケール
 */

const SHAPE_SCALE: Record<string, string> = {
  "none": "0",
  "xs": "0.25rem", /* 4px - Extra Small */
  "sm": "0.5rem", /* 8px - Small */
  "md": "0.75rem", /* 12px - Medium */
  "lg": "1rem", /* 16px - Large */
  "xl": "1.75rem", /* 28px - Extra Large */
  "full": "624.9375rem", /* 9999px - Full (pill shape) */
};

/**
 * シェイプトークン CSS を生成する。
 */
export function generateShapeCSS(): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(SHAPE_SCALE)) {
    lines.push(`  --st-sys-shape-corner-${key}: ${value};`);
  }

  return `/* ==========================================================
 * Sawtooth CSS — Shape Tokens
 * MD3 Shape scale (7 levels)
 * ========================================================== */

:root {
${lines.join("\n")}
}
`;
}

export { SHAPE_SCALE };
