# ⚠️ このパッケージは `@kotsumo/sawcase` に統合されました

## 移行先

```bash
deno add @kotsumo/sawcase
```

Sawtooth CSS のデザイントークン、UI コンポーネント CSS、HCT カラー生成機能は
すべて [`@kotsumo/sawcase@1.0.0`](https://jsr.io/@kotsumo/sawcase) に統合されました。

### 変更点

- CSS 変数プレフィックス: `--st-sys-*` → `--sc-sys-*`
- CSS 変数プレフィックス: `--st-ref-*` → `--sc-ref-*`
- `generateSawtoothCSS()` → `generateSawcaseCSS()`
- デフォルト CSS は `import "@kotsumo/sawcase/styles"` で即利用可能

### 詳細

[Sawcase ドキュメント](https://sawcase.kotsumo.deno.net/docs) をご覧ください。
