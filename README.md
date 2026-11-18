# Kuroco Nuxt Auth

Kuroco API と連携する Nuxt 4 のサンプルアプリです。ログイン・ログアウト、会員登録、プロフィール編集、記事閲覧、お気に入り、問い合わせ機能を備えています。

## 技術構成

- Node.js 26（ローカル環境のバージョンは [`.nvmrc`](.nvmrc) を参照）
- Nuxt 4 / Vue 3 / Vuetify 3
- FormKit、Nuxt Snackbar
- Nuxt I18n 10 / Vue I18n 11（英語・日本語）
- Kuroco API / KurocoFront

## ローカル開発

プロジェクトルートで、`.nvmrc` に指定された Node.js を使用してください。`nvm` を利用する場合:

```bash
nvm install
nvm use
npm ci
npm run dev
```

起動後、ターミナルに表示された URL（通常は `http://localhost:3000`）を開きます。

`npm ci` は `package-lock.json` に記録された依存関係をインストールします。インストール時に `nuxt prepare` と Husky のセットアップが実行されます。

依存パッケージを追加・更新する場合は `npm install` を使用し、`package.json` と `package-lock.json` の変更を併せてコミットしてください。

## ビルドとプレビュー

KurocoFront 向けの静的ファイルを生成します。GitHub Actions でも同じコマンドを使用します。

```bash
npm run generate
```

出力先は `.output/public/` です。生成したサイトをローカルで確認する場合:

```bash
npm run preview
```

各コマンドの用途:

| コマンド | 用途 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run generate` | 静的サイトを生成（KurocoFront へのデプロイ用） |
| `npm run build` | 本番用ビルドを実行（SSR サーバー用。KurocoFront では `generate` を使用） |
| `npm run preview` | 直前のビルド・生成結果をプレビュー |
| `npx nuxt prepare` | Nuxt の型と設定ファイルを再生成 |

## ディレクトリ構成

Nuxt 4 の `app/` 構成を使用しています。

```text
app/
  app.vue               # アプリのエントリーポイント
  assets/               # SCSS・画像
  components/           # 共通部品・記事表示部品
  composables/          # 認証・API 接続先の管理
  layouts/              # 通常画面・プレビュー画面のレイアウト
  pages/                # ファイルベースのルーティング
  plugins/              # Vuetify の登録
i18n/
  i18n.config.ts        # Vue I18n の設定
  locales/
    en.json
    ja.json
public/
  kuroco_front.json     # KurocoFront の配信設定
server/                 # Nuxt サーバー用の領域
.github/workflows/      # ビルド・デプロイ設定
formkit.config.ts       # FormKit の設定
nuxt.config.ts          # Nuxt・モジュールの設定
tsconfig.json          # Nuxt が生成する型設定へのプロジェクト参照
```

## Kuroco API と認証

既定の接続先は `https://dev-nuxt-auth.a.kuroco.app` です。

- 認証と画面からの API リクエストの接続先は [`app/composables/useAuth.js`](app/composables/useAuth.js) で管理しています。
- ログイン・会員登録画面で指定したサイトキーはブラウザーの `localStorage` に保存され、次回起動時に復元されます。
- `nuxt.config.ts` の `runtimeConfig.public.kurocoApiDomain` は別の設定値です。既定の API 接続先を変更する際は、`useAuth.js` の初期値と URL の組み立ても確認してください。
- ローカル開発先のオリジンを Kuroco 側の CORS 設定で許可し、Cookie 認証に必要な設定を行ってください。ブラウザーのクロスサイト Cookie 制限にも依存します。

## コード整形・Lint

コミット時に Husky と lint-staged が以下を実行します。

- JavaScript・Vue ファイル: Prettier と ESLint
- `app/assets/` 内の CSS・SCSS: Prettier

ESLint のルールは [`eslint.config.mjs`](eslint.config.mjs) で管理しています。

## 参考資料

- [Nuxt 4 ドキュメント](https://nuxt.com/docs/4.x/getting-started/introduction)
- [Nuxt I18n ドキュメント](https://i18n.nuxtjs.org/)
- [Kuroco ドキュメント](https://kuroco.app/ja/docs/)
