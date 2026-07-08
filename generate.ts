/**
 * Sawtooth CSS — カスタマイズジェネレータ
 *
 * テーマ設定に基づいてカスタム CSS を生成する。
 * Deno Fresh の dev.ts に組み込んで使用する。
 */

import * as path from "jsr:@std/path@1";
import type { GenerateOptions } from "./mod.ts";
import {
  type ColorThemeConfig,
  generateColorCSS,
} from "./src/tokens/colors.ts";
import { generateTypographyCSS } from "./src/tokens/typography.ts";
import { generateSpacingCSS } from "./src/tokens/spacing.ts";
import { generateShapeCSS } from "./src/tokens/shape.ts";
import { generateElevationCSS } from "./src/tokens/elevation.ts";
import { generateMotionCSS } from "./src/tokens/motion.ts";

/** 利用可能なコンポーネント名 */
const COMPONENT_FILES: Record<string, string> = {
  "button": "_button.css",
  "input": "_input.css",
  "textarea": "_textarea.css",
  "select": "_select.css",
  "card": "_card.css",
  "dialog": "_dialog.css",
  "menu": "_menu.css",
  "tabs": "_tabs.css",
  "alert": "_alert.css",
  "badge": "_badge.css",
  /* Phase 1: Form Controls */
  "checkbox": "_checkbox.css",
  "switch": "_switch.css",
  "radio-group": "_radio-group.css",
  "toggle": "_toggle.css",
  "toggle-group": "_toggle-group.css",
  "slider": "_slider.css",
  "number-input": "_number-input.css",
  "pin-input": "_pin-input.css",
  "password-input": "_password-input.css",
  "tags-input": "_tags-input.css",
  /* Phase 2: Overlay + Feedback */
  "tooltip": "_tooltip.css",
  "popover": "_popover.css",
  "hover-card": "_hover-card.css",
  "toast": "_toast.css",
  "drawer": "_drawer.css",
  "progress": "_progress.css",
  "progress-circular": "_progress-circular.css",
  "clipboard": "_clipboard.css",
  "presence": "_presence.css",
  "qr-code": "_qr-code.css",
  /* Phase 3: Navigation + Layout */
  "accordion": "_accordion.css",
  "collapsible": "_collapsible.css",
  "navigation-menu": "_navigation-menu.css",
  "pagination": "_pagination.css",
  "steps": "_steps.css",
  "segmented-control": "_segmented-control.css",
  "splitter": "_splitter.css",
  "scroll-area": "_scroll-area.css",
  /* Phase 4: Advanced Input + Pickers */
  "combobox": "_combobox.css",
  "listbox": "_listbox.css",
  "cascade-select": "_cascade-select.css",
  "date-picker": "_date-picker.css",
  "date-input": "_date-input.css",
  "color-picker": "_color-picker.css",
  "file-upload": "_file-upload.css",
  "editable": "_editable.css",
  "rating-group": "_rating-group.css",
  "signature-pad": "_signature-pad.css",
  /* Phase 5: Special + Visual */
  "avatar": "_avatar.css",
  "carousel": "_carousel.css",
  "floating-panel": "_floating-panel.css",
  "image-cropper": "_image-cropper.css",
  "marquee": "_marquee.css",
  "timer": "_timer.css",
  "tour": "_tour.css",
  "tree-view": "_tree-view.css",
  "angle-slider": "_angle-slider.css",
};

/**
 * テーマ設定に基づいてカスタム CSS を生成し、指定パスに書き出す。
 */
export async function generateSawtoothCSS(
  options: GenerateOptions,
): Promise<void> {
  const startTime = performance.now();
  const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
  const cssDir = path.join(moduleDir, "src", "css");

  // --- 1. トークン CSS を生成 ---
  const colorConfig: ColorThemeConfig = {
    primary: options.theme?.colors?.primary ?? "#6750A4",
    secondary: options.theme?.colors?.secondary,
    tertiary: options.theme?.colors?.tertiary,
    error: options.theme?.colors?.error,
  };

  const sections: string[] = [];

  // トークン
  sections.push(generateColorCSS(colorConfig));
  sections.push(generateTypographyCSS(
    options.theme?.typography
      ? {
        fontFamily: options.theme.typography.fontFamily,
      }
      : undefined,
  ));
  sections.push(generateSpacingCSS());
  sections.push(generateShapeCSS());
  sections.push(generateElevationCSS());
  sections.push(generateMotionCSS());

  // --- 2. ベーススタイル ---
  sections.push(
    await Deno.readTextFile(path.join(cssDir, "base", "_reset.css")),
  );
  sections.push(
    await Deno.readTextFile(path.join(cssDir, "base", "_global.css")),
  );

  // --- 3. コンポーネント ---
  const componentNames = options.components ?? Object.keys(COMPONENT_FILES);

  for (const name of componentNames) {
    const fileName = COMPONENT_FILES[name];
    if (!fileName) {
      console.warn(`⚠️  不明なコンポーネント: "${name}"（スキップ）`);
      continue;
    }
    const filePath = path.join(cssDir, "components", fileName);
    try {
      sections.push(await Deno.readTextFile(filePath));
    } catch {
      console.warn(`⚠️  コンポーネントファイルが見つかりません: ${filePath}`);
    }
  }

  // --- 4. ユーティリティ ---
  sections.push(
    await Deno.readTextFile(path.join(cssDir, "utilities", "_layout.css")),
  );

  // --- 5. 出力 ---
  const result = sections.join("\n\n");
  const absOutput = path.resolve(options.output);
  await Deno.mkdir(path.dirname(absOutput), { recursive: true });
  await Deno.writeTextFile(absOutput, result);

  const elapsed = (performance.now() - startTime).toFixed(0);
  const sizeKB = (new TextEncoder().encode(result).length / 1024).toFixed(1);

  console.log(
    `✅ Sawtooth CSS 生成完了 (${elapsed}ms) — ${sizeKB} KB → ${options.output}`,
  );
}
