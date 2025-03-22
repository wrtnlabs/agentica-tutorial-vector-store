import { Agentica } from "@agentica/core";
import { AgenticaOpenAIVectorStoreSelector } from "@agentica/openai-vector-store";
import dotenv from "dotenv";
import OpenAI from "openai";
import typia from "typia";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const selector = new AgenticaOpenAIVectorStoreSelector({
  provider: {
    api: openai,
    assistant: { name: "agentica", model: "gpt-4o-mini" },
    vectorStore: { name: "vectorStore" },
  },
});

export const agent = new Agentica({
  model: "chatgpt",
  vendor: {
    api: openai,
    model: "gpt-4o-mini",
  },
  controllers: [
    {
      protocol: "class",
      name: "vectorStore",
      application: typia.llm.application<
        AgenticaOpenAIVectorStoreSelector,
        "chatgpt"
      >(),
      execute: selector,
    },
  ],
});

const main = async () => {
  console.log(await agent.conversate("What can you do?"));
};

main();
