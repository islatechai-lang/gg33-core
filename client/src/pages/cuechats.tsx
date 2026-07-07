import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import { StarField } from '@/components/StarField';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UpgradeModal } from '@/components/UpgradeModal';
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
}

const exampleMessages: ChatMessage[] = [
  { role: 'user', content: "What energy should I expect today?" },
  { role: 'assistant', content: "Your Personal Day 7 is calling for reflection and inner work. Combined with your Life Path's need for structure, today is perfect for planning rather than action." },
  { role: 'user', content: "How compatible am I with someone born March 15?" },
  { role: 'assistant', content: "A Pisces! Their water energy flows beautifully with your earth grounding. Their Life Path would complement your stability with creativity." },
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

  const savedOdisId = localStorage.getItem('gg33-odis-id');
  const { data: profileData } = useQuery<{ isPro?: boolean }>({
    queryKey: ['/api/profile', savedOdisId],
    enabled: !!savedOdisId,
  });
  const isPro = profileData?.isPro ?? false;

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
    
    const odisId = localStorage.getItem('gg33-odis-id');
    
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
                    <CardTitle className="text-4">CueChat AI</CardTitle>
                    <CardDescription className="text-2 text-gray-11">
                      {chatSession ? `Chatting with ${chatSession.firstName}` : 'Powered by your energy profile'}
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
                      <div className="h-full flex flex-col items-center justify-center text-gray-11">
                        <Bot className="w-12 h-12 text-amber-9 mb-4" />
                        <p className="text-3">Ask me anything</p>
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
                      placeholder="Ask about your energy, compatibility, decisions..."
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
