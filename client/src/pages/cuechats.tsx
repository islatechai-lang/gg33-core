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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MessageCircle, Send, Bot, User, AlertCircle, RotateCcw, Sparkles, Plus, Play, Lock, Crown, Paperclip, X, History, Trash2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  error?: boolean;
}

interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string | number | Date;
  createdAt?: string | number | Date;
}

function formatRelativeTime(dateInput: string | number | Date): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Recently";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
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
        {msg.image && (
          <div className="mb-2">
            <img
              src={msg.image}
              alt="Uploaded attachment"
              className="rounded-md max-h-60 max-w-full object-contain bg-black/40 border border-amber-500/20"
            />
          </div>
        )}
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
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    previewUrl: string;
    base64: string;
    mimeType: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Load chat threads from local storage & sync with server
  useEffect(() => {
    if (!savedOdisId) return;

    // 1. Instant load from local storage
    try {
      const localData = localStorage.getItem(`corechat_threads_${savedOdisId}`);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          setThreads(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to parse local chat threads:", e);
    }

    // 2. Fetch from backend to sync
    setIsLoadingHistory(true);
    fetch(`/api/chat/threads?odisId=${savedOdisId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.threads)) {
          setThreads(data.threads);
          try {
            localStorage.setItem(`corechat_threads_${savedOdisId}`, JSON.stringify(data.threads));
          } catch (e) {
            console.warn("Failed to update local chat threads:", e);
          }
        }
      })
      .catch(err => {
        console.error("Error fetching chat threads:", err);
      })
      .finally(() => {
        setIsLoadingHistory(false);
      });
  }, [savedOdisId]);

  const persistThread = (threadId: string, title: string, updatedMessages: ChatMessage[]) => {
    const activeOdisId = savedOdisId || (typeof window !== 'undefined' ? localStorage.getItem('gg33-odis-id') : null);
    const now = new Date().toISOString();

    setThreads(prev => {
      const existingIdx = prev.findIndex(t => t.id === threadId);
      let updatedList: ChatThread[];
      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        const updatedThread: ChatThread = {
          ...existing,
          title: title || existing.title,
          messages: updatedMessages,
          updatedAt: now,
        };
        updatedList = [updatedThread, ...prev.filter(t => t.id !== threadId)];
      } else {
        const newThread: ChatThread = {
          id: threadId,
          title: title || "New Conversation",
          messages: updatedMessages,
          createdAt: now,
          updatedAt: now,
        };
        updatedList = [newThread, ...prev];
      }

      if (activeOdisId) {
        try {
          localStorage.setItem(`corechat_threads_${activeOdisId}`, JSON.stringify(updatedList));
        } catch (e) {
          console.warn("Failed to save to localStorage:", e);
        }
      }
      return updatedList;
    });

    if (activeOdisId) {
      fetch('/api/chat/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: threadId,
          odisId: activeOdisId,
          title,
          messages: updatedMessages,
        }),
        credentials: 'include',
      }).catch(err => {
        console.error("Failed to sync thread with server:", err);
      });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage({
        file,
        previewUrl: URL.createObjectURL(file),
        base64,
        mimeType: file.type || 'image/jpeg',
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeSelectedImage = () => {
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(null);
  };

  const initChatSessionSilent = async (): Promise<ChatSession | null> => {
    if (chatSession) return chatSession;
    const odisId = savedOdisId || (typeof window !== 'undefined' ? localStorage.getItem('gg33-odis-id') : null);
    if (!odisId) return null;

    try {
      const response = await fetch('/api/chat/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ odisId }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success && data.systemContext) {
        const session: ChatSession = {
          systemContext: data.systemContext,
          firstName: data.firstName,
          chartSummary: data.chartSummary,
        };
        setChatSession(session);
        return session;
      }
    } catch (e) {
      console.error("Silent chat init error:", e);
    }
    return null;
  };

  const startChat = async () => {
    if (isInitializing) return;
    
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }
    
    const odisId = savedOdisId || (typeof window !== 'undefined' ? localStorage.getItem('gg33-odis-id') : null);
    
    if (!odisId) {
      setError('Please create your profile first to use CoreChats');
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

  const selectThread = async (thread: ChatThread) => {
    setCurrentThreadId(thread.id);
    setMessages(thread.messages || []);
    setShowPreview(false);
    setIsHistoryOpen(false);
    setError(null);
    removeSelectedImage();
    if (!chatSession) {
      initChatSessionSilent();
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const deleteThread = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const activeOdisId = savedOdisId || (typeof window !== 'undefined' ? localStorage.getItem('gg33-odis-id') : null);

    setThreads(prev => {
      const filtered = prev.filter(t => t.id !== threadId);
      if (activeOdisId) {
        try {
          localStorage.setItem(`corechat_threads_${activeOdisId}`, JSON.stringify(filtered));
        } catch (err) {
          console.warn(err);
        }
      }
      return filtered;
    });

    if (currentThreadId === threadId) {
      setCurrentThreadId(null);
      setMessages([]);
    }

    if (activeOdisId) {
      try {
        await fetch(`/api/chat/threads/${threadId}?odisId=${activeOdisId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      } catch (err) {
        console.error("Error deleting thread:", err);
      }
    }
  };

  const clearAllThreads = async () => {
    if (!window.confirm("Are you sure you want to delete all chat history?")) return;
    const activeOdisId = savedOdisId || (typeof window !== 'undefined' ? localStorage.getItem('gg33-odis-id') : null);

    setThreads([]);
    setCurrentThreadId(null);
    setMessages([]);

    if (activeOdisId) {
      try {
        localStorage.removeItem(`corechat_threads_${activeOdisId}`);
        await fetch(`/api/chat/threads?odisId=${activeOdisId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      } catch (err) {
        console.warn("Failed to clear threads from server:", err);
      }
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    let activeSession = chatSession;
    if (!activeSession) {
      activeSession = await initChatSessionSilent();
      if (!activeSession) {
        setError('Please start a chat session first.');
        return;
      }
    }

    const userMessage = inputValue.trim();
    const currentImage = selectedImage;
    setInputValue('');
    setSelectedImage(null);
    setError(null);

    let threadId = currentThreadId;
    let threadTitle = "";
    if (!threadId) {
      threadId = `thread_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      threadTitle = userMessage.slice(0, 45) + (userMessage.length > 45 ? '...' : '');
      if (!threadTitle && currentImage) threadTitle = "Image Analysis";
      setCurrentThreadId(threadId);
    } else {
      const existing = threads.find(t => t.id === threadId);
      threadTitle = existing?.title || userMessage.slice(0, 45);
    }

    const newUserMessage: ChatMessage = { 
      role: 'user', 
      content: userMessage || (currentImage ? 'Analyzing uploaded image...' : ''),
      image: currentImage?.previewUrl,
    };
    const messagesWithUser = [...messages, newUserMessage];
    setMessages(messagesWithUser);
    setIsLoading(true);

    persistThread(threadId, threadTitle, messagesWithUser);

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
          message: userMessage || 'Please analyze this image based on my energy blueprint and profile.',
          systemContext: activeSession.systemContext,
          firstName: activeSession.firstName,
          conversationHistory,
          image: currentImage ? {
            mimeType: currentImage.mimeType,
            data: currentImage.base64,
          } : undefined,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.response) {
        const assistantMessage: ChatMessage = { role: 'assistant', content: data.response };
        const finalMessages = [...messagesWithUser, assistantMessage];
        setMessages(finalMessages);
        persistThread(threadId, threadTitle, finalMessages);
      } else {
        throw new Error(data.error || 'No response received');
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
    removeSelectedImage();
    setCurrentThreadId(null);
    setMessages([]);
    setInputValue('');
    setError(null);
    setIsHistoryOpen(false);
    setShowPreview(false);
    if (!chatSession) {
      await startChat();
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      <StarField />
      <Navigation />
      
      <main className="pt-16 min-h-screen flex flex-col relative w-full bg-transparent" data-testid="page-cuechats">
        {/* Full-width sticky top bar directly beneath navigation */}
        <div className="sticky top-16 z-20 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm flex-shrink-0">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-zinc-100">CoreChat AI</h2>
                <p className="text-[11px] text-zinc-400 hidden sm:block">
                  Blueprint-aligned cosmic intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsHistoryOpen(true)}
                className="border-zinc-700/80 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 text-xs gap-1.5 h-8 px-2 sm:px-3"
                data-testid="button-chat-history"
              >
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">History</span>
                {threads.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-semibold">
                    {threads.length}
                  </span>
                )}
              </Button>
              {!showPreview && (
                <Button
                  variant="gold"
                  size="sm"
                  onClick={startNewChat}
                  disabled={isLoading || isInitializing}
                  className="h-8 px-2 sm:px-3 text-xs"
                  data-testid="button-new-chat"
                >
                  {isInitializing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="mr-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </motion.div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      <span>New</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Message Canvas Area - Full Coverage, directly belonging to page */}
        <div className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-40 lg:pb-32 space-y-4">
          {showPreview ? (
            <>
              {exampleMessages.map((msg, i) => (
                <ChatBubble key={i} msg={msg} index={i} isExample />
              ))}
            </>
          ) : (
            <>
              {!hasMessages && (
                <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center py-6 px-4 space-y-4">
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
                      "What energy should I focus on today?",
                      "How can I align my career with my natural strengths?",
                      "What does my energy say about my relationship dynamics?",
                      "What are my greatest gifts and hidden blind spots?",
                      "What major cycle or lessons am I navigating right now?",
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

        {/* Error Banner */}
        {error && (
          <div className="fixed bottom-[calc(4rem+64px+env(safe-area-inset-bottom,0px))] lg:bottom-[70px] left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
            <div className="max-w-md w-full px-4 py-2 bg-red-950/95 border border-red-500/40 rounded-xl shadow-xl backdrop-blur-md pointer-events-auto">
              <p className="text-xs text-red-300 text-center" data-testid="text-chat-error">{error}</p>
            </div>
          </div>
        )}

        {/* Fixed Bottom Action Bar: Always docked at bottom (on desktop: bottom-0, on mobile: above bottom nav) */}
        <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] lg:bottom-0 left-0 right-0 z-30 bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] pb-[env(safe-area-inset-bottom,0px)]">
          <div className="max-w-4xl mx-auto px-3 py-2.5 sm:px-6 sm:py-3.5">
            {showPreview ? (
              <Button
                variant="gold"
                size="lg"
                onClick={startChat}
                disabled={isInitializing}
                className="w-full h-12 rounded-xl font-bold text-sm sm:text-base shadow-lg cursor-pointer flex items-center justify-center gap-2"
                data-testid="button-start-chat"
              >
                {isInitializing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                    <span>Initializing CoreChat...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Conversation</span>
                  </>
                )}
              </Button>
            ) : (
              <div>
                {selectedImage && (
                  <div className="relative inline-block mb-2">
                    <img
                      src={selectedImage.previewUrl}
                      alt="Upload preview"
                      className="w-14 h-14 object-cover rounded-lg border border-amber-500/50 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="absolute -top-1.5 -right-1.5 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white rounded-full p-0.5 shadow transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="text-zinc-400 hover:text-amber-400 flex-shrink-0 h-10 w-10"
                    title="Attach image or file"
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    ref={inputRef}
                    variant="frosted"
                    placeholder="Ask CoreChat anything..."
                    className="flex-1 bg-zinc-900/80 border-zinc-700/80 focus:border-amber-500/60 text-sm h-11 rounded-xl"
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
                    disabled={isLoading || (!inputValue.trim() && !selectedImage)}
                    className="h-11 w-11 rounded-xl flex-shrink-0 shadow-md"
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
          </div>
        </div>
      </main>

      <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <SheetContent side="left" className="w-full sm:max-w-md bg-zinc-950 border-r border-zinc-800 p-0 flex flex-col z-50">
          <SheetHeader className="p-4 border-b border-zinc-800 flex flex-row items-center justify-between space-y-0 pr-12">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <SheetTitle className="text-base font-semibold text-zinc-100">Chat History</SheetTitle>
            </div>
            {threads.length > 0 && (
              <button
                type="button"
                onClick={clearAllThreads}
                className="text-xs text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer py-1 px-2 rounded-md hover:bg-red-500/10"
                title="Clear all chat history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </SheetHeader>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {isLoadingHistory && threads.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2 text-zinc-500">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </motion.div>
                <p className="text-xs text-zinc-400">Loading your conversations...</p>
              </div>
            ) : threads.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3 text-zinc-500">
                <MessageSquare className="w-10 h-10 stroke-1 text-zinc-600" />
                <div>
                  <p className="text-sm font-medium text-zinc-400">No chat history yet</p>
                  <p className="text-xs text-zinc-600 mt-1">Start a conversation with CoreChat AI and your chats will be saved here automatically.</p>
                </div>
              </div>
            ) : (
              threads.map(thread => {
                const isActive = thread.id === currentThreadId;
                return (
                  <div
                    key={thread.id}
                    onClick={() => selectThread(thread)}
                    className={`group w-full p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                        : 'bg-zinc-900/50 hover:bg-zinc-900 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                        <span className="text-xs font-medium truncate block text-zinc-100">
                          {thread.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                        <span>{formatRelativeTime(thread.updatedAt)}</span>
                        <span>•</span>
                        <span>{thread.messages?.length || 0} messages</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => deleteThread(thread.id, e)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/15 active:bg-red-500/25 transition-colors cursor-pointer flex-shrink-0"
                      title="Delete chat"
                      aria-label="Delete chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
}
