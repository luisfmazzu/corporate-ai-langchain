import { Injectable } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { ChatOpenAI } from '@langchain/openai';
import { RetrievalQAChain } from 'langchain/chains';

@Injectable()
export class LangChainService {
  private embeddings: OpenAIEmbeddings;
  private llm: ChatOpenAI;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    this.llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
    });
  }

  async processQuery(query: string, documentText: string): Promise<{ answer: string; sources: any[] }> {
    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const docs = await textSplitter.createDocuments([documentText]);

    // Create vector store
    const vectorStore = await MemoryVectorStore.fromDocuments(docs, this.embeddings);

    // Create retrieval chain
    const chain = RetrievalQAChain.fromLLM(this.llm, vectorStore.asRetriever());

    // Process query
    const response = await chain.call({ query });

    return {
      answer: response.text,
      sources: [], // TODO: Implement source tracking
    };
  }
} 