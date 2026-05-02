# Next.js ToDoアプリ

Next.js 16 / React 19 App Router の実践的な学習を目的として開発したタスク管理アプリです。

---

## 背景・目的

Next.js の App Router は、従来の Pages Router と設計思想が大きく異なります。Server Components・Server Actions・Route Handler の役割分担や、データフェッチをサーバー側に寄せる新しいパターンは、ドキュメントを読むだけでは理解しにくい部分が多くあります。

このプロジェクトは、「シンプルな CRUD アプリを App Router の作法で正しく実装する」ことを主眼に置いています。TODO という題材はシンプルですが、**作成・一覧・編集・削除・フィルタリング**というすべての基本操作を含むため、実装パターンの確認に適しています。

### 技術的に意識した点

- **Server Components からの直接 DB 呼び出し**：`page.tsx` で `fetch` を介さず Mongoose を直接呼ぶことで、不要なネットワークラウンドトリップを排除
- **Server Actions によるミューテーション**：フォーム送信を API Route ではなく Server Actions で処理し、クライアントの JavaScript を最小化
- **Middleware による認証**：環境変数フラグで Basic 認証を ON/OFF できる仕組みを実装し、本番デプロイ時のアクセス制御に対応

---

## 主な機能

| 機能 | 説明 |
|---|---|
| タスクの作成・編集・削除 | タイトル・説明・期限日を管理 |
| ステータス管理 | 完了済み / 進行中を切り替え可能 |
| フィルタリング | すべて・未完了・完了済みで絞り込み |
| 期限切れ検出 | 期限を過ぎたタスクを自動判定して一覧表示 |
| 期限間近アラート | 期限まで3日以内のタスクをカード上で強調表示 |
| Basic 認証 | 環境変数で有効化できる簡易アクセス制限 |

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 16 / React 19 (App Router) |
| 言語 | TypeScript |
| データベース | MongoDB Atlas + Mongoose |
| スタイリング | Tailwind CSS |
| デプロイ | Vercel（想定） |

---

## セットアップ

### 1. リポジトリのクローンと依存関係のインストール

```bash
git clone <リポジトリURL>
cd todo-next
npm install
```

### 2. MongoDB Atlas の準備

1. [MongoDB Atlas](https://www.mongodb.com/atlas) でプロジェクトとクラスターを作成する（フリープラン可）
2. Network Access に `0.0.0.0/0` を追加する
3. Database Access でユーザーを作成し、接続文字列を取得する

### 3. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成して以下を設定してください。

```env
# MongoDB 接続文字列
DB_URI=mongodb+srv://<ユーザー名>:<パスワード>@<クラスター>.mongodb.net/...

# Basic 認証（省略可。"true" にすると有効化）
IS_BASIC_AUTH_ENABLED=true
BASIC_AUTH_USER=<ユーザー名>
BASIC_AUTH_PASS=<パスワード>
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

---

## コマンド

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用ビルド（型チェック含む） |
| `npm run start` | ビルド済みアプリを起動 |
| `npm run lint` | ESLint による静的解析 |

---

## ディレクトリ構成（主要部分）

```
src/
├── app/
│   ├── (main)/          # サイドメニューレイアウトを共有するルートグループ
│   │   ├── page.tsx     # タスク一覧（トップ）
│   │   ├── completed/   # 完了済みタスク一覧
│   │   ├── expired/     # 期限切れタスク一覧
│   │   ├── new/         # タスク新規作成
│   │   └── edit/[id]/   # タスク編集
│   └── api/tasks/       # Route Handler（外部向け API: GET / [id] / completed / expired）
├── actions/
│   └── task.ts          # Server Actions（作成・更新・削除）
├── models/
│   └── task.ts          # Mongoose スキーマ・型定義
└── utils/
    └── database.ts      # MongoDB 接続処理
```
