import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

import {agentExecutor} from '../agents/agent.js' 
const messageHistory = new ChatMessageHistory();

const agentWithChatHistory = new RunnableWithMessageHistory({
  runnable: agentExecutor,
  // This is needed because in most real world scenarios, a session id is needed per user.
  // It isn't really used here because we are using a simple in memory ChatMessageHistory.
  getMessageHistory: (_sessionId) => messageHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

const result5 = await agentWithChatHistory.invoke(
  {
    input: "hi! i'm cob",
  },
  {
    // This is needed because in most real world scenarios, a session id is needed per user.
    // It isn't really used here because we are using a simple in memory ChatMessageHistory.
    configurable: {
      sessionId: "foo",
    },
  }
);

console.log(result5);
/*
  {
    input: "hi! i'm cob",
    chat_history: [
      HumanMessage {
        content: "hi! i'm cob",
        additional_kwargs: {}
      },
      AIMessage {
        content: 'Hello Cob! How can I assist you today?',
        additional_kwargs: {}
      }
    ],
    output: 'Hello Cob! How can I assist you today?'
  }
*/

