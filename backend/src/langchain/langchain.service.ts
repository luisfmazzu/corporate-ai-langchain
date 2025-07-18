import { Injectable } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { ChatOpenAI } from '@langchain/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { ConversationTokenBufferMemory } from 'langchain/memory';
import { DynamicTool } from '@langchain/core/tools';

@Injectable()
export class LangChainService {
  private embeddings: OpenAIEmbeddings;
  private llm: ChatOpenAI;
  private memoryMap: Map<number, ConversationTokenBufferMemory> = new Map();

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    this.llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
    });
  }

  async processQuery(
    query: string, 
    documentText: string, 
    chatId?: number
  ): Promise<{ answer: string; sources: any[] }> {
    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const docs = await textSplitter.createDocuments([documentText]);

    // Create vector store
    const vectorStore = await MemoryVectorStore.fromDocuments(docs, this.embeddings);

    // Get or create memory for this chat
    let memory = this.memoryMap.get(chatId || 0);
    if (!memory) {
      memory = new ConversationTokenBufferMemory({
        memoryKey: 'chat_history',
        returnMessages: true,
        llm: this.llm,
      });
      this.memoryMap.set(chatId || 0, memory);
    }

    // Create conversational retrieval chain
    const chain = ConversationalRetrievalQAChain.fromLLM(
      this.llm,
      vectorStore.asRetriever(),
      {
        memory,
        returnSourceDocuments: true,
      }
    );

    // Process query
    const response = await chain.call({ question: query });

    // Extract sources from retrieved documents
    const sources = response.sourceDocuments?.map((doc: any, index: number) => ({
      id: index,
      content: doc.pageContent,
      metadata: doc.metadata,
    })) || [];

    return {
      answer: response.text,
      sources,
    };
  }

  async summarizeDocument(documentText: string): Promise<string> {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });
    const docs = await textSplitter.createDocuments([documentText]);

    const vectorStore = await MemoryVectorStore.fromDocuments(docs, this.embeddings);
    const summaryChain = ConversationalRetrievalQAChain.fromLLM(
      this.llm,
      vectorStore.asRetriever(),
      {
        returnSourceDocuments: false,
      }
    );

    const response = await summaryChain.call({
      question: 'Please provide a comprehensive summary of this document.',
    });

    return response.text;
  }

  getCustomTools(): DynamicTool[] {
    return [
      new DynamicTool({
        name: 'summarize_document',
        description: 'Summarize a document or document section',
        func: async (input: string) => {
          // This would be called by the LLM when it needs to summarize
          return `Summary: ${input.substring(0, 200)}...`;
        },
      }),
    ];
  }
} 