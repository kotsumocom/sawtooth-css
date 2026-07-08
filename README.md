# Sawtooth CSS

依存ゼロの CSS デザインシステム。Deno Fresh + Zag.js と組み合わせて使用します。

Material Design 3
に準拠したデザイントークンとコンポーネントスタイルを提供します。

## 特徴

- 🎨 **MD3 準拠** — HCT 色空間による正確なカラーシステム
- 🔌 **依存ゼロ** — 出力は純粋な CSS ファイルのみ
- ⚡ **Deno Fresh 統合** — `dev.ts` に1行追加するだけ
- 🦎 **Zag.js 対応** — `data-scope` / `data-part` / `data-state` セレクタ
- 🌗 **テーマ対応** — ライト/ダーク自動切替
- ♿ **アクセシブル** — WCAG 2.2 準拠のコントラスト比

## インストール

```ts
// deno.json
{
  "imports": {
    "@kotsumo/sawtooth-css": "jsr:@kotsumo/sawtooth-css@^0.1.0"
  }
}
```

## 使い方

### ゼロコンフィグ（プリビルト CSS）

```ts
// dev.ts
import { copySawtoothCSS } from "@kotsumo/sawtooth-css/setup";
await copySawtoothCSS("./static/sawtooth.css");
```

### テーマカスタマイズ

```ts
// dev.ts
import { generateSawtoothCSS } from "@kotsumo/sawtooth-css/generate";

await generateSawtoothCSS({
  output: "./static/sawtooth.css",
  theme: {
    colors: { primary: "#0284c7" },
  },
});
```

### HTML

```html
<link rel="stylesheet" href="/sawtooth.css" />
```

## 開発

```bash
# ビルド
deno task build

# ファイル監視 + 自動ビルド
deno task dev

# デモページプレビュー
deno task preview
```

## ライセンス

MIT
