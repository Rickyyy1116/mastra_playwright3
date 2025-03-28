import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { MCPConfiguration } from "@mastra/mcp";
import { Memory } from "@mastra/memory";

// メモリの設定
const memory = new Memory({
  options: {
    // 最新の20メッセージを含める
    lastMessages: 20,
    // セマンティック検索の設定
    semanticRecall: {
      topK: 3, // 類似メッセージの取得数
      messageRange: {
        before: 2, // 各結果の前の2メッセージを含める
        after: 1,  // 各結果の後の1メッセージを含める
      },
    },
    // ワーキングメモリの設定
    workingMemory: {
      enabled: true,
    },
    // スレッド設定
    threads: {
      generateTitle: true, // ユーザーの最初のメッセージからスレッドタイトルを生成する
    },
  },
});

// 初期スレッドの作成
let currentThreadId: string | undefined;

// スレッドを取得または作成する関数
export async function getOrCreateThread(userId: string = "default-user") {
  if (!currentThreadId) {
    try {
      // ユーザーのスレッドを検索
      const threads = await memory.getThreadsByResourceId({ resourceId: userId });
      if (threads && threads.length > 0) {
        // 最新のスレッドを使用
        currentThreadId = threads[0].id;
        console.log(`既存のスレッド ${currentThreadId} を使用します`);
      } else {
        // 新しいスレッドを作成
        const thread = await memory.createThread({
          resourceId: userId,
          title: "ブラウザ操作の会話",
        });
        currentThreadId = thread.id;
        console.log(`新しいスレッド ${currentThreadId} を作成しました`);
      }
    } catch (error) {
      console.error("スレッドの取得または作成中にエラーが発生しました:", error);
    }
  }
  return currentThreadId;
}

// MCPConfigurationを使用してPlaywright MCPサーバーの設定を行う
const mcp = new MCPConfiguration({
  id: "playwright-mcp-debug", // インスタンスに一意のIDを設定
  servers: {
    "playwright": {
      command: "pnpm",
      args: ["dlx", "@playwright/mcp@latest"], // ヘッドレスモードのフラグなし = ブラウザを表示モードで実行
      env: {
        // 環境変数を通じてタイムアウト設定を渡す
        MCP_TIMEOUT: "300000",
        // デバッグ用環境変数
        DEBUG: "playwright:*,mcp:*",
        LOG_LEVEL: "debug"
      }
    }
  }
});

// エージェントの一部でログ出力を表示
console.log('MCPエージェントを初期化中...');

export const mcpAgent = new Agent({
  name: "MCP Agent",
  instructions: `
      あなたはウェブブラウザを操作することができるアシスタントです。
      ユーザーの指示に従って、Webサイトの閲覧、情報検索、データ収集などを行います。
      見つけた情報は日本語で簡潔に要約し、事実に基づいた情報を提供してください。
      
      過去の会話内容は記憶されていますので、以前の会話を参照することができます。
      ユーザーが以前の会話に言及した場合は、それを踏まえて回答してください。
  `,
  model: openai("gpt-4o"),
  tools: await mcp.getTools(),
  memory: memory, // メモリ機能を追加
}); 