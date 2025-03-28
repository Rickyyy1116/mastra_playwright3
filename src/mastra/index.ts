import { Mastra } from "@mastra/core";
import { mcpAgent } from "./agents";

const mastra = new Mastra({
  agents: [mcpAgent],
});

// メモリスレッドの初期化
async function initializeMcpAgentMemory() {
  try {
    const threadId = await mcpAgent.memory?.getOrCreateThread("default");
    console.log(`Initialized memory thread: ${threadId}`);
  } catch (error) {
    console.error(`Error initializing memory: ${error}`);
  }
}

// メモリの初期化を実行
initializeMcpAgentMemory();

export default mastra;
        