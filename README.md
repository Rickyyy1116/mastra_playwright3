# Mastra Playwright MCP プロジェクト

このプロジェクトは、Mastra.aiとPlaywright MCPを使用した統合デモです。MCPエージェントのみを使用してインタラクティブなAIアシスタンスを提供します。

## 機能

- Playwright MCPによるウェブブラウザ操作
- Mastra.aiによるAIエージェント機能
- 会話記憶機能による継続的な対話

## セットアップ

1. 必要なパッケージをインストールします：
   ```
   pnpm install
   ```

2. `.env.development.sample`を`.env.development`にコピーし、APIキーを設定します。

3. アプリケーションを起動します：
   ```
   pnpm dev
   ```

## 環境変数

必要な環境変数:

- `OPENAI_API_KEY`: OpenAI APIキー

## メモリ機能

このプロジェクトには会話記憶機能が組み込まれており、次のような特徴があります：

- 最新の20メッセージを保持
- セマンティック検索による関連会話の検索
- スレッドによる会話履歴の管理

## ライセンス

MITライセンス 