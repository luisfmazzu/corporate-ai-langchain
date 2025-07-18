'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Document {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  isProcessed: boolean;
  uploadTimestamp: string;
}

interface Chat {
  id: number;
  title: string;
  employeeId?: string;
  createdAt: string;
  updatedAt: string;
  documentId: number;
  messages: Message[];
}

interface Message {
  id: number;
  content: string;
  type: 'user' | 'ai';
  metadata?: any;
  timestamp: string;
}

export default function ChatPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fetch chats when document is selected
  useEffect(() => {
    if (selectedDocument) {
      fetchChats(selectedDocument);
    }
  }, [selectedDocument]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://localhost:3001/documents');
      setDocuments(response.data.filter((doc: Document) => doc.isProcessed));
    } catch (err: any) {
      setError('Failed to fetch documents');
    }
  };

  const fetchChats = async (documentId: number) => {
    try {
      const response = await axios.get(`http://localhost:3001/chat?documentId=${documentId}`);
      setChats(response.data);
    } catch (err: any) {
      setError('Failed to fetch chats');
    }
  };

  const createNewChat = async () => {
    if (!selectedDocument || !newChatTitle.trim()) return;

    try {
      const response = await axios.post('http://localhost:3001/chat', {
        title: newChatTitle,
        documentId: selectedDocument,
      });

      const newChat: Chat = {
        id: response.data.chatId,
        title: newChatTitle,
        documentId: selectedDocument,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };

      setChats(prev => [newChat, ...prev]);
      setSelectedChat(newChat);
      setNewChatTitle('');
    } catch (err: any) {
      setError('Failed to create chat');
    }
  };

  const sendMessage = async () => {
    if (!selectedChat || !message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: message,
      type: 'user' as const,
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    setSelectedChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage],
    } : null);

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/chat/query', {
        documentId: selectedChat.documentId,
        query: message,
        chatId: selectedChat.id,
      });

      const aiMessage = {
        id: Date.now() + 1,
        content: response.data.answer,
        type: 'ai' as const,
        metadata: { sources: response.data.sources },
        timestamp: new Date().toISOString(),
      };

      setSelectedChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, aiMessage],
      } : null);

      setMessage('');
    } catch (err: any) {
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Document Q&A Chat
          </h1>
          <p className="text-gray-600">
            Ask questions about your uploaded documents
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Document Selection */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Documents</h2>
            </div>
            <div className="p-4">
              {documents.length === 0 ? (
                <p className="text-gray-500 text-sm">No processed documents available</p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocument(doc.id)}
                      className={`w-full text-left p-3 rounded-md text-sm transition-colors ${
                        selectedDocument === doc.id
                          ? 'bg-blue-50 border border-blue-200 text-blue-900'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="font-medium truncate">{doc.fileName}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(doc.uploadTimestamp)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Chats</h2>
            </div>
            <div className="p-4">
              {selectedDocument ? (
                <div className="space-y-4">
                  {/* New Chat Form */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="New chat title..."
                      value={newChatTitle}
                      onChange={(e) => setNewChatTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && createNewChat()}
                    />
                    <button
                      onClick={createNewChat}
                      disabled={!newChatTitle.trim()}
                      className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Create Chat
                    </button>
                  </div>

                  {/* Chat List */}
                  <div className="space-y-2">
                    {chats.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className={`w-full text-left p-3 rounded-md text-sm transition-colors ${
                          selectedChat?.id === chat.id
                            ? 'bg-green-50 border border-green-200 text-green-900'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div className="font-medium truncate">{chat.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(chat.updatedAt)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Select a document to view chats</p>
              )}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">{selectedChat.title}</h2>
                  <p className="text-sm text-gray-500">
                    Document: {documents.find(d => d.id === selectedChat.documentId)?.fileName}
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedChat.messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>Start a conversation by asking a question</p>
                    </div>
                  ) : (
                    selectedChat.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          {msg.type === 'ai' && msg.metadata?.sources && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">Sources:</p>
                              <div className="text-xs text-gray-600">
                                {msg.metadata.sources.map((source: any, index: number) => (
                                  <div key={index} className="mb-1">
                                    • {source.pageContent?.substring(0, 100)}...
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <p className="text-xs opacity-70 mt-1">
                            {formatDate(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask a question..."
                      disabled={isLoading}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim() || isLoading}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p>Select a chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 