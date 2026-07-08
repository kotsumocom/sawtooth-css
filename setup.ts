/**
 * @module
 * Sawtooth CSS — ゼロコンフィグセットアップ
 *
 * プリビルトの CSS ファイルを指定パスにコピーする。
 *
 * @example
 * ```ts
 * import { setupSawtoothCSS } from "@kotsumo/sawtooth-css/setup";
 *
 * await setupSawtoothCSS("./static/sawtooth.css");
 * ```
 */

import * as path from "jsr:@std/path@1";

/**
 * プリビルトの sawtooth.css を指定パスにコピーする。
 * すでに存在する場合はソースが新しい場合のみ上書きする。
 *
 * @param outputPath - 出力先ファイルパス（例: "./static/sawtooth.css"）
 */
export async function copySawtoothCSS(outputPath: string): Promise<void> {
  const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
  const sourcePath = path.join(moduleDir, "dist", "sawtooth.css");

  const absOutput = path.resolve(outputPath);

  // ソースファイルの存在確認
  try {
    await Deno.stat(sourcePath);
  } catch {
    throw new Error(
      `Sawtooth CSS のプリビルトファイルが見つかりません: ${sourcePath}\n` +
        `先に 'deno task build' を実行してください。`,
    );
  }

  // 出力先が最新かチェック
  try {
    const [sourceStat, outputStat] = await Promise.all([
      Deno.stat(sourcePath),
      Deno.stat(absOutput),
    ]);

    if (
      outputStat.mtime && sourceStat.mtime &&
      outputStat.mtime >= sourceStat.mtime
    ) {
      console.log(`⏭️  sawtooth.css は最新です（スキップ）`);
      return;
    }
  } catch {
    // 出力先が存在しない場合は続行
  }

  // ディレクトリ作成
  await Deno.mkdir(path.dirname(absOutput), { recursive: true });

  // コピー
  await Deno.copyFile(sourcePath, absOutput);
  console.log(`✅ sawtooth.css → ${outputPath}`);
}
