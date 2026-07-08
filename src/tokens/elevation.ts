/**
 * MD3 Elevation トークン生成
 * box-shadow で5段階のエレベーションを定義
 */

/**
 * MD3 Elevation レベル
 * Level 0: 影なし
 * Level 1: 低い — カード、スイッチ等
 * Level 2: — FAB、メニュー等
 * Level 3: — ナビゲーションバー等
 * Level 4: — 未使用（予約）
 * Level 5: 高い — モーダル等
 */
const ELEVATION_LEVELS: Record<string, string> = {
  "level0": "none",
  "level1": "0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)",
  "level2": "0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15)",
  "level3": "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 4px 8px 3px rgba(0, 0, 0, 0.15)",
  "level4":
    "0 2px 3px 0 rgba(0, 0, 0, 0.3), 0 6px 10px 4px rgba(0, 0, 0, 0.15)",
  "level5":
    "0 4px 4px 0 rgba(0, 0, 0, 0.3), 0 8px 12px 6px rgba(0, 0, 0, 0.15)",
};

/**
 * エレベーショントークン CSS を生成する。
 */
export function generateElevationCSS(): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(ELEVATION_LEVELS)) {
    lines.push(`  --st-sys-elevation-${key}: ${value};`);
  }

  return `/* ==========================================================
 * Sawtooth CSS — Elevation Tokens
 * MD3 5-level elevation system
 * ========================================================== */

:root {
${lines.join("\n")}
}
`;
}

export { ELEVATION_LEVELS };
