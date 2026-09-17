import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import { StarField } from '@/components/StarField';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useAuth } from '@/context/AuthContext';
import { MessageCircle, Send, Bot, User, AlertCircle, RotateCcw, Sparkles, Plus, Play, Lock, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
}

interface ChatSession {
  systemContext: string;
  firstName: string;
  chartSummary?: {
    sun: string;
    moon: string;
    rising: string;
    midheaven: string;
    lifePath: number;
    archetype: string;
  };
}

const exampleMessages: ChatMessage[] = [
  { role: 'user', content: "What does my Rising sign say about my outer aura?" },
  { role: 'assistant', content: "Your Rising sign dictates your outward persona, first impressions, and physical presence. People intuitively perceive this energy before you even speak." },
  { role: 'user', content: "What is my career calling based on my Midheaven & Life Path?" },
  { role: 'assistant', content: "Your Midheaven in the 10th House reveals your highest worldly legacy and professional authority. Combined with your Life Path vibration, you excel where you can lead with strategic vision." },
];

function MarkdownContent({ content, className }: { content: string; className?: string }) {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    
    lines.forEach((line, lineIndex) => {
      if (line.trim().startsWith('*') && !line.trim().startsWith('**')) {
        const bulletMatch = line.match(/^\s*\*\s+(.+)$/);
        if (bulletMatch) {
          const bulletContent = parseInlineMarkdown(bulletMatch[1], `bullet-${lineIndex}`);
          elements.push(
            <div key={lineIndex} className="flex gap-2 ml-2 my-1">
              <span className="text-amber-9">•</span>
              <span>{bulletContent}</span>
            </div>
          );
          return;
        }
      }
      
      const inlineContent = parseInlineMarkdown(line, `line-${lineIndex}`);
      elements.push(
        <span key={lineIndex}>
          {inlineContent}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      );
    });
    
    return elements;
  };

  const parseInlineMarkdown = (text: string, keyPrefix: string) => {
    const parts: JSX.Element[] = [];
    let remaining = text;
    let partIndex = 0;
    
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
      
      let firstMatch: { index: number; length: number; content: string; type: 'bold' | 'italic' } | null = null;
      
      if (boldMatch && boldMatch.index !== undefined) {
        firstMatch = { 
          index: boldMatch.index, 
          length: boldMatch[0].length, 
          content: boldMatch[1], 
          type: 'bold' 
        };
      }
      
      if (italicMatch && italicMatch.index !== undefined) {
        if (!firstMatch || italicMatch.index < firstMatch.index) {
          firstMatch = { 
            index: italicMatch.index, 
            length: italicMatch[0].length, 
            content: italicMatch[1], 
            type: 'italic' 
          };
        }
      }
      
      if (firstMatch) {
        if (firstMatch.index > 0) {
          parts.push(<span key={`${keyPrefix}-${partIndex++}`}>{remaining.slice(0, firstMatch.index)}</span>);
        }
        
        if (firstMatch.type === 'bold') {
          parts.push(<strong key={`${keyPrefix}-${partIndex++}`} className="font-semibold">{firstMatch.content}</strong>);
        } else {
          parts.push(<em key={`${keyPrefix}-${partIndex++}`} className="italic text-amber-11">{firstMatch.content}</em>);
        }
        
        remaining = remaining.slice(firstMatch.index + firstMatch.length);
      } else {
        parts.push(<span key={`${keyPrefix}-${partIndex++}`}>{remaining}</span>);
        break;
      }
    }
    
    return parts;
  };

  return <div className={className}>{parseMarkdown(content)}</div>;
}

function CosmicLoadingAnimation() {
  return (
    <div className="flex gap-3 justify-start" data-testid="message-loading">
      <div className="w-8 h-8 rounded-md bg-amber-a3 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-amber-9" />
      </div>
      <div className="flex items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-5 h-5 text-amber-9" />
        </motion.div>
      </div>
    </div>
  );
}

function ChatBubble({ msg, index, isExample = false }: { msg: ChatMessage; index: number; isExample?: boolean }) {
  return (
    <div
      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${isExample ? 'opacity-50' : ''}`}
      data-testid={isExample ? `example-${msg.role}-${index}` : `message-${msg.role}-${index}`}
    >
      {msg.role === 'assistant' && (
        <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${msg.error ? 'bg-red-500/20' : 'bg-amber-a3'}`}>
          {msg.error ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <Bot className="w-4 h-4 text-amber-9" />
          )}
        </div>
      )}
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          msg.role === 'user'
            ? 'bg-amber-9 text-gray-1 rounded-tr-sm'
            : msg.error
              ? 'bg-red-500/10 border border-red-500/20 rounded-tl-sm'
              : 'bg-gray-a3 rounded-tl-sm'
        }`}
      >
        <MarkdownContent content={msg.content} className={`text-2 ${msg.error ? 'text-red-400' : ''}`} />
      </div>
      {msg.role === 'user' && (
        <div className="w-8 h-8 rounded-md bg-gray-a3 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}

export default function CueChats() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { dbUser } = useAuth();
  const savedOdisId = dbUser?.odisId || (typeof window !== 'undefined' ? localStorage.getItem('gg33-odis-id') : null);
  const { data: profileData } = useQuery<{ isPro?: boolean; user?: { isPro?: boolean } }>({
    queryKey: ['/api/profile', savedOdisId],
    enabled: !!savedOdisId,
  });
  const isPro = dbUser?.isPro || profileData?.isPro || profileData?.user?.isPro || false;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChat = async () => {
    if (isInitializing) return;
    
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }
    
    const odisId = savedOdisId || (typeof window !== 'undefined' ? localStorage.getItem('gg33-odis-id') : null);
    
    if (!odisId) {
      setError('Please create your profile first to use CueChats');
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const response = await fetch('/api/chat/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ odisId }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success && data.systemContext) {
        setChatSession({
          systemContext: data.systemContext,
          firstName: data.firstName,
          chartSummary: data.chartSummary,
        });
        setShowPreview(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        throw new Error(data.error || 'Failed to initialize chat');
      }
    } catch (err) {
      console.error('Chat init error:', err);
      setError('Failed to start chat. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  const sendMessage = async () => {
    if (!chatSession || !inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setError(null);
    
    const newUserMessage: ChatMessage = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .filter(msg => !msg.error)
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          systemContext: chatSession.systemContext,
          firstName: chatSession.firstName,
          conversationHistory,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.response) {
        const assistantMessage: ChatMessage = { role: 'assistant', content: data.response };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('No response received');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to get response. Please try again.');
      const errorMessage: ChatMessage = { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an issue generating a response. Please try again.',
        error: true 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = async () => {
    setMessages([]);
    setInputValue('');
    setError(null);
    setChatSession(null);
    await startChat();
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      <StarField />
      <Navigation />
      
      <main className="pt-20 pb-12 px-4 min-h-screen" data-testid="page-cuechats">
        <div className="container mx-auto max-w-4xl space-y-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              <MessageCircle className="w-3 h-3 mr-1" />
              AI Guidance
            </Badge>
            <h1 className="text-6 md:text-7 font-semibold mb-4">
              <span className="gradient-text">CueChats</span>
            </h1>
            <p className="text-gray-11 text-3 max-w-2xl mx-auto">
              Get personalized guidance based on your unique energy signature and current cosmic cycles.
            </p>
          </div>

          <Card variant="frosted">
            <CardHeader className="border-b border-gray-5/50">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center">
                    <Bot className="w-5 h-5 text-gray-1" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-4">CueChat AI</CardTitle>
                      {chatSession?.chartSummary && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                          Birth Chart Synced
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-2 text-gray-11">
                      {chatSession?.chartSummary ? (
                        <span>
                          ☀️ {chatSession.chartSummary.sun} · 🌙 {chatSession.chartSummary.moon} · ↗️ {chatSession.chartSummary.rising} · 🔢 Life Path {chatSession.chartSummary.lifePath}
                        </span>
                      ) : chatSession ? (
                        `Chatting with ${chatSession.firstName}`
                      ) : (
                        'Powered by your birth chart & numerology blueprint'
                      )}
                    </CardDescription>
                  </div>
                </div>
                {!showPreview && (
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={startNewChat}
                    disabled={isLoading || isInitializing}
                    data-testid="button-new-chat"
                  >
                    {isInitializing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="mr-1"
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        New Chat
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className={`${showPreview ? '' : 'h-96 overflow-y-auto custom-scrollbar'} p-6 space-y-4`}>
                {showPreview ? (
                  <>
                    {exampleMessages.map((msg, i) => (
                      <ChatBubble key={i} msg={msg} index={i} isExample />
                    ))}
                    
                    <div className="flex justify-center pt-4">
                      <Button
                        variant="gold"
                        size="lg"
                        onClick={startChat}
                        disabled={isInitializing}
                        data-testid="button-start-chat"
                      >
                        {isInitializing ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Sparkles className="w-4 h-4" />
                            </motion.div>
                            Loading...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Chat
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {!hasMessages && (
                      <div className="h-full flex flex-col items-center justify-center text-center py-6 px-4 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                          <Bot className="w-6 h-6" />
                        </div>
                        <div className="space-y-1 max-w-md">
                          <h3 className="text-sm font-bold text-zinc-100">
                            Ask me anything about yourself
                          </h3>
                          <p className="text-xs text-zinc-400">
                            I know your full Western birth chart, planetary houses, aspects, and numerology blueprint.
                          </p>
                        </div>

                        {/* Quick Starter Question Chips */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg pt-2 text-left">
                          {[
                            "What are my core superpowers in my birth chart?",
                            "What does my Rising sign say about my outer aura?",
                            "Explain my Moon sign and what I need in love",
                            "What is my Midheaven (MC) and career calling?",
                            "What is my biggest karmic shadow & breakthrough?",
                            "How does my Life Path interact with my Sun sign?",
                          ].map((promptText, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setInputValue(promptText);
                                inputRef.current?.focus();
                              }}
                              className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-amber-500/40 text-[11px] text-zinc-300 hover:text-amber-200 transition-all text-left cursor-pointer flex items-center justify-between group"
                            >
                              <span className="truncate pr-2">{promptText}</span>
                              <Sparkles className="w-3 h-3 text-zinc-600 group-hover:text-amber-400 flex-shrink-0 transition-colors" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {messages.map((msg, i) => (
                      <div key={i}>
                        <ChatBubble msg={msg} index={i} />
                        {msg.error && (
                          <div className="flex gap-3 justify-start mt-1">
                            <div className="w-8" />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400"
                              onClick={() => {
                                setMessages(prev => prev.filter((_, idx) => idx !== i));
                                setError(null);
                              }}
                              data-testid={`button-retry-${i}`}
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Dismiss
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}

                    {isLoading && <CosmicLoadingAnimation />}
                    
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {error && (
                <div className="px-6 py-2 bg-red-500/10 border-t border-red-500/20">
                  <p className="text-2 text-red-400" data-testid="text-chat-error">{error}</p>
                </div>
              )}

              {!showPreview && (
                <div className="p-4 border-t border-gray-5/50 bg-gray-a2">
                  <div className="flex gap-3">
                    <Input
                      ref={inputRef}
                      variant="frosted"
                      placeholder="Ask about your birth chart, planetary houses, life path, career calling..."
                      className="flex-1"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      data-testid="input-chat-message"
                    />
                    <Button 
                      variant="gold" 
                      size="icon" 
                      onClick={sendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      data-testid="button-send-message"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
}
