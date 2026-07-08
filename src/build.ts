/**
 * Sawtooth CSS ビルドスクリプト
 *
 * 1. トークン生成（TypeScript → CSS）
 * 2. @import 解決（CSS ファイル結合）
 * 3. ミニファイ
 * 4. dist/ に出力
 */

import * as path from "jsr:@std/path@1";
import {
  DEFAULT_COLOR_CONFIG,
  generateColorCSS,
} from "../src/tokens/colors.ts";
import { generateTypographyCSS } from "../src/tokens/typography.ts";
import { generateSpacingCSS } from "../src/tokens/spacing.ts";
import { generateShapeCSS } from "../src/tokens/shape.ts";
import { generateElevationCSS } from "../src/tokens/elevation.ts";
import { generateMotionCSS } from "../src/tokens/motion.ts";

const ROOT_DIR = path.dirname(path.dirname(path.fromFileUrl(import.meta.url)));
const CSS_DIR = path.join(ROOT_DIR, "src", "css");
const DIST_DIR = path.join(ROOT_DIR, "dist");

/**
 * トークン CSS ファイルを生成して src/css/tokens/ に書き出す
 */
async function generateTokenCSS(): Promise<void> {
  const tokensDir = path.join(CSS_DIR, "tokens");

  const colorCSS = generateColorCSS(DEFAULT_COLOR_CONFIG);
  await Deno.writeTextFile(path.join(tokensDir, "_colors.css"), colorCSS);

  const typographyCSS = generateTypographyCSS();
  await Deno.writeTextFile(
    path.join(tokensDir, "_typography.css"),
    typographyCSS,
  );

  const spacingCSS = generateSpacingCSS();
  await Deno.writeTextFile(path.join(tokensDir, "_spacing.css"), spacingCSS);

  const shapeCSS = generateShapeCSS();
  await Deno.writeTextFile(path.join(tokensDir, "_shape.css"), shapeCSS);

  const elevationCSS = generateElevationCSS();
  await Deno.writeTextFile(
    path.join(tokensDir, "_elevation.css"),
    elevationCSS,
  );

  const motionCSS = generateMotionCSS();
  await Deno.writeTextFile(path.join(tokensDir, "_motion.css"), motionCSS);

  console.log("✅ トークン CSS を生成しました");
}

/**
 * CSS ファイルの @import を再帰的に解決して1つのファイルに結合する
 */
async function resolveImports(
  filePath: string,
  seen: Set<string> = new Set(),
): Promise<string> {
  const absolutePath = path.resolve(filePath);

  if (seen.has(absolutePath)) {
    return `/* [circular import skipped: ${path.basename(absolutePath)}] */\n`;
  }
  seen.add(absolutePath);

  const content = await Deno.readTextFile(absolutePath);
  const dir = path.dirname(absolutePath);
  const lines = content.split("\n");
  const result: string[] = [];

  for (const line of lines) {
    const importMatch = line.match(/^@import\s+["'](.+?)["']\s*;/);
    if (importMatch) {
      const importPath = path.resolve(dir, importMatch[1]);
      const importedContent = await resolveImports(importPath, seen);
      result.push(importedContent);
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

/**
 * CSS をミニファイする（コメント除去 + 空白圧縮）
 */
function minifyCSS(css: string): string {
  return css
    // ブロックコメントを除去
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // 連続する空行を1行に
    .replace(/\n\s*\n/g, "\n")
    // 行頭の空白を除去
    .replace(/^\s+/gm, "")
    // セレクタ/プロパティ周りの不要な空白を圧縮
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*;\s*/g, ";")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s*,\s*/g, ",")
    // 末尾の空白を除去
    .trim();
}

/**
 * メインビルド処理
 */
async function build(): Promise<void> {
  const startTime = performance.now();

  // 1. トークン生成
  await generateTokenCSS();

  // 2. @import 解決 + 結合
  const mainCSSPath = path.join(CSS_DIR, "main.css");
  const bundledCSS = await resolveImports(mainCSSPath);

  // 3. dist/ ディレクトリ作成
  await Deno.mkdir(DIST_DIR, { recursive: true });

  // 4. 結合済み CSS を出力
  const distPath = path.join(DIST_DIR, "sawtooth.css");
  await Deno.writeTextFile(distPath, bundledCSS);

  // 5. ミニファイ版を出力
  const minifiedCSS = minifyCSS(bundledCSS);
  const distMinPath = path.join(DIST_DIR, "sawtooth.min.css");
  await Deno.writeTextFile(distMinPath, minifiedCSS);

  const elapsed = (performance.now() - startTime).toFixed(0);
  const sizeKB = (new TextEncoder().encode(bundledCSS).length / 1024).toFixed(
    1,
  );
  const minSizeKB = (new TextEncoder().encode(minifiedCSS).length / 1024)
    .toFixed(1);

  console.log(`✅ ビルド完了 (${elapsed}ms)`);
  console.log(`   📄 dist/sawtooth.css     — ${sizeKB} KB`);
  console.log(`   📄 dist/sawtooth.min.css — ${minSizeKB} KB`);
}

// --watch フラグ対応
if (Deno.args.includes("--watch")) {
  console.log("👀 ファイル変更を監視中...");
  await build();

  const watcher = Deno.watchFs(CSS_DIR, { recursive: true });
  let debounceTimer: number | undefined;

  for await (const event of watcher) {
    if (event.kind === "modify" || event.kind === "create") {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        console.log("\n🔄 変更検出、リビルド中...");
        try {
          await build();
        } catch (e) {
          console.error("❌ ビルドエラー:", e);
        }
      }, 200);
    }
  }
} else {
  await build();
}
