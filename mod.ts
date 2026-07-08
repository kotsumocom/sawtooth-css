/**
 * @module
 * Sawtooth CSS — MD3 準拠の依存ゼロ CSS デザインシステム
 *
 * Deno Fresh + Zag.js と組み合わせて使用する。
 * テーマ設定の型定義と CSS 生成オプションを提供する。
 *
 * @example
 * ```ts
 * import type { SawtoothTheme, GenerateOptions } from "@kotsumo/sawtooth-css";
 *
 * const theme: SawtoothTheme = {
 *   colors: { primary: "#6750A4" },
 * };
 * ```
 */

export type { ColorThemeConfig } from "./src/tokens/colors.ts";
export type { TypographyConfig } from "./src/tokens/typography.ts";

/** Sawtooth CSS テーマ設定 */
export interface SawtoothTheme {
  /** カラー設定 */
  colors?: {
    /** Primary カラー (HEX) */
    primary?: string;
    /** Secondary カラー (HEX) — 省略時は Primary から自動生成 */
    secondary?: string;
    /** Tertiary カラー (HEX) — 省略時は Primary から自動生成 */
    tertiary?: string;
    /** Error カラー (HEX) — デフォルト: #B3261E */
    error?: string;
  };
  /** タイポグラフィ設定 */
  typography?: {
    /** フォントファミリ */
    fontFamily?: string;
  };
}

/** CSS 生成オプション */
export interface GenerateOptions {
  /** 出力先ファイルパス */
  output: string;
  /** テーマ設定 */
  theme?: SawtoothTheme;
  /** 含めるコンポーネント（省略時は全コンポーネント） */
  components?: string[];
}
