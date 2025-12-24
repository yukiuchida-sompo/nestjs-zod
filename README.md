# NestJS + Zod + Prisma Monorepo

Full-stack TypeScript アプリケーション - NestJS バックエンドと Next.js フロントエンドを組み合わせ、OpenAPI 仕様からクライアントを自動生成します。

## 🏗️ アーキテクチャ

```
nestjs-zod/
├── apps/
│   ├── api/          # NestJS バックエンド
│   │   ├── prisma/   # Prisma スキーマ
│   │   └── src/
│   │       ├── users/     # Users CRUD モジュール
│   │       ├── posts/     # Posts CRUD モジュール
│   │       └── prisma/    # Prisma サービス
│   └── web/          # Next.js フロントエンド
│       ├── src/
│       │   ├── generated/  # 自動生成されるAPIクライアント
│       │   ├── components/ # React コンポーネント
│       │   └── lib/        # ユーティリティ
│       └── orval.config.ts
└── package.json      # ルート (pnpm workspaces)
```

## 🛠️ 技術スタック

### バックエンド (apps/api)
- **NestJS** - Node.js フレームワーク
- **Zod** - スキーマバリデーション
- **@anatine/zod-nestjs** - NestJS と Zod の統合
- **@anatine/zod-openapi** - Zod スキーマから OpenAPI への変換
- **Prisma** - ORM
- **zod-prisma-types** - Prisma スキーマから Zod 型を自動生成
- **@nestjs/swagger** - OpenAPI ドキュメント生成

### フロントエンド (apps/web)
- **Next.js 15** - React フレームワーク
- **React Query (TanStack Query)** - サーバー状態管理
- **Orval** - OpenAPI から TypeScript クライアント自動生成

## 🚀 セットアップ

### 前提条件
- Node.js 20+
- pnpm 8+

### インストール

```bash
# 依存関係インストール
pnpm install

# 環境変数設定
cp apps/api/.env.example apps/api/.env
# DATABASE_URL="file:./dev.db" を設定

# Prisma クライアント生成 & DB マイグレーション
pnpm db:generate
pnpm db:push

# OpenAPI スペック生成
pnpm generate:openapi

# API クライアント生成
pnpm generate:client
```

### 開発サーバー起動

```bash
# バックエンドとフロントエンドを同時起動
pnpm dev

# または個別に起動
pnpm dev:api   # http://localhost:3001
pnpm dev:web   # http://localhost:3000
```

## 📚 API ドキュメント

バックエンド起動後、Swagger UI でAPIドキュメントを確認できます:

- **Swagger UI**: http://localhost:3001/api
- **OpenAPI JSON**: http://localhost:3001/api-json

## 🔄 クライアント自動生成フロー

```
1. Zod スキーマ定義 (*.dto.ts)
      ↓
2. NestJS Swagger が OpenAPI 仕様を生成
      ↓
3. generate:openapi でopenapi.json出力
      ↓
4. Orval が TypeScript クライアント生成
      ↓
5. フロントエンドで型安全なAPI呼び出し
```

### 新しいエンドポイント追加時

```bash
# 1. API に新しいエンドポイントを追加
# 2. OpenAPI スペック再生成
pnpm generate:openapi

# 3. クライアント再生成
pnpm generate:client
```

## 📁 主要ファイル

### Zod DTO 定義例 (apps/api/src/users/users.dto.ts)

```typescript
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const CreateUserSchema = extendApi(
  z.object({
    email: z.string().email(),
    name: z.string().min(1).max(100).optional(),
  }),
  {
    title: 'CreateUser',
    description: 'Data required to create a new user',
  }
);

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
```

### フロントエンドでの使用例

```typescript
import { useGetAllUsers, useCreateANewUser } from '@/generated/api/users/users';

function UsersPage() {
  const { data, isLoading } = useGetAllUsers();
  const createUser = useCreateANewUser();

  const handleCreate = () => {
    createUser.mutate({
      data: { email: 'user@example.com', name: 'John' }
    });
  };

  return (
    <ul>
      {data?.data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## 🔧 利用可能なスクリプト

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 全アプリを開発モードで起動 |
| `pnpm dev:api` | APIサーバーのみ起動 |
| `pnpm dev:web` | フロントエンドのみ起動 |
| `pnpm build` | 全アプリをビルド |
| `pnpm db:generate` | Prisma クライアント生成 |
| `pnpm db:push` | DBスキーマをプッシュ |
| `pnpm db:migrate` | マイグレーション実行 |
| `pnpm db:studio` | Prisma Studio 起動 |
| `pnpm generate:openapi` | OpenAPI 仕様を生成 |
| `pnpm generate:client` | API クライアントを生成 |

## 📝 環境変数

### apps/api/.env

```env
DATABASE_URL="file:./dev.db"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

### apps/web/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## ✨ 特徴

- **型安全**: Zod スキーマからフロントエンドまで一貫した型
- **自動生成**: API 変更時にクライアントを自動更新
- **バリデーション**: Zod によるランタイムバリデーション
- **ドキュメント**: OpenAPI/Swagger による自動ドキュメント
- **モノレポ**: pnpm workspaces による効率的な管理

