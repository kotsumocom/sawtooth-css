/**
 * HCT ベースのカラートークン生成
 *
 * @material/material-color-utilities を使用して、
 * MD3 準拠の Tonal Palette と System Color Token を生成する。
 */

import {
  argbFromHex,
  Hct,
  hexFromArgb,
  TonalPalette,
} from "@material/material-color-utilities";

/** カラーテーマ設定 */
export interface ColorThemeConfig {
  /** Primary カラー（HEX） — 必須 */
  primary: string;
  /** Secondary カラー（HEX） — 省略時は Primary から自動生成 */
  secondary?: string;
  /** Tertiary カラー（HEX） — 省略時は Primary から自動生成 */
  tertiary?: string;
  /** Neutral カラー（HEX） — 省略時は Primary から自動生成 */
  neutral?: string;
  /** Neutral Variant カラー（HEX） — 省略時は Primary から自動生成 */
  neutralVariant?: string;
  /** Error カラー（HEX） — 省略時はデフォルト #B3261E */
  error?: string;
}

/** Tonal Palette の各トーンレベル */
const TONE_LEVELS = [
  0,
  4,
  6,
  10,
  12,
  17,
  20,
  22,
  24,
  30,
  40,
  50,
  60,
  70,
  80,
  87,
  90,
  92,
  94,
  95,
  96,
  98,
  99,
  100,
] as const;

/** System Color Role のマッピング定義 */
interface ColorRoleMapping {
  palette:
    | "primary"
    | "secondary"
    | "tertiary"
    | "neutral"
    | "neutralVariant"
    | "error";
  lightTone: number;
  darkTone: number;
}

const SYSTEM_COLOR_ROLES: Record<string, ColorRoleMapping> = {
  "primary": { palette: "primary", lightTone: 40, darkTone: 80 },
  "on-primary": { palette: "primary", lightTone: 100, darkTone: 20 },
  "primary-container": { palette: "primary", lightTone: 90, darkTone: 30 },
  "on-primary-container": { palette: "primary", lightTone: 10, darkTone: 90 },
  "secondary": { palette: "secondary", lightTone: 40, darkTone: 80 },
  "on-secondary": { palette: "secondary", lightTone: 100, darkTone: 20 },
  "secondary-container": { palette: "secondary", lightTone: 90, darkTone: 30 },
  "on-secondary-container": {
    palette: "secondary",
    lightTone: 10,
    darkTone: 90,
  },
  "tertiary": { palette: "tertiary", lightTone: 40, darkTone: 80 },
  "on-tertiary": { palette: "tertiary", lightTone: 100, darkTone: 20 },
  "tertiary-container": { palette: "tertiary", lightTone: 90, darkTone: 30 },
  "on-tertiary-container": { palette: "tertiary", lightTone: 10, darkTone: 90 },
  "error": { palette: "error", lightTone: 40, darkTone: 80 },
  "on-error": { palette: "error", lightTone: 100, darkTone: 20 },
  "error-container": { palette: "error", lightTone: 90, darkTone: 30 },
  "on-error-container": { palette: "error", lightTone: 10, darkTone: 90 },
  "surface": { palette: "neutral", lightTone: 99, darkTone: 10 },
  "on-surface": { palette: "neutral", lightTone: 10, darkTone: 90 },
  "surface-variant": { palette: "neutralVariant", lightTone: 90, darkTone: 30 },
  "on-surface-variant": {
    palette: "neutralVariant",
    lightTone: 30,
    darkTone: 80,
  },
  "surface-container-lowest": {
    palette: "neutral",
    lightTone: 100,
    darkTone: 4,
  },
  "surface-container-low": { palette: "neutral", lightTone: 96, darkTone: 10 },
  "surface-container": { palette: "neutral", lightTone: 94, darkTone: 12 },
  "surface-container-high": { palette: "neutral", lightTone: 92, darkTone: 17 },
  "surface-container-highest": {
    palette: "neutral",
    lightTone: 90,
    darkTone: 22,
  },
  "outline": { palette: "neutralVariant", lightTone: 50, darkTone: 60 },
  "outline-variant": { palette: "neutralVariant", lightTone: 80, darkTone: 30 },
  "inverse-surface": { palette: "neutral", lightTone: 20, darkTone: 90 },
  "inverse-on-surface": { palette: "neutral", lightTone: 95, darkTone: 20 },
};

/** 生成された Tonal Palette セット */
export interface TonalPaletteSet {
  primary: TonalPalette;
  secondary: TonalPalette;
  tertiary: TonalPalette;
  neutral: TonalPalette;
  neutralVariant: TonalPalette;
  error: TonalPalette;
}

/**
 * Primary カラーから Secondary / Tertiary / Neutral を自動生成する。
 * SchemeTonalSpot 相当のロジック:
 * - Secondary: 同じ Hue、Chroma を 16 に抑制
 * - Tertiary: Hue を +60° 回転、Chroma を 24
 * - Neutral: 同じ Hue、Chroma を 4
 * - Neutral Variant: 同じ Hue、Chroma を 8
 */
function derivePalettes(config: ColorThemeConfig): TonalPaletteSet {
  const primaryArgb = argbFromHex(config.primary);
  const primaryHct = Hct.fromInt(primaryArgb);

  const primary = TonalPalette.fromInt(primaryArgb);

  const secondary = config.secondary
    ? TonalPalette.fromInt(argbFromHex(config.secondary))
    : TonalPalette.fromHueAndChroma(primaryHct.hue, 16);

  const tertiary = config.tertiary
    ? TonalPalette.fromInt(argbFromHex(config.tertiary))
    : TonalPalette.fromHueAndChroma(primaryHct.hue + 60, 24);

  const neutral = config.neutral
    ? TonalPalette.fromInt(argbFromHex(config.neutral))
    : TonalPalette.fromHueAndChroma(primaryHct.hue, 4);

  const neutralVariant = config.neutralVariant
    ? TonalPalette.fromInt(argbFromHex(config.neutralVariant))
    : TonalPalette.fromHueAndChroma(primaryHct.hue, 8);

  const error = config.error
    ? TonalPalette.fromInt(argbFromHex(config.error))
    : TonalPalette.fromInt(argbFromHex("#B3261E"));

  return { primary, secondary, tertiary, neutral, neutralVariant, error };
}

/**
 * Reference Token の CSS Custom Properties を生成する。
 * 例: --st-ref-primary-40: #6750A4;
 */
function generateRefTokens(palettes: TonalPaletteSet): string {
  const lines: string[] = [];
  const paletteNames = [
    "primary",
    "secondary",
    "tertiary",
    "neutral",
    "neutral-variant",
    "error",
  ] as const;
  const paletteKeys: (keyof TonalPaletteSet)[] = [
    "primary",
    "secondary",
    "tertiary",
    "neutral",
    "neutralVariant",
    "error",
  ];

  for (let i = 0; i < paletteNames.length; i++) {
    const name = paletteNames[i];
    const palette = palettes[paletteKeys[i]];
    lines.push(`  /* ${name} tonal palette */`);
    for (const tone of TONE_LEVELS) {
      const hex = hexFromArgb(palette.tone(tone));
      lines.push(`  --st-ref-${name}-${tone}: ${hex};`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * System Color Token の CSS Custom Properties を生成する。
 */
function generateSysColorTokens(
  palettes: TonalPaletteSet,
  mode: "light" | "dark",
): string {
  const lines: string[] = [];

  for (const [role, mapping] of Object.entries(SYSTEM_COLOR_ROLES)) {
    const palette = palettes[mapping.palette];
    const tone = mode === "light" ? mapping.lightTone : mapping.darkTone;
    const hex = hexFromArgb(palette.tone(tone));
    lines.push(`  --st-sys-color-${role}: ${hex};`);
  }

  return lines.join("\n");
}

/**
 * カラートークン CSS 全体を生成する。
 */
export function generateColorCSS(config: ColorThemeConfig): string {
  const palettes = derivePalettes(config);

  const refTokens = generateRefTokens(palettes);
  const lightSysTokens = generateSysColorTokens(palettes, "light");
  const darkSysTokens = generateSysColorTokens(palettes, "dark");

  return `/* ==========================================================
 * Sawtooth CSS — Color Tokens
 * Generated from primary: ${config.primary}
 * HCT color space via @material/material-color-utilities
 * ========================================================== */

/* --- Reference Tokens (Tonal Palette) --- */
:root {
${refTokens}
}

/* --- System Color Tokens (Light Theme — Default) --- */
:root {
${lightSysTokens}
}

/* --- System Color Tokens (Dark Theme) --- */
[data-theme="dark"] {
${darkSysTokens}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${darkSysTokens.split("\n").map((l) => "  " + l).join("\n")}
  }
}
`;
}

/** MD3 Baseline のデフォルトカラー設定 */
export const DEFAULT_COLOR_CONFIG: ColorThemeConfig = {
  primary: "#6750A4",
};

// パレット派生関数もエクスポート（テスト用）
export { derivePalettes, SYSTEM_COLOR_ROLES, TONE_LEVELS };
