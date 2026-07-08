/**
 * MD3 Typography (Type Scale) トークン生成
 */

/** タイポグラフィテーマ設定 */
export interface TypographyConfig {
  /** フォントファミリ */
  fontFamily?: string;
  /** フォントファミリ（ブランド用） */
  fontFamilyBrand?: string;
  /** フォントファミリ（プレーンテキスト用） */
  fontFamilyPlain?: string;
}

interface TypeStyle {
  fontFamily: "brand" | "plain";
  fontWeight: number;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
}

/**
 * MD3 Type Scale 定義
 * Display / Headline / Title / Body / Label × Large / Medium / Small
 */
const TYPE_SCALE: Record<string, TypeStyle> = {
  "display-large": {
    fontFamily: "brand",
    fontWeight: 400,
    fontSize: "3.5625rem",
    lineHeight: "4rem",
    letterSpacing: "-0.015625rem",
  },
  "display-medium": {
    fontFamily: "brand",
    fontWeight: 400,
    fontSize: "2.8125rem",
    lineHeight: "3.25rem",
    letterSpacing: "0",
  },
  "display-small": {
    fontFamily: "brand",
    fontWeight: 400,
    fontSize: "2.25rem",
    lineHeight: "2.75rem",
    letterSpacing: "0",
  },
  "headline-large": {
    fontFamily: "brand",
    fontWeight: 400,
    fontSize: "2rem",
    lineHeight: "2.5rem",
    letterSpacing: "0",
  },
  "headline-medium": {
    fontFamily: "brand",
    fontWeight: 400,
    fontSize: "1.75rem",
    lineHeight: "2.25rem",
    letterSpacing: "0",
  },
  "headline-small": {
    fontFamily: "brand",
    fontWeight: 400,
    fontSize: "1.5rem",
    lineHeight: "2rem",
    letterSpacing: "0",
  },
  "title-large": {
    fontFamily: "brand",
    fontWeight: 400,
    fontSize: "1.375rem",
    lineHeight: "1.75rem",
    letterSpacing: "0",
  },
  "title-medium": {
    fontFamily: "plain",
    fontWeight: 500,
    fontSize: "1rem",
    lineHeight: "1.5rem",
    letterSpacing: "0.009375rem",
  },
  "title-small": {
    fontFamily: "plain",
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    letterSpacing: "0.00625rem",
  },
  "body-large": {
    fontFamily: "plain",
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: "1.5rem",
    letterSpacing: "0.03125rem",
  },
  "body-medium": {
    fontFamily: "plain",
    fontWeight: 400,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    letterSpacing: "0.015625rem",
  },
  "body-small": {
    fontFamily: "plain",
    fontWeight: 400,
    fontSize: "0.75rem",
    lineHeight: "1rem",
    letterSpacing: "0.025rem",
  },
  "label-large": {
    fontFamily: "plain",
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    letterSpacing: "0.00625rem",
  },
  "label-medium": {
    fontFamily: "plain",
    fontWeight: 500,
    fontSize: "0.75rem",
    lineHeight: "1rem",
    letterSpacing: "0.03125rem",
  },
  "label-small": {
    fontFamily: "plain",
    fontWeight: 500,
    fontSize: "0.6875rem",
    lineHeight: "1rem",
    letterSpacing: "0.03125rem",
  },
};

/**
 * タイポグラフィトークン CSS を生成する。
 */
export function generateTypographyCSS(config?: TypographyConfig): string {
  const brandFont = config?.fontFamilyBrand ?? config?.fontFamily ??
    '"Roboto", "Noto Sans JP", system-ui, sans-serif';
  const plainFont = config?.fontFamilyPlain ?? config?.fontFamily ??
    '"Roboto", "Noto Sans JP", system-ui, sans-serif';

  const lines: string[] = [];

  lines.push(`  /* Font families */`);
  lines.push(`  --st-sys-typescale-font-family-brand: ${brandFont};`);
  lines.push(`  --st-sys-typescale-font-family-plain: ${plainFont};`);
  lines.push("");

  for (const [name, style] of Object.entries(TYPE_SCALE)) {
    const familyVar = style.fontFamily === "brand"
      ? "var(--st-sys-typescale-font-family-brand)"
      : "var(--st-sys-typescale-font-family-plain)";

    lines.push(`  /* ${name} */`);
    lines.push(`  --st-sys-typescale-${name}-font: ${familyVar};`);
    lines.push(`  --st-sys-typescale-${name}-weight: ${style.fontWeight};`);
    lines.push(`  --st-sys-typescale-${name}-size: ${style.fontSize};`);
    lines.push(
      `  --st-sys-typescale-${name}-line-height: ${style.lineHeight};`,
    );
    lines.push(
      `  --st-sys-typescale-${name}-tracking: ${style.letterSpacing};`,
    );
    lines.push("");
  }

  return `/* ==========================================================
 * Sawtooth CSS — Typography Tokens
 * MD3 Type Scale (15 styles)
 * ========================================================== */

:root {
${lines.join("\n")}
}
`;
}

export { TYPE_SCALE };
