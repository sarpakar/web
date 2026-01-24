'use client';

import { useState, useRef, useEffect } from 'react';
import { searchService } from '@/services/searchService';
import { SearchResult, ChatMessage } from '@/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const suggestions = searchService.getQuickSuggestions();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: searchQuery,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsSearching(true);

    try {
      const { results: searchResults, aiResponse } = await searchService.search(searchQuery);
      
      // Add AI response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        searchResults
      };
      setMessages(prev => [...prev, assistantMessage]);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I had trouble with that search. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">AI Search</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ask me anything about food, restaurants, or recipes
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            {/* AI Icon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">What are you craving?</h2>
            <p className="mb-8 text-center text-gray-500">
              Search for restaurants, dishes, or get personalized recommendations
            </p>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion.query)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <span>{suggestion.emoji}</span>
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Search Results Cards */}
                  {message.searchResults && message.searchResults.length > 0 && (
                    <div className="mt-4 grid gap-3">
                      {message.searchResults.map((result) => (
                        <div
                          key={result.id}
                          className="rounded-xl bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{result.name}</h3>
                              {result.venueName && (
                                <p className="text-sm text-gray-500">{result.venueName}</p>
                              )}
                              {result.description && (
                                <p className="mt-1 text-sm text-gray-600">{result.description}</p>
                              )}
                            </div>
                            {result.price && (
                              <span className="ml-4 font-semibold text-green-600">
                                ${result.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                            {result.category && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5">
                                {result.category}
                              </span>
                            )}
                            {result.isVegetarian && (
                              <span className="text-green-600">🥬 Vegetarian</span>
                            )}
                            {result.isVegan && (
                              <span className="text-green-600">🌱 Vegan</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isSearching && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-gray-500">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm">Searching...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for food, restaurants, or ask a question..."
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



