# 設計書: 認証基盤とマルチユーザー化

- 作成日: 2026-09-19
- 対象リポジトリ: `pp-no/todo-next`
- ステータス: 確定（実装計画の作成待ち）

---

## 1. 背景と目的

本アプリは Next.js 16 / React 19 の App Router を学習する目的で作られた単一ユーザー前提の TODO アプリである。現状は `src/proxy.ts` の Basic 認証でアクセス全体を塞いでいるだけで、**ユーザーという概念が存在しない**。

今回の改修は **ポートフォリオとしての価値を高めること**を主目的とし、その中核として認証・認可を導入する。評価軸は機能の多さではなく、**設計判断の妥当性が読み取れること**に置く。

### 前提となる方針

- **非推奨 API を使わない。** 現時点で deprecated なもの、および将来非推奨になることが確定しているものは新規に書かない。
- 既存の MongoDB 上のタスクデータは学習用のため**破棄してよい**。マイグレーションは不要。

---

## 2. 現状の課題

| 領域 | 課題 |
|---|---|
| 認証 | ユーザーの概念がない。Basic 認証は「全員が同じ1人」として扱われる |
| 認可 | 存在しない |
| 情報漏洩 | `next.config.mjs` の `env` に Basic 認証の ID/パスワードを置いており、**ビルド時にクライアントバンドルへ埋め込まれブラウザから読める** |
| API | `src/app/api/tasks/*` が proxy の matcher から除外されており、**認証なしで全タスクを取得できる** |
| 依存 | `package.json` の `"lint": "next lint"` は Next.js 16 で削除済みのコマンド |
| 依存 | `.eslintrc.json` は ESLint 9 で非推奨の旧形式 |
| 型 | `interface TaskDocument extends Task, Document { _id: string }` は Mongoose の型と衝突する既知のアンチパターン |
| 状態更新 | `src/actions/task.ts` が `state.error = '...'` と引数を直接書き換えている。React の状態更新として不正で、再レンダリングされない可能性がある |

---

## 3. 全体ロードマップ

| Phase | テーマ | 内容 |
|---|---|---|
| **1** | **認証基盤とマルチユーザー化** | 本設計書の対象。next-auth v5 導入 / User モデル / Task への `userId` / DAL 構築 / proxy.ts 置換 / `/api/tasks/*` 削除 / 秘密情報漏洩の修正 / ESLint flat config 移行 / 認可テスト |
| 2 | 堅牢化と品質基盤 | Zod バリデーション / `dueDate` を `string`→`Date` / mongoose 8→9 更新 / パスワードリセット（メール送信基盤の導入を伴う） / Vitest の対象拡大 / Playwright E2E / GitHub Actions CI |
| 3 | 機能拡張 | サーバーサイドページネーション（未接続の `PagiNation` を活用） / タグ・優先度 / 検索 / `useOptimistic` による完了トグルの即時反映 / アカウント連携画面 |
| 4 | 体験・運用 | ダークモード / ダッシュボード / Tailwind v4 移行 / アクセシビリティ / PWA |

Phase 2 以降は概要のみ。各 Phase は実装着手前に個別の設計書を作成する。

---

## 4. Phase 1 のスコープ

### 含むもの

- next-auth v5 によるセッション管理
- メール/パスワード認証（登録・ログイン・ログアウト）
- OAuth 認証（GitHub / Google）
- User モデルの新設、Task への `userId` 付与
- データアクセス層（DAL）の構築と、全データ操作の DAL 経由への移行
- `src/proxy.ts` の Basic 認証からセッション判定への置換
- 第2章に挙げた技術的負債のうち、認証改修で同じファイルを触るもの
- DAL の所有権強制を検証する単体テスト

### 含まないもの（非スコープ）

| 項目 | 理由 |
|---|---|
| パスワードリセット | メール送信基盤（Resend 等）の導入が必要でスコープが膨らむ。Phase 2 へ |
| メールアドレスの確認（verification） | 同上 |
| アカウント連携画面（後からの OAuth 紐付け） | 認証の芯とは別機能。Phase 3 へ |
| 2要素認証 | 個人利用のポートフォリオには過剰 |
| タスクの共有・コラボレーション | マルチユーザー化の先の話。ロードマップ外 |
| DB を PostgreSQL へ移行 | 第5章に記載の通り見送り |

---

## 5. 技術選定と根拠

### 5.1 認証ライブラリ: `next-auth@5.0.0-beta.32`

調査時点（2026-09-19）の状況は以下の通り。

| 候補 | 状況 | 判断 |
|---|---|---|
| `next-auth` v5 | `5.0.0-beta.32`。**beta のまま** | **採用** |
| `next-auth` v4 | `4.24.15`（latest）。App Router では `getServerSession` 等の旧作法になる | 不採用。**v5 での置換が確定しているコードを新規に書くことになり、非推奨回避の方針に反する** |
| `better-auth` | `1.7.5`。安定版かつモダン | 次点。日本語情報が少ない点で見送り |
| `lucia` | **公式に deprecated 済み** | 除外 |
| `@clerk/nextjs` | マネージド型 | 認証実装力を示す目的に合わない |

beta を採用する判断について。beta 表記のまま 2 年以上 production 採用が積み上がっており、Vercel 公式テンプレートも v5 系で、API は事実上固まっている。**安定版の v4 を選ぶ方がむしろ「今から将来非推奨になるコードを書く」ことになる**ため、v5 を採る。

リスク対策として **`^` を付けず `5.0.0-beta.32` に完全固定**する。beta 間の破壊的変更を踏まないため。

### 5.2 パスワードハッシュ: `bcryptjs@3.0.3`

`bcrypt` は C++ のネイティブビルドを要し Vercel などのデプロイで失敗しやすい。`bcryptjs` は純 JavaScript 実装で環境を選ばない。

### 5.3 DB: MongoDB + Mongoose を継続

移行先候補を調査した結果、**両 ORM がメジャーバージョン移行の過渡期**にあった。

| 候補 | 状況 |
|---|---|
| Prisma | `@prisma/client` の latest は 7.10.0 だが、CLI `prisma` の latest は `8.0.0-rc.15`。**rc が latest タグに乗っており**、安定構成にするには CLI のバージョン明示が必要 |
| Drizzle | latest が `0.45.2`（1.0 未満）。`1.0.0-rc.5` が進行中 |
| Mongoose | `9.10.1` が素直な安定版 |

加えて、**DB 移行と認証導入を同時に行うと不具合の切り分けができなくなる**。今回の目的は認証・認可の設計力を示すことであり、DB の種類はその価値を左右しない。よって MongoDB を継続する。

ただし弱点として、ユーザー↔タスクの 1 対多という素直にリレーショナルなデータに対して NoSQL を選んでいる点は認識しておく。RDB の経験を示す必要が生じた場合は別プロジェクトで補う。

なお `mongoose` の 8→9 更新は破壊的変更を伴うため、認証と同時に行わず **Phase 2 に回す**。

### 5.4 テスト: Vitest 5.0.1 + mongodb-memory-server 11.2.0

`mongodb-memory-server` はメモリ上に一時的な MongoDB を起動する。Atlas の実データを汚さず、CI でも動作する。

---

## 6. アーキテクチャ

### 6.1 認可をどこに置くか

**データアクセス層（DAL）を認可の単一の責任地点とする。** proxy.ts（middleware）はセキュリティ境界にしない。

| 層 | 役割 |
|---|---|
| `src/proxy.ts` | **体験のためのリダイレクトのみ**。未ログインなら `/login` へ、ログイン済みで `/login` なら `/` へ |
| `src/data/*.ts`（DAL） | **認可の実体**。セッションから `userId` を取得し、全クエリの条件に含める |

middleware を認可の中心に据えない理由は 2 つ。middleware は Edge Runtime で動くため DB を照会できないこと、および middleware 単独に依存する構成は迂回型の脆弱性に弱いことである。

### 6.2 導入パッケージ

| パッケージ | バージョン | 役割 |
|---|---|---|
| `next-auth` | `5.0.0-beta.32`（完全固定） | 認証本体。セッション管理、Cookie 発行、OAuth 通信 |
| `@auth/mongodb-adapter` | `^3.11.3` | next-auth と MongoDB をつなぐアダプタ。OAuth ログイン時のユーザー情報を永続化 |
| `bcryptjs` | `^3.0.3` | パスワードのハッシュ化 |
| `@types/bcryptjs` | `^3` | 型定義 |
| `vitest` | `^5.0.1` | テストランナー（dev） |
| `mongodb-memory-server` | `^11.2.0` | テスト用のインメモリ MongoDB（dev） |
| `vite-tsconfig-paths` | `^6.1.1` | Vitest で `@/` パスエイリアスを解決する（dev） |

### 6.3 ファイル構成

```
src/
├── auth.ts                              # next-auth 設定本体。auth / signIn / signOut を export
├── auth.config.ts                       # proxy.ts 用の軽量設定（DB に触らない部分のみ）
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                   # ログイン画面用の簡素なレイアウト
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (main)/                          # ログイン必須
│   │   ├── layout.tsx                   # SideMenu にユーザー名・ログアウトを追加
│   │   ├── page.tsx
│   │   ├── completed/page.tsx
│   │   ├── expired/page.tsx
│   │   ├── new/page.tsx
│   │   └── edit/[id]/page.tsx
│   └── api/auth/[...nextauth]/route.ts  # next-auth が要求する唯一の API ルート
├── actions/
│   ├── auth.ts                          # signup / login / logout の Server Actions（新規）
│   └── task.ts                          # DAL 経由に書き換え
├── data/
│   ├── task.ts                          # DAL: 全クエリに userId を強制
│   └── user.ts                          # DAL: ユーザー作成・検索
├── models/
│   ├── task.ts                          # userId 追加、型定義を修正
│   └── user.ts                          # 新規
├── utils/database.ts                    # 変更なし
└── proxy.ts                             # Basic 認証 → セッション判定に置換

削除: src/app/api/tasks/ 配下すべて
```

### 6.4 設定ファイルを 2 つに分ける理由

`proxy.ts`（middleware）は **Edge Runtime** で動作し、そこでは Node.js 固有の API に依存する Mongoose を読み込めない。そのため設定を分割する。

- `auth.config.ts` — DB に触らない部分（プロバイダ定義、`pages`、`callbacks.authorized`）。middleware はこれだけを読む
- `auth.ts` — `auth.config.ts` を読み込み、MongoDB アダプタと Credentials プロバイダの `authorize`（DB 照会が必要）を追加した完全版

これは Auth.js 公式が推奨する split config パターンである。

### 6.5 セッション戦略

**JWT 戦略（`session.strategy = "jwt"`）を採用する。** これは選択ではなく制約であり、Auth.js では Credentials プロバイダを使う場合データベースセッションを利用できない。

`callbacks.jwt` でトークンに `user.id` を載せ、`callbacks.session` でそれを `session.user.id` に展開する。DAL はこの `session.user.id` を唯一の身元情報として使う。

### 6.6 データモデル

| コレクション | 管理者 | フィールド |
|---|---|---|
| `users` | Mongoose とアダプタで共有 | `name` / `email`（一意インデックス） / `emailVerified` / `image` / `passwordHash` |
| `accounts` | アダプタ専用 | OAuth 連携情報（provider, providerAccountId, userId 等） |
| `tasks` | Mongoose | 既存 + `userId`（必須・インデックス） |

- `passwordHash` は **null を許容**する。OAuth のみで登録したユーザーはパスワードを持たないため。
- `users` は Mongoose とアダプタが同じコレクションを参照するため、フィールド名はアダプタの仕様（`name` / `email` / `emailVerified` / `image`）に合わせる。
- `tasks` には `{ userId: 1, isCompleted: 1, dueDate: 1 }` の複合インデックスを張る。全クエリが `userId` で絞られるため先頭に置く。

### 6.7 DAL の設計（本設計の核心）

```ts
// src/data/task.ts
import 'server-only'   // クライアント側に紛れ込んだらビルドエラーにする

async function requireUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new UnauthorizedError()
  return session.user.id
}

export async function getTaskById(id: string) {
  const userId = await requireUserId()
  await connectDb()
  return TaskModel.findOne({ _id: id, userId }).lean()   // userId をクエリ条件に含める
}

export async function updateTask(id: string, data: TaskInput) {
  const userId = await requireUserId()
  await connectDb()
  const result = await TaskModel.updateOne({ _id: id, userId }, data)
  if (result.matchedCount === 0) throw new NotFoundError()
}
```

**原則 1: 所有権はクエリ条件で強制する。**
「`findOne({_id: id})` で取得してから `if (task.userId !== currentUserId)` で弾く」実装は、チェックを書き忘れる余地が残る。`userId` を最初からクエリ条件に入れれば、書き忘れたクエリはそもそも他人のデータを返せない。安全側を初期状態にする。

**原則 2: 「他人のもの」と「存在しない」を区別しない。**
どちらも 404 相当として扱う。403 を返すと「その ID のタスクは存在する」と教えてしまい、ID の総当たりで他人のタスクの存在を推測されうる。

**原則 3: `import 'server-only'` を付ける。**
DAL がクライアントコンポーネントから誤って import された場合、実行時ではなくビルド時に失敗させる。

### 6.8 アカウント衝突時の振る舞い

同一メールアドレスでパスワード登録済みのユーザーが、同じメールの OAuth アカウントでログインした場合、**自動連携せず拒否する**（Auth.js のデフォルト動作 `OAuthAccountNotLinked`）。

`allowDangerousEmailAccountLinking: true` は使用しない。OAuth プロバイダがメールアドレスの所有を検証していない場合、攻撃者が被害者のメールアドレスを名乗るアカウントを当該プロバイダで作成するだけで、被害者のアカウントを乗っ取れるためである。Google と GitHub は検証済みメールしか返さないため実害は出にくいが、**プロバイダを 1 つ追加した瞬間に穴になる**設計を避ける。

拒否時はエラー画面で「このメールアドレスはパスワードで登録済みです。パスワードでログインしてください」と具体的に案内する。

---

## 7. 画面とフロー

### 7.1 新規登録

1. `/signup` で 名前・メール・パスワードを入力
2. Server Action がバリデーション（メール形式、パスワード 8 文字以上、メール重複）
3. `bcryptjs` でハッシュ化し User を作成
4. **そのまま `signIn()` で自動ログイン**し `/` へ遷移

登録直後に再度ログインを求めるのは無用な離脱を生むため、自動ログインまで行う。

### 7.2 ログイン

`/login` でメール/パスワード、または GitHub / Google ボタン。成功後は `callbackUrl` があればそこへ、なければ `/` へ。

### 7.3 ログアウト

`(main)/layout.tsx` の SideMenu にユーザー名とログアウトを配置。Server Action から `signOut()` を呼ぶ。

### 7.4 proxy.ts の責務

```
未ログイン かつ (main) 配下     → /login?callbackUrl=<元のパス> へリダイレクト
ログイン済み かつ /login|/signup → / へリダイレクト
それ以外                        → 通過
```

matcher からは `/api/auth`、`_next`、静的ファイルを除外する。

---

## 8. 技術的負債の返済

Phase 1 で同じファイルを触るため、併せて対応するもの。

| 項目 | 対応 |
|---|---|
| `next.config.mjs` の `env` ブロック | **削除**。Basic 認証の撤去に伴い不要。秘密情報のクライアント露出を解消 |
| `src/app/api/tasks/*` | **削除**。画面から未使用であり、残すと保護対象が増えるだけ |
| `"lint": "next lint"` | `"lint": "eslint ."` に変更 |
| `package.json` にテストスクリプトがない | `"test": "vitest run"` を追加（#9 で実施） |
| `.eslintrc.json` | `eslint.config.mjs`（flat config）へ移行 |
| `models/task.ts` の型定義 | `Document` 継承による `_id` の型衝突を解消。`userId` 追加と同時に実施 |
| `actions/task.ts` のエラー返却 | 引数の書き換えをやめ、新しいオブジェクトを返す形に修正 |

---

## 9. テスト方針

Phase 1 では **DAL の所有権強制のみ**を対象とする。

| # | 検証内容 | 期待結果 |
|---|---|---|
| 1 | ユーザー B が ユーザー A のタスクを `getTaskById` | `null` が返る（存在を教えない） |
| 2 | ユーザー B が ユーザー A のタスクを `updateTask` | 更新されない（`NotFoundError`） |
| 3 | ユーザー B が ユーザー A のタスクを `deleteTask` | 削除されない（`NotFoundError`） |
| 4 | ユーザー A が `getTasks` を呼ぶ | 自分のタスクのみが返る |

DAL は内部で `auth()` を呼ぶため、テストでは `vi.mock('@/auth')` でセッションを差し替えて別ユーザーになりすます。

**E2E は書かない。** ブラウザ経由の E2E は遅く壊れやすい一方、ここで証明したいのは「DAL がクエリ条件に `userId` を含めている」という一点であり、単体テストの方が直接的で速い。UI テストと E2E は Phase 2 で扱う。

---

## 10. 環境変数

### 追加するもの

| 変数名 | 説明 | 取得方法 |
|---|---|---|
| `AUTH_SECRET` | セッション JWT の署名鍵 | `openssl rand -base64 32` で生成 |
| `AUTH_GITHUB_ID` | GitHub OAuth App の Client ID | GitHub → Settings → Developer settings → OAuth Apps（約3分） |
| `AUTH_GITHUB_SECRET` | 同 Client Secret | 同上 |
| `AUTH_GOOGLE_ID` | Google OAuth の Client ID | Google Cloud Console → 認証情報（同意画面の設定を含め約10〜15分） |
| `AUTH_GOOGLE_SECRET` | 同 Client Secret | 同上 |

next-auth v5 は `AUTH_` 接頭辞の環境変数を自動的に認識するため、コード側での明示的な読み込みは不要。

### コールバック URL（OAuth アプリ登録時に設定）

- GitHub: `http://localhost:3000/api/auth/callback/github`
- Google: `http://localhost:3000/api/auth/callback/google`

本番環境では `localhost:3000` をデプロイ先のドメインに置き換えたものを追加登録する。

### 削除するもの

`IS_BASIC_AUTH_ENABLED` / `BASIC_AUTH_USER` / `BASIC_AUTH_PASS`

---

## 11. 作業分解（Issue）

マイルストーン `Phase 1`。**1 Issue = 1 PR** の粒度とする。

| Issue | 内容 | 依存 |
|---|---|---|
| #2 | 技術的負債の返済（`next.config` の env 削除 / `api/tasks` 削除 / ESLint flat config / lint スクリプト修正） | なし |
| #3 | next-auth v5 の導入と設定分割（`auth.ts` / `auth.config.ts` / `api/auth` ルート） | なし |
| #4 | User モデルとメール/パスワード登録（bcryptjs / `/signup`） | #3 |
| #5 | OAuth 連携（GitHub / Google）と衝突時のエラー案内 | #3, #4 |
| #6 | Task への `userId` 追加と DAL 構築 | #4 |
| #7 | 既存の Server Actions・各ページを DAL 経由へ移行 | #6 |
| #8 | proxy.ts をセッション判定に置換 + ログイン/ログアウト UI | #7 |
| #9 | 認可テスト（Vitest + mongodb-memory-server） | #6 |

#2 を先頭に置くのは、他と依存がなく、かつ「秘密情報がクライアントに露出している」という実害のある問題であるため。

---

## 12. ブランチと PR の運用

- 統合ブランチ `feat/phase1-auth` を `main` から作成する
- 各 Issue の作業ブランチは `feat/<issue番号>-<概要>`（例: `feat/2-nextauth-setup`）とし、**PR のマージ先は `feat/phase1-auth`**
- Phase 1 完了後、`feat/phase1-auth` → `main` の PR を 1 本作成する
- PR 本文に `Closes #<番号>` を記載し、マージで Issue が自動クローズされるようにする
- コミットメッセージは CLAUDE.md の規約に従い、Conventional Commits ベースの日本語サマリー（例: `feat: next-auth v5 を導入`）
- PR 本文には「何を」だけでなく「**なぜ**」を書く

この方式を採るのは、`main` を常に動作する状態に保ちつつ、小さくレビュー可能な PR の列を履歴に残すためである。認証は #5 で `userId` を必須化した時点から #7 でログイン機構が完成するまでの間、一時的にアプリが機能しない区間が生じるため、その区間を `main` に持ち込まない。

---

## 13. リスクと対応

| リスク | 対応 |
|---|---|
| next-auth v5 が beta であり破壊的変更が入りうる | `5.0.0-beta.32` に完全固定。更新は Phase 完了後に個別検討 |
| `users` コレクションを Mongoose とアダプタで共有するため、フィールド定義がずれると不整合が起きる | Mongoose の User スキーマは `strict: false` を指定し、アダプタが書き込む未定義フィールドを削除させない。#4 で OAuth ログイン後のドキュメント構造を実際に確認する |
| Credentials プロバイダと Adapter の併用は構成を誤ると動作しない | セッション戦略を `jwt` に固定し、Credentials の `authorize` は DAL 経由で自前に DB 照会する |
| OAuth アプリ登録が実装のブロッカーになる | #5 着手前に GitHub / Google 双方の Client ID / Secret を取得しておく |
| Phase 2 で GitHub Actions を追加する際、gh CLI のトークンに `workflow` スコープがない | その時点で `gh auth refresh -s workflow` を実行する |

---

## 14. 完了条件

Phase 1 は以下をすべて満たした時点で完了とする。

1. メール/パスワード、GitHub、Google の 3 経路でログインできる
2. ログインしたユーザーには自分のタスクのみが表示される
3. 他ユーザーのタスク ID を指定しても取得・更新・削除ができない（テストで検証済み）
4. 未ログインで `(main)` 配下にアクセスすると `/login` にリダイレクトされる
5. `npm run lint` と `npm run build` が成功する
6. `npm run test` が成功する
7. 第 8 章の技術的負債がすべて解消されている
