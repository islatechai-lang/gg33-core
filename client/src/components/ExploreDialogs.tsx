import { useQuery, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertCircle, CalendarDays, CalendarRange, Home, Car, Hash, Type,
    Grid, Square, Moon, Zap, Palette, Sun, UserCircle, CircleDashed,
    Star, Compass, Heart, Globe, TrendingUp, Users, Check, MapPin, Briefcase,
    Sparkles, Loader2, AlertTriangle, Stars, ArrowUpCircle, ArrowDownCircle,
    Target, Flame, Gem, Shield, Activity, History, Trophy, Medal, CircleDot,
    CheckCircle2, Swords, Map, Calculator, Calendar
} from 'lucide-react';
import { useState } from 'react';

function FormattedMessage({ text }: { text: string }) {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    const content = part.slice(2, -2);
                    return (
                        <span key={i} className="font-black text-amber-11 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)] mx-0.5">
                            {content}
                        </span>
                    );
                }
                return part;
            })}
        </>
    );
}

function AIFeatureChat({ endpoint, payload, placeholder = "Ask Gemini...", buttonText = "Analyze", isTextarea = false }: { endpoint: string, payload: any, placeholder?: string, buttonText?: string, isTextarea?: boolean }) {
    const [input, setInput] = useState('');

    const chatMutation = useMutation({
        mutationFn: async (text: string) => {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, input: text })
            });
            if (!res.ok) throw new Error('Failed to get AI response');
            const data = await res.json();
            return data.response;
        }
    });

    return (
        <div className="mt-8 relative rounded-xl border-2 border-amber-9/30 bg-gradient-to-br from-amber-a2/30 to-amber-a4/30 overflow-hidden shadow-lg backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-3 opacity-20">
                <Sparkles className="w-12 h-12 text-amber-9" />
            </div>
            <div className="p-5 relative z-10">
                <h4 className="font-bold flex items-center gap-2 mb-3 text-amber-11">
                    <Sparkles className="w-5 h-5 fill-amber-9" />
                    Ask Your Cosmic AI
                </h4>

                {chatMutation.data ? (
                    <div className="space-y-4">
                        <div className="p-5 bg-background border border-amber-500/30 rounded-xl rounded-tr-none ml-6 text-sm leading-relaxed text-gray-12 shadow-inner whitespace-pre-wrap">
                            <FormattedMessage text={chatMutation.data} />
                        </div>
                        <Button variant="outline" size="sm" onClick={() => { setInput(''); chatMutation.reset(); }} className="w-full">Ask Another Question</Button>
                    </div>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); if (input) chatMutation.mutate(input); }} className="space-y-3">
                        {isTextarea ? (
                            <Textarea
                                placeholder={placeholder}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="resize-none bg-background/80 border-amber-a4 focus-visible:ring-amber-9 min-h-[80px]"
                                disabled={chatMutation.isPending}
                            />
                        ) : (
                            <Input
                                placeholder={placeholder}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="bg-background/80 border-amber-a4 focus-visible:ring-amber-9"
                                disabled={chatMutation.isPending}
                            />
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-amber-9 hover:bg-amber-10 text-white font-bold"
                            disabled={!input.trim() || chatMutation.isPending}
                        >
                            {chatMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            {chatMutation.isPending ? 'Analyzing Frequency...' : buttonText}
                        </Button>
                        {chatMutation.isError && <div className="text-red-9 text-xs mt-2 text-center">Failed to connect to Oracle. Try again.</div>}
                    </form>
                )}
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-a3 rounded w-3/4" />
            <div className="h-4 bg-gray-a3 rounded w-1/2" />
            <div className="space-y-2 mt-4">
                <div className="h-20 bg-gray-a3 rounded" />
                <div className="h-20 bg-gray-a3 rounded" />
                <div className="h-20 bg-gray-a3 rounded" />
            </div>
        </div>
    );
}

function ErrorMessage({ text }: { text: string }) {
    return (
        <div className="text-red-9 flex flex-col items-center justify-center py-12 gap-3 bg-red-a2 rounded-2xl border border-red-a4">
            <AlertCircle className="w-10 h-10 opacity-50" />
            <div className="font-bold">{text}</div>
        </div>
    );
}

// 1. Yearly Forecast
export function YearlyForecastDialog({ open, onClose, lifePathNumber }: any) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/explore/yearly-forecast', lifePathNumber],
        queryFn: async () => {
            if (!lifePathNumber) return null;
            const res = await fetch(`/api/explore/yearly-forecast/${lifePathNumber}`);
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        },
        enabled: open && !!lifePathNumber,
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <CalendarDays className="w-6 h-6" />
                        </div>
                        Yearly Forecast
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">Cosmic themes and cycles for your year ahead</DialogDescription>
                </DialogHeader>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to load yearly forecast" /> : data ? (
                        <div className="space-y-6">
                            <div className="flex flex-col gap-4 p-5 bg-amber-a2 rounded-xl border-2 border-amber-a4 shadow-inner">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-bold text-amber-11 uppercase tracking-widest">{data.year} Theme</div>
                                    <Badge variant="secondary" className="bg-amber-9 text-white">{data.personalYearNumber} Personal Year</Badge>
                                </div>
                                <div className="text-2xl font-black text-gray-12">{data.title}</div>
                                <p className="text-gray-11 text-md leading-relaxed">{data.description}</p>
                            </div>

                            <div>
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-9" />
                                    Key Quarterly Focus
                                </h4>
                                <div className="grid gap-3">
                                    {data.quarters.map((q: any, i: number) => (
                                        <div key={i} className="p-4 bg-gray-a2 rounded-lg border border-gray-a3">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="font-bold text-gray-12">{q.quarter}</div>
                                                <Badge variant="outline">{q.theme}</Badge>
                                            </div>
                                            <p className="text-sm text-gray-11 italic">"{q.advice}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {data.keyDates && (
                                <div>
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4 text-blue-500" />
                                        Critical Pivot Points
                                    </h4>
                                    <div className="space-y-3">
                                        {data.keyDates.map((date: any, i: number) => (
                                            <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 bg-gray-a2 rounded-lg border border-gray-a3">
                                                <div className="w-full sm:w-24 shrink-0 font-bold text-sm text-gray-12 flex items-center">{date.month}</div>
                                                <div className="flex-1 text-sm text-gray-11 leading-snug">{date.event}</div>
                                                <Badge variant="secondary" className="w-fit self-start sm:self-center text-[10px] capitalize">{date.type}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {data.luckyMonths && data.challengeMonths && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                                        <h5 className="font-bold text-green-700 dark:text-green-400 mb-2 text-sm">Power Months</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {data.luckyMonths.map((m: any, i: number) => (
                                                <Badge key={i} variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-400 border-none">{m.name}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-rose-500/10 rounded-lg border border-rose-500/20">
                                        <h5 className="font-bold text-rose-700 dark:text-rose-400 mb-2 text-sm">Testing Months</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {data.challengeMonths.map((m: any, i: number) => (
                                                <Badge key={i} variant="outline" className="bg-rose-500/20 text-rose-700 dark:text-rose-400 border-none">{m.name}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <AIFeatureChat
                                endpoint="/api/explore/yearly-forecast/interact"
                                payload={{ lifePath: lifePathNumber }}
                                placeholder="What is your biggest goal or intention for this year?"
                                buttonText="Generate Strategic Roadmap"
                                isTextarea={true}
                            />
                        </div>
                    ) : null}
                    </div>
                </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 2. Monthly Forecast
export function MonthlyForecastDialog({ open, onClose, lifePathNumber }: any) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/explore/monthly-forecast', lifePathNumber],
        queryFn: async () => {
            if (!lifePathNumber) return null;
            const res = await fetch(`/api/explore/monthly-forecast/${lifePathNumber}`);
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        },
        enabled: open && !!lifePathNumber,
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <CalendarRange className="w-6 h-6" />
                        </div>
                        Monthly Forecast
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">Detailed monthly predictions and guidance</DialogDescription>
                </DialogHeader>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to load monthly forecast" /> : data ? (
                        <div className="space-y-6">
                            <div className="text-center p-6 bg-amber-a2 rounded-xl border-2 border-amber-a4 shadow-inner">
                                <div className="text-sm font-bold text-amber-11 uppercase mb-2">{data.monthName} Energy</div>
                                <div className="text-4xl font-black text-gray-12 mb-3">Personal Month {data.personalMonthNumber}</div>
                                <p className="text-gray-11 text-lg max-w-lg mx-auto">{data.summary}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/10">
                                    <h4 className="font-bold mb-3 flex items-center gap-2 text-green-600 dark:text-green-500">
                                        <TrendingUp className="w-4 h-4" /> Opportunities
                                    </h4>
                                    <ul className="text-sm text-gray-11 space-y-2">
                                        {data.opportunities.map((item: string, i: number) => (
                                            <li key={i} className="flex gap-2 items-start"><span className="text-green-500 mt-0.5">•</span> {item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 bg-rose-500/5 rounded-lg border border-rose-500/10">
                                    <h4 className="font-bold mb-3 flex items-center gap-2 text-rose-600 dark:text-rose-500">
                                        <AlertCircle className="w-4 h-4" /> Challenges to Watch
                                    </h4>
                                    <ul className="text-sm text-gray-11 space-y-2">
                                        {data.challenges.map((item: string, i: number) => (
                                            <li key={i} className="flex gap-2 items-start"><span className="text-rose-500 mt-0.5">•</span> {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {data.weeklyBreakdown && (
                                <div className="space-y-3">
                                    <h4 className="font-bold flex items-center gap-2 text-gray-12">
                                        <CalendarRange className="w-4 h-4 text-blue-500" /> Weekly Rhythm
                                    </h4>
                                    <div className="grid gap-2">
                                        {data.weeklyBreakdown.map((week: any, i: number) => (
                                            <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 bg-gray-a2 rounded-lg border border-gray-a3">
                                                <div className="w-full sm:w-32 shrink-0 flex items-center justify-between sm:block">
                                                    <span className="font-bold text-sm text-gray-12">{week.week.split(' ')[0]} {week.week.split(' ')[1]}</span>
                                                    <Badge variant="outline" className="text-[10px] ml-2">{week.focus}</Badge>
                                                </div>
                                                <div className="flex-1 text-sm text-gray-11">{week.tip}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {data.luckyDays && data.affirmation && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-5 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl">
                                        <h5 className="font-bold text-amber-9 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Monthly Affirmation</h5>
                                        <p className="text-sm font-medium text-gray-12 italic">"{data.affirmation}"</p>
                                    </div>
                                    <div className="p-5 bg-gray-a2 border border-gray-a3 rounded-xl">
                                        <h5 className="font-bold text-gray-12 mb-3 flex items-center gap-2"><CalendarDays className="w-4 h-4" /> High ROI Days</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {data.luckyDays.map((day: number, i: number) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <AIFeatureChat
                                endpoint="/api/explore/monthly-forecast/interact"
                                payload={{ lifePath: lifePathNumber }}
                                placeholder="What is a specific obstacle you are facing right now?"
                                buttonText="Get Cosmic Strategy"
                                isTextarea={true}
                            />
                        </div>
                    ) : null}
                    </div>
                </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 3. Home Picker
export function HomePickerDialog({ open, onClose, lifePathNumber }: any) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/explore/home-picker', lifePathNumber],
        queryFn: async () => {
            if (!lifePathNumber) return null;
            const res = await fetch(`/api/explore/home-picker/${lifePathNumber}`);
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        },
        enabled: open && !!lifePathNumber,
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <Home className="w-6 h-6" />
                        </div>
                        Home Picker
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">Find environments and homes that match your vibe</DialogDescription>
                </DialogHeader>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to load home picker" /> : data ? (
                        <div className="space-y-6">
                            <p className="text-gray-11 leading-relaxed">{data.overview}</p>

                            <div>
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-amber-9" /> Ideal Environments
                                </h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {data.environments.map((env: any, i: number) => (
                                        <div key={i} className="p-4 bg-gray-a2 border border-amber-a2 hover:border-amber-a5 transition-colors rounded-lg">
                                            <div className="font-bold text-gray-12">{env.type}</div>
                                            <div className="text-xs text-gray-11 mt-1">{env.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-5 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-xl">
                                    <h4 className="font-bold mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                                        <Hash className="w-4 h-4" /> Optimal House Numbers
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {data.goodHouseNumbers.map((num: number) => (
                                            <Badge key={num} className="bg-green-500/20 text-green-700 dark:text-green-400 border-none font-bold px-3 py-1">#{num}</Badge>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-green-700/80 dark:text-green-400/80 leading-relaxed max-w-[90%]">These numbers create a harmonic resonance with your Life Path.</p>
                                </div>

                                {data.avoidHouseNumbers && (
                                    <div className="p-5 bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 rounded-xl">
                                        <h4 className="font-bold mb-3 flex items-center gap-2 text-rose-700 dark:text-rose-400">
                                            <AlertCircle className="w-4 h-4" /> Numbers to Avoid
                                        </h4>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {data.avoidHouseNumbers.map((num: number) => (
                                                <Badge key={num} variant="outline" className="bg-rose-500/20 text-rose-700 dark:text-rose-400 border-none font-bold px-3 py-1">#{num}</Badge>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-rose-700/80 dark:text-rose-400/80 leading-relaxed max-w-[90%]">These numbers create static and energetic friction for you.</p>
                                    </div>
                                )}
                            </div>

                            {data.fengShuiTips && (
                                <div>
                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-12">
                                        <Compass className="w-5 h-5 text-amber-500" /> Life Path Feng Shui Hacks
                                    </h4>
                                    <div className="grid gap-3">
                                        {data.fengShuiTips.map((tip: any, i: number) => (
                                            <div key={i} className="flex gap-4 p-4 bg-gray-a2 border border-gray-a3 rounded-xl shadow-sm hover:border-amber-500/30 transition-colors">
                                                <div className="w-24 shrink-0 font-bold text-sm text-gray-12">{tip.area}</div>
                                                <div className="w-px bg-gray-a3 hidden sm:block"></div>
                                                <div className="flex-1 text-sm text-gray-11 leading-relaxed">{tip.tip}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <AIFeatureChat
                                endpoint="/api/explore/home-picker/interact"
                                payload={{ lifePath: lifePathNumber }}
                                placeholder="Enter a city, country, or specific address you're considering..."
                                buttonText="Evaluate Energetic Match"
                                isTextarea={false}
                            />
                        </div>
                    ) : null}
                    </div>
                </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 4. Cars
export function CarsDialog({ open, onClose, lifePathNumber }: any) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/explore/cars', lifePathNumber],
        queryFn: async () => {
            if (!lifePathNumber) return null;
            const res = await fetch(`/api/explore/cars/${lifePathNumber}`);
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        },
        enabled: open && !!lifePathNumber,
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <Car className="w-6 h-6" />
                        </div>
                        Vehicles
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">Vehicles that align with your energetic signature</DialogDescription>
                </DialogHeader>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to load cars insights" /> : data ? (
                        <div className="space-y-6">
                            <p className="text-gray-11 leading-relaxed bg-gray-a2 p-4 rounded-lg">{data.overview}</p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {data.types.map((carType: any, i: number) => (
                                    <div key={i} className="p-4 bg-gradient-to-br from-amber-a2 to-transparent border border-amber-a4 rounded-xl">
                                        <div className="font-bold text-lg mb-1">{carType.category}</div>
                                        <div className="text-sm text-gray-11 mb-3">{carType.reason}</div>
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {carType.examples.map((ex: string, j: number) => (
                                                <Badge variant="outline" key={j} className="text-xs bg-gray-a2/50 border-amber-500/20">{ex}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-12">
                                        <Palette className="w-4 h-4 text-amber-500" /> Best Colors for Your Car
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {data.colors.map((c: string, i: number) => (
                                            <Badge variant="secondary" key={i}>{c}</Badge>
                                        ))}
                                    </div>
                                </div>
                                
                                {data.luckyPlateDigits && (
                                    <div>
                                        <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-12">
                                            <Hash className="w-4 h-4 text-green-500" /> Ideal License Plate Digits
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {data.luckyPlateDigits.map((digit: number, i: number) => (
                                                <Badge variant="outline" className="border-green-500/30 text-green-600 dark:text-green-400 font-bold" key={i}>{digit}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {(data.idealDriveDirection || data.avoidNote) && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {data.idealDriveDirection && (
                                        <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                                <Compass className="w-4 h-4" /> Power Drive Time
                                            </h4>
                                            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 leading-relaxed max-w-[90%]">{data.idealDriveDirection}</p>
                                        </div>
                                    )}
                                    {data.avoidNote && (
                                        <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/10">
                                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-rose-600 dark:text-rose-400">
                                                <AlertCircle className="w-4 h-4" /> Energetic Maintenance Hint
                                            </h4>
                                            <p className="text-xs text-rose-600/80 dark:text-rose-400/80 leading-relaxed max-w-[90%]">{data.avoidNote}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <AIFeatureChat
                                endpoint="/api/explore/cars/interact"
                                payload={{ lifePath: lifePathNumber }}
                                placeholder="What specific car make/model are you considering?"
                                buttonText="Analyze Car Energy"
                                isTextarea={false}
                            />
                        </div>
                    ) : null}
                    </div>
                </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 5. Lucky Number
export function LuckyNumberDialog({ open, onClose, lifePathNumber, birthDate }: any) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/explore/lucky-number', lifePathNumber, birthDate],
        queryFn: async () => {
            if (!lifePathNumber) return null;
            const url = new URL(`/api/explore/lucky-number/${lifePathNumber}`, window.location.origin);
            if (birthDate) {
                // Ensure date is formatted correctly for the backend
                url.searchParams.append('birthDate', birthDate);
            }
            const res = await fetch(url.toString());
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        },
        enabled: open && !!lifePathNumber,
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <Hash className="w-6 h-6" />
                        </div>
                        Lucky Numbers
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">Your personal manifestation frequencies</DialogDescription>
                </DialogHeader>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to load lucky numbers" /> : data ? (
                        <div className="space-y-8">
                            {/* Primary Number Banner */}
                            <div className="py-10 bg-gradient-to-br from-amber-900/10 to-amber-900/5 rounded-2xl border border-amber-500/20 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <Hash className="w-48 h-48" />
                                </div>
                                <div className="text-sm font-bold text-amber-11 uppercase mb-4 tracking-widest relative z-10">Primary Manifestation Frequency</div>
                                <div className="text-8xl md:text-9xl font-black text-amber-9 drop-shadow-2xl relative z-10">{data.primary}</div>
                            </div>

                            {/* Secondary Numbers Row */}
                            {data.secondary && data.secondary.length > 0 && (
                                <div className="bg-gray-a2 border border-gray-a3 rounded-xl p-6">
                                    <h4 className="font-bold flex items-center gap-2 text-gray-12 mb-4 tracking-tight">
                                        <Grid className="w-5 h-5 text-amber-500" /> Secondary Resonances
                                    </h4>
                                    <div className="flex flex-wrap gap-4">
                                        {data.secondary.map((num: number, i: number) => (
                                            <div key={i} className="w-16 h-16 rounded-2xl bg-gray-a2 border-2 border-amber-500/20 shadow-sm flex items-center justify-center text-2xl font-black text-amber-11">
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Calculation Breakdowns */}
                            {data.calculations && data.calculations.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="font-black text-xl flex items-center gap-2 text-gray-12 tracking-tight">
                                        <Calculator className="w-6 h-6 text-amber-500" /> 
                                        How Your Numbers Are Calculated
                                    </h4>
                                    <p className="text-gray-11 text-sm mb-4 leading-relaxed">Numerologists use various mathematical methods to extract vibrational frequencies from your birth date. Here are your personal calculations:</p>
                                    
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {data.calculations.map((calc: any, i: number) => (
                                            <div key={i} className="bg-gray-a2 border border-gray-a3 rounded-xl p-5 hover:border-amber-500/30 transition-colors shadow-sm relative overflow-hidden group">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50" />
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h5 className="font-bold text-gray-12">{calc.method}</h5>
                                                        <p className="text-[11px] text-gray-11 mt-0.5 max-w-[90%]">{calc.description}</p>
                                                    </div>
                                                    <div className="text-2xl font-black text-amber-9 bg-amber-900/10 w-12 h-12 flex items-center justify-center rounded-lg shadow-inner group-hover:scale-105 transition-transform">
                                                        {calc.result}
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4 space-y-2 bg-black/20 p-3 rounded-lg border border-gray-a3">
                                                    {calc.steps.map((step: string, j: number) => (
                                                        <div key={j} className="text-xs text-gray-11 flex items-start gap-2">
                                                            <div className="text-amber-500/70 mt-0.5">•</div>
                                                            <span className="leading-snug">{step}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Power Days and Avoid Numbers Grid */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {data.powerDays && data.powerDays.length > 0 && (
                                    <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-6">
                                        <h4 className="font-bold flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                                            <Calendar className="w-5 h-5" /> Power Days in a Month
                                        </h4>
                                        <p className="text-xs text-green-700/80 dark:text-green-400/80 mb-4">Dates when your energy is highly magnified.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {data.powerDays.map((day: number, i: number) => (
                                                <div key={i} className="w-10 h-10 rounded-full bg-green-500/20 text-green-700 dark:text-green-300 flex items-center justify-center font-bold text-sm shadow-sm">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {data.avoidNumbers && data.avoidNumbers.length > 0 && (
                                    <div className="bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 rounded-xl p-6">
                                        <h4 className="font-bold flex items-center gap-2 text-rose-700 dark:text-rose-400 mb-2">
                                            <AlertTriangle className="w-5 h-5" /> Friction Numbers
                                        </h4>
                                        <p className="text-xs text-rose-700/80 dark:text-rose-400/80 mb-4">Frequencies that conflict with your Life Path.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {data.avoidNumbers.map((num: number, i: number) => (
                                                <div key={i} className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-sm shadow-sm border border-rose-500/30">
                                                    {num}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Manifestation Tip */}
                            {data.manifestationTip && (
                                <div className="bg-gradient-to-r from-amber-500 text-white rounded-xl p-6 shadow-md relative overflow-hidden group hover:shadow-lg transition-shadow">
                                    <div className="relative z-10">
                                        <h4 className="font-bold mb-2 flex items-center gap-2 text-lg">
                                            <Sparkles className="w-5 h-5" /> Targeted Manifestation Tip
                                        </h4>
                                        <p className="text-amber-50 text-base leading-relaxed font-medium">{data.manifestationTip}</p>
                                    </div>
                                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/20 to-transparent skew-x-12 translate-x-10 group-hover:translate-x-[-150%] transition-transform duration-1000 ease-in-out" />
                                </div>
                            )}

                            <AIFeatureChat
                                endpoint="/api/explore/lucky-number/interact"
                                payload={{ lifePath: lifePathNumber }}
                                placeholder="Seen a recurring number or date? Enter it here..."
                                buttonText="Decode Synchronicity"
                                isTextarea={false}
                            />
                        </div>
                    ) : null}
                    </div>
                </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 6. Letterology
export function LetterologyDialog({ open, onClose, profileData }: any) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/explore/letterology', profileData?.fullName],
        queryFn: async () => {
            if (!profileData?.fullName) return null;
            const res = await fetch(`/api/explore/letterology?name=${encodeURIComponent(profileData.fullName)}`);
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        },
        enabled: open && !!profileData?.fullName,
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <Type className="w-6 h-6" />
                        </div>
                        Letterology: {data?.firstName}
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">Decoding the vibrational frequency of your first name</DialogDescription>
                </DialogHeader>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to load letterology" /> : data ? (
                        <div className="space-y-6">
                            <div className="flex justify-center flex-wrap gap-2 p-6 bg-gray-a2 rounded-xl">
                                {data.letters.map((l: any, i: number) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-lg bg-amber-9 text-white flex items-center justify-center text-2xl font-black shadow-lg">
                                            {l.char.toUpperCase()}
                                        </div>
                                        <div className="text-xs font-mono mt-2 text-gray-11">{l.value}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-amber-a2 border border-amber-a4 rounded-xl text-center shadow-sm">
                                    <div className="text-[10px] text-amber-11 font-bold uppercase tracking-wider mb-2">Full Expression</div>
                                    <div className="text-3xl font-black text-amber-9 mb-1">{data.expressionNumber}</div>
                                    <div className="text-[10px] text-amber-11/80 leading-tight">Total Name Frequency</div>
                                </div>
                                <div className="p-4 bg-indigo-a2 border border-indigo-a4 rounded-xl text-center shadow-sm">
                                    <div className="text-[10px] text-indigo-11 font-bold uppercase tracking-wider mb-2">Soul Urge</div>
                                    <div className="text-3xl font-black text-indigo-9 mb-1">{data.soulUrgeNumber}</div>
                                    <div className="text-[10px] text-indigo-11/80 leading-tight">Full Name: Inner Desire</div>
                                </div>
                                <div className="p-4 bg-emerald-a2 border border-emerald-a4 rounded-xl text-center shadow-sm">
                                    <div className="text-[10px] text-emerald-11 font-bold uppercase tracking-wider mb-2">Personality</div>
                                    <div className="text-3xl font-black text-emerald-9 mb-1">{data.personalityNumber}</div>
                                    <div className="text-[10px] text-emerald-11/80 leading-tight">Full Name: Outer Perception</div>
                                </div>
                                <div className="p-4 bg-rose-a2 border border-rose-a4 rounded-xl text-center shadow-sm">
                                    <div className="text-[10px] text-rose-11 font-bold uppercase tracking-wider mb-2">Composite Energy</div>
                                    <div className="text-3xl font-black text-rose-9 mb-1 uppercase text-lg flex items-center justify-center h-9">{data.nameEnergy}</div>
                                    <div className="text-[10px] text-rose-11/80 leading-tight">Vibrational Rating</div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-a2 border border-gray-a3 rounded-xl">
                                        <h4 className="font-bold text-sm text-gray-12 mb-2 flex items-center gap-2"><Type className="w-4 h-4 text-amber-500" /> Expression Breakdown</h4>
                                        <p className="text-xs text-gray-11 leading-relaxed">{data.expressionBreakdown}</p>
                                    </div>
                                    <div className="p-4 bg-gray-a2 border border-gray-a3 rounded-xl">
                                        <h4 className="font-bold text-sm text-gray-12 mb-2 flex items-center gap-2"><Heart className="w-4 h-4 text-rose-500" /> Soul Urge Breakdown</h4>
                                        <p className="text-xs text-gray-11 leading-relaxed">{data.soulUrgeBreakdown}</p>
                                    </div>
                                    <div className="p-4 bg-gray-a2 border border-gray-a3 rounded-xl">
                                        <h4 className="font-bold text-sm text-gray-12 mb-2 flex items-center gap-2"><UserCircle className="w-4 h-4 text-emerald-500" /> Personality Breakdown</h4>
                                        <p className="text-xs text-gray-11 leading-relaxed">{data.personalityBreakdown}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold mb-2 border-b pb-2 text-gray-12 flex items-center gap-2">
                                        <Grid className="w-4 h-4 text-indigo-500" /> Structural Pillars
                                    </h4>
                                    <div className="p-4 bg-amber-a2 border border-amber-a3 rounded-lg">
                                        <div className="text-[10px] text-amber-11 font-bold uppercase tracking-wider mb-1">Cornerstone (Start)</div>
                                        <div className="text-xl font-bold mb-2 text-amber-12">"{data.cornerstone.char}"</div>
                                        <div className="text-xs text-amber-11/80 leading-relaxed">{data.cornerstone.meaning}</div>
                                    </div>
                                    <div className="p-4 bg-indigo-a2 border border-indigo-a3 rounded-lg">
                                        <div className="text-[10px] text-indigo-11 font-bold uppercase tracking-wider mb-1">Capstone (Finish)</div>
                                        <div className="text-xl font-bold mb-2 text-indigo-12">"{data.capstone.char}"</div>
                                        <div className="text-xs text-indigo-11/80 leading-relaxed">{data.capstone.meaning}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-a2 rounded-lg">
                                <h4 className="font-bold mb-2 border-b pb-2">Name Vibrational Summary</h4>
                                <p className="text-sm leading-relaxed text-gray-11">{data.summary}</p>
                            </div>

                            <AIFeatureChat
                                endpoint="/api/explore/letterology/interact"
                                payload={{ name: profileData?.fullName }}
                                placeholder="Enter another name, brand, or word to analyze..."
                                buttonText="Analyze Frequency"
                                isTextarea={false}
                            />
                        </div>
                    ) : null}
                    </div>
                </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 7. Matrix Numbers
export function MatrixNumbersDialog({ open, onClose, lifePathNumber, birthDate }: any) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/explore/matrix-numbers', lifePathNumber, birthDate],
        queryFn: async () => {
            if (!lifePathNumber) return null;
            const url = new URL(`/api/explore/matrix-numbers/${lifePathNumber}`, window.location.origin);
            if (birthDate) url.searchParams.append('birthDate', birthDate);
            const res = await fetch(url.toString());
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        },
        enabled: open && !!lifePathNumber,
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <Grid className="w-6 h-6" />
                        </div>
                        Personal Matrix Decoded
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">Stages of peak activation for your Life Path {lifePathNumber}</DialogDescription>
                </DialogHeader>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to load matrix numbers" /> : data ? (
                        <div className="space-y-6">
                            <div className="p-4 bg-amber-900/10 border border-amber-500/20 rounded-xl text-amber-11 dark:text-amber-200 text-sm leading-relaxed">
                                {data.intro}
                            </div>

                            {data.currentPhase && (
                                <div className="p-5 bg-gradient-to-r from-indigo-500/10 to-transparent border-l-4 border-indigo-500 rounded-r-xl">
                                    <h4 className="font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-400 mb-2">
                                        <TrendingUp className="w-4 h-4" /> Your Current Focus
                                    </h4>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-sm font-bold text-gray-12 mb-1">{data.currentPhase.phase}</div>
                                            <div className="text-xs text-gray-11 leading-snug">{data.currentPhase.guidance}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-12">
                                    <Grid className="w-5 h-5 text-amber-500" /> Life Milestones
                                </h4>
                                <div className="relative space-y-4 ml-2">
                                    <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-amber-9/20 z-0 hidden md:block" />
                                    {data.milestones.map((m: any, i: number) => {
                                        const isCurrent = data.currentPhase && data.currentPhase.phase === m.title;
                                        return (
                                            <div key={i} className={`relative z-10 flex gap-4 p-4 rounded-xl border shadow-sm transition-all group ${isCurrent ? 'bg-amber-a2 border-amber-400 dark:border-amber-600' : 'bg-gray-a2 border-gray-a3 hover:border-amber-500/30'}`}>
                                                <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform ${isCurrent ? 'bg-amber-500 text-white' : 'bg-amber-9 text-white'}`}>
                                                    <div className="text-[10px] font-bold uppercase leading-none">Age</div>
                                                    <div className="text-xl font-black leading-none">{m.age}</div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className={`font-black uppercase tracking-tight text-sm ${isCurrent ? 'text-amber-700 dark:text-amber-400' : 'text-gray-12'}`}>{m.title}</h4>
                                                        {isCurrent && <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-[10px] uppercase h-5">Current Phase</Badge>}
                                                        <div className={`w-2 h-2 rounded-full bg-amber-500 animate-pulse ${isCurrent ? 'block' : 'hidden group-hover:block ml-auto'}`} />
                                                    </div>
                                                    <p className="text-xs text-gray-11 leading-relaxed">{m.description}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <AIFeatureChat
                                endpoint="/api/explore/matrix-numbers/interact"
                                payload={{ lifePath: lifePathNumber }}
                                placeholder="What is your current age or a significant age you're curious about?"
                                buttonText="Decode Age Activation"
                                isTextarea={false}
                            />
                        </div>
                    ) : null}
                    </div>
                </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 8. Cue Cards
export function CueCardsDialog({ open, onClose }: any) {
    const [flipped, setFlipped] = useState(false);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['/api/explore/cue-cards'],
        queryFn: async () => {
            const res = await fetch(`/api/explore/cue-cards/draw`);
            if (!res.ok) throw new Error('Failed to draw card');
            return res.json();
        },
        enabled: open,
        staleTime: 0, // Fresh draw every time
    });

    const handleDrawAnother = () => {
        setFlipped(false);
        setTimeout(() => refetch(), 300);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setFlipped(false);
                onClose();
            }
        }}>
            <DialogContent className="max-w-lg max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <Square className="w-6 h-6" />
                        </div>
                        Cue Cards
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">Daily guidance drawn from the cosmos</DialogDescription>
                </DialogHeader>
                </div>
                <div className="p-6 py-6 flex flex-col items-center">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to draw a card" /> : data ? (
                        <div className="flex flex-col items-center w-full">
                            <div
                                className={`relative w-64 h-96 transition-all duration-700 [transform-style:preserve-3d] cursor-pointer shadow-2xl rounded-2xl ${flipped ? '[transform:rotateY(180deg)]' : 'hover:-translate-y-2'}`}
                                onClick={() => setFlipped(true)}
                            >
                                {/* Back of Card */}
                                <div className="absolute inset-0 backface-hidden [backface-visibility:hidden] bg-gradient-to-br from-amber-7 to-amber-9 rounded-2xl flex items-center justify-center border-4 border-amber-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                                    <div className="w-16 h-16 border-4 border-amber-3/50 rounded-full flex items-center justify-center rotate-45">
                                        <Star className="w-8 h-8 text-amber-3/50" />
                                    </div>
                                    <div className="absolute bottom-6 text-amber-2/70 text-sm font-bold tracking-widest uppercase">Click to Reveal</div>
                                </div>

                                {/* Front of Card */}
                                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gray-1 rounded-2xl border-2 border-amber-5 shadow-xl p-6 flex flex-col justify-between">
                                    <div className="text-center font-serif text-sm text-gray-10 tracking-widest">{data.suit}</div>
                                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-16 h-16 bg-amber-a2 rounded-full flex items-center justify-center">
                                            {/* Mock Icon mapping */}
                                            {data.type === 'action' ? <Zap className="text-amber-11 w-8 h-8" /> : <Compass className="text-amber-11 w-8 h-8" />}
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-12 leading-tight">{data.cardName}</h3>
                                        <p className="text-sm text-gray-11 italic leading-relaxed">"{data.message}"</p>
                                    </div>
                                    <div className="text-center">
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">{data.keyword}</Badge>
                                    </div>
                                </div>
                            </div>

                            {flipped && (
                                <div className="mt-8 w-full">
                                    <AIFeatureChat
                                        endpoint="/api/explore/cue-cards/interact"
                                        payload={{
                                            cardName: data.cardName,
                                            suit: data.suit,
                                            message: data.message
                                        }}
                                        placeholder="Ask a specific question about this card's guidance..."
                                        buttonText="Interpret Card for Me"
                                        isTextarea={true}
                                    />
                                    <Button onClick={handleDrawAnother} variant="outline" className="w-full mt-4">
                                        Draw Another Card
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 9. Dream Interpreter
export function DreamInterpreterDialog({ open, onClose, lifePathNumber }: any) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/explore/dream-interpreter', lifePathNumber],
        queryFn: async () => {
            const res = await fetch(`/api/explore/dream-interpreter/${lifePathNumber || 1}`);
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        },
        enabled: open,
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <Moon className="w-6 h-6" />
                        </div>
                        Dream Symbolism
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">Common recurring themes tuned to your vibration</DialogDescription>
                </DialogHeader>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to load dream interpreter" /> : data ? (
                        <div className="space-y-6">
                            <div className="p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-xl text-indigo-950 dark:text-indigo-200 text-sm leading-relaxed">
                                {data.intro}
                            </div>

                            <div className="grid gap-4">
                                {data.commonDreams.map((d: any, i: number) => (
                                    <div key={i} className="p-4 bg-background rounded-lg border border-gray-a3 shadow-sm hover:border-indigo-500/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-gray-12 flex items-center gap-2">
                                                <Moon className="w-4 h-4 text-indigo-400" /> {d.symbol}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-11 space-y-2 mt-2">
                                            <div><span className="font-semibold text-gray-12">Meaning:</span> {d.meaning}</div>
                                            <div><span className="font-semibold text-gray-12">Your Shift:</span> {d.shift}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {data.lucidDreamTip && (
                                <div className="p-5 bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl relative overflow-hidden">
                                     <div className="absolute right-0 top-0 bottom-0 w-32 bg-purple-500/5 blur-2xl rounded-full" />
                                    <h4 className="font-bold mb-2 flex items-center gap-2 text-purple-700 dark:text-purple-400 relative z-10">
                                        <Stars className="w-5 h-5" /> Lucid Dreaming Gateway
                                    </h4>
                                    <p className="text-sm text-purple-800/80 dark:text-purple-300/80 leading-relaxed relative z-10">{data.lucidDreamTip}</p>
                                </div>
                            )}

                            <AIFeatureChat
                                endpoint="/api/explore/dream-interpreter/interact"
                                payload={{ lifePath: lifePathNumber }}
                                placeholder="Describe a dream symbol or scene you remember..."
                                buttonText="Decode Dream"
                                isTextarea={true}
                            />
                        </div>
                    ) : null}
                    </div>
                </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 10. Energy Insights
export function EnergyInsightsDialog({ open, onClose, lifePathNumber, energySignature }: any) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/explore/energy-insights', lifePathNumber, energySignature],
        queryFn: async () => {
            if (!lifePathNumber) return null;
            const res = await fetch(`/api/explore/energy-insights/${lifePathNumber}?energy=${energySignature}`);
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        },
        enabled: open && !!lifePathNumber,
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <Zap className="w-6 h-6" />
                        </div>
                        Energy Insights
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">Deep dive into your core energetic makeup</DialogDescription>
                </DialogHeader>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to load energy insights" /> : data ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-amber-a2 rounded-xl border border-amber-a4">
                                <div>
                                    <div className="text-xs text-amber-11 uppercase font-bold tracking-widest mb-1">Aura Color</div>
                                    <div className="text-3xl font-black text-amber-12">{data.auraColor}</div>
                                </div>
                                <div
                                    className="w-20 h-20 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.3)] border-4 border-white/50"
                                    style={{ backgroundColor: data.hexCode || '#FFD700' }}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold flex items-center gap-2 mb-3 border-b pb-2 text-gray-12">
                                        <Activity className="w-5 h-5 text-amber-500" /> Vibrational State
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="bg-green-500/5 border border-green-500/10 p-3 rounded-xl">
                                            <div className="text-xs font-bold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1"><ArrowUpCircle className="w-3 h-3"/> High Frequency Expression</div>
                                            <p className="text-xs text-gray-11 leading-relaxed">{data.highVibe}</p>
                                        </div>
                                        <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                                            <div className="text-xs font-bold text-red-700 dark:text-red-400 mb-1 flex items-center gap-1"><ArrowDownCircle className="w-3 h-3"/> Low Frequency Expression</div>
                                            <p className="text-xs text-gray-11 leading-relaxed">{data.lowVibe}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {data.chakraAlignment && (
                                        <div>
                                            <h4 className="font-bold flex items-center gap-2 mb-2 text-gray-12">
                                                <Target className="w-4 h-4 text-purple-500" /> Core Chakra Alignment
                                            </h4>
                                            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-1">
                                                <div className="text-sm font-bold text-purple-700 dark:text-purple-400">{data.chakraAlignment}</div>
                                                <div className="text-[10px] text-purple-600/70 dark:text-purple-400/70 leading-tight italic">{data.chakraTip}</div>
                                            </div>
                                        </div>
                                    )}
                                    {data.elementalBalance && (
                                        <div>
                                            <h4 className="font-bold flex items-center gap-2 mb-2 text-gray-12">
                                                <Flame className="w-4 h-4 text-orange-500" /> Elemental Balance
                                            </h4>
                                            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                                                <div className="text-sm font-bold text-orange-700 dark:text-orange-400">{data.elementalBalance}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {data.crystals && data.crystals.length > 0 && (
                                <div>
                                    <h4 className="font-bold flex items-center gap-2 mb-4 text-gray-12">
                                        <Gem className="w-5 h-5 text-blue-500" /> Supportive Crystals
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {data.crystals.map((c: any, i: number) => (
                                            <div key={i} className="flex gap-3 p-3 bg-gray-a2 border border-gray-a3 rounded-xl shadow-sm">
                                                <div className="font-bold text-sm text-gray-12">{c.stone}</div>
                                                <div className="w-px bg-gray-200 dark:bg-gray-800"></div>
                                                <div className="text-xs text-gray-11 flex-1">{c.reason}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="p-5 bg-gradient-to-br from-amber-50 dark:from-amber-900/10 to-transparent border border-amber-200 dark:border-amber-900/30 rounded-xl">
                                <h4 className="font-bold flex items-center gap-2 mb-2 text-amber-900 dark:text-amber-100">
                                    <Shield className="w-5 h-5 text-amber-500" /> Energetic Regimen
                                </h4>
                                <p className="text-sm text-amber-800/80 dark:text-amber-200/80 leading-relaxed font-medium">{data.regimen}</p>
                            </div>

                            <AIFeatureChat
                                endpoint="/api/explore/energy-insights/interact"
                                payload={{ lifePath: lifePathNumber }}
                                placeholder="How are you feeling energetically right now?"
                                buttonText="Check Aura Hygiene"
                                isTextarea={true}
                            />
                        </div>
                    ) : null}
                    </div>
                </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 11. Colorology
export function ColorologyDialog({ open, onClose, lifePathNumber }: any) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/explore/colorology', lifePathNumber],
        queryFn: async () => {
            if (!lifePathNumber) return null;
            const res = await fetch(`/api/explore/colorology/${lifePathNumber}`);
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        },
        enabled: open && !!lifePathNumber,
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <Palette className="w-6 h-6" />
                        </div>
                        Colorology
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">Colors that boost your aura and success</DialogDescription>
                </DialogHeader>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to load colorology" /> : data ? (
                        <div className="space-y-6">
                            <p className="text-gray-11 text-sm bg-gray-a2 p-4 rounded-lg">{data.overview}</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                {data.colors.map((c: any, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 border border-gray-a3 rounded-xl hover:shadow-md transition-shadow group relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: c.hex }} />
                                        <div className="w-16 h-16 shrink-0 rounded-xl shadow-inner border border-black/10 dark:border-white/10" style={{ backgroundColor: c.hex }} />
                                        <div className="relative z-10 flex flex-col justify-center">
                                            <div className="font-bold text-lg text-gray-12 mb-1">{c.name}</div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">{c.usage}</Badge>
                                            </div>
                                            <p className="text-xs text-gray-11 leading-snug">{c.benefit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {data.avoidColors && data.avoidColors.length > 0 && (
                                <div className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-rose-700 dark:text-rose-400">
                                        <AlertTriangle className="w-4 h-4" /> Colors to Minimize
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {data.avoidColors.map((c: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 transition-colors border-none">{c}</Badge>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-rose-600/80 dark:text-rose-400/80 leading-relaxed max-w-[90%]">These frequencies may drain your natural energy or create energetic static.</p>
                                </div>
                            )}

                            {data.combinationTip && (
                                <div className="p-5 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl relative overflow-hidden">
                                    <h4 className="font-bold mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-400 relative z-10">
                                        <Sparkles className="w-4 h-4" /> Synergy Tip
                                    </h4>
                                    <p className="text-sm text-blue-800/80 dark:text-blue-300/80 leading-relaxed relative z-10 font-medium">{data.combinationTip}</p>
                                </div>
                            )}
                        </div>
                    ) : null}
                    </div>
                </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 12. Vedic Astrology
export function VedicAstrologyDialog({ open, onClose, birthDate }: any) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/explore/vedic-astrology', birthDate],
        queryFn: async () => {
            if (!birthDate) return null;
            const res = await fetch(`/api/explore/vedic-astrology/${birthDate}`);
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        },
        enabled: open && !!birthDate,
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <Sun className="w-6 h-6" />
                        </div>
                        Vedic Astrology Snapshot
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">Ancient Eastern astrological wisdom based on your birth date</DialogDescription>
                </DialogHeader>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to load vedic astrology" /> : data ? (
                        <div className="space-y-6">
                            <div className="p-6 bg-gradient-to-tr from-amber-a2 to-red-a2 rounded-xl text-center border border-amber-a4 relative overflow-hidden">
                                <div className="absolute right-0 top-0 bottom-0 w-32 bg-amber-500/10 blur-3xl rounded-full" />
                                <div className="relative z-10">
                                    <div className="text-sm font-bold text-gray-11 uppercase mb-1">Your Nakshatra (Vedic Star)</div>
                                    <div className="text-4xl font-black text-amber-11 tracking-tight mb-2">{data.nakshatra}</div>
                                    <div className="text-sm opacity-90 font-mono tracking-widest text-amber-900 dark:text-amber-400">{data.deity}</div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <h4 className="font-bold border-b pb-2 mb-3 text-gray-12 flex items-center gap-2">
                                        <Star className="w-4 h-4 text-amber-500" /> Core Traits
                                    </h4>
                                    <ul className="space-y-2">
                                        {data.traits.map((t: string, i: number) => (
                                            <li key={i} className="flex gap-3 items-start text-sm bg-gray-a2 border border-gray-a3 p-3 rounded-xl shadow-sm">
                                                <div className="text-amber-500 mt-0.5">•</div>
                                                <span className="leading-snug text-gray-11">{t}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold border-b pb-2 mb-3 text-gray-12 flex items-center gap-2">
                                        <Sun className="w-4 h-4 text-orange-500" /> Celestial Signatures
                                    </h4>
                                    
                                    {data.rulingPlanet && (
                                        <div className="flex items-center gap-3 p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                                            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                                                <CircleDashed className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase font-bold text-orange-700/70 dark:text-orange-400/70 tracking-wider">Ruling Planet</div>
                                                <div className="text-sm font-bold text-orange-900 dark:text-orange-100">{data.rulingPlanet}</div>
                                            </div>
                                        </div>
                                    )}

                                    {data.luckyGem && (
                                        <div className="flex items-center gap-3 p-3 bg-teal-500/5 border border-teal-500/10 rounded-lg">
                                            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                                                <Gem className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase font-bold text-teal-700/70 dark:text-teal-400/70 tracking-wider">Lucky Gemstone</div>
                                                <div className="text-sm font-bold text-teal-900 dark:text-teal-100">{data.luckyGem}</div>
                                            </div>
                                        </div>
                                    )}

                                    {data.mantra && (
                                        <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg text-center">
                                            <div className="text-[10px] uppercase font-bold text-indigo-700/70 dark:text-indigo-400/70 tracking-wider mb-1">Power Mantra</div>
                                            <div className="text-lg font-serif italic text-indigo-900 dark:text-indigo-100">"{data.mantra}"</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-5 bg-gradient-to-r from-gray-a2 to-transparent rounded-xl border-l-4 border-amber-500">
                                <h4 className="text-sm font-bold mb-2 uppercase text-gray-12 tracking-wider flex items-center gap-2">
                                    <Map className="w-4 h-4 text-amber-600" /> Karmic Path
                                </h4>
                                <p className="text-sm text-gray-11 leading-relaxed">{data.karmicPath}</p>
                            </div>

                            <AIFeatureChat
                                endpoint="/api/explore/vedic-astrology/interact"
                                payload={{ birthDate: birthDate }}
                                placeholder="Ask about a specific area of life (Career, Love, etc.)..."
                                buttonText="Get Vedic Insight"
                                isTextarea={true}
                            />
                        </div>
                    ) : null}
                    </div>
                </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 13. All About You
export function AllAboutYouDialog({ open, onClose, profileData }: any) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/explore/all-about-you', profileData?.odisId],
        queryFn: async () => {
            if (!profileData?.odisId) return null;
            const res = await fetch(`/api/explore/all-about-you/${profileData.odisId}`);
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        },
        enabled: open && !!profileData?.odisId,
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <UserCircle className="w-6 h-6" />
                        </div>
                        All About You: The Master Profile
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">A unified summary of your cosmic DNA</DialogDescription>
                </DialogHeader>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to compile your master profile" /> : data ? (
                        <div className="space-y-8">
                            <div className="text-center p-8 bg-black text-white rounded-2xl relative overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-b from-amber-600/20 to-transparent"></div>
                                <div className="relative z-10">
                                    <div className="text-sm font-mono text-amber-400 mb-2">{data.fullName}</div>
                                    <div className="text-5xl font-black mb-4 tracking-tighter">Life Path {data.lifePath}</div>
                                    <Badge className="bg-amber-500 text-black hover:bg-amber-400 border-none px-4 py-1 text-sm font-bold">{data.archetype}</Badge>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-a2 border border-gray-a3 rounded-xl">
                                        <h4 className="font-bold text-gray-11 uppercase text-xs tracking-wider mb-2 flex items-center gap-2"><Activity className="w-3 h-3"/> Eastern Alignment</h4>
                                        <div className="text-lg font-bold text-gray-12">{data.chineseZodiac}</div>
                                        <div className="text-sm text-gray-11 mt-1">{data.easternDescription}</div>
                                    </div>
                                    <div className="p-4 bg-gray-a2 border border-gray-a3 rounded-xl">
                                        <h4 className="font-bold text-gray-11 uppercase text-xs tracking-wider mb-2 flex items-center gap-2"><Flame className="w-3 h-3"/> Primary Element</h4>
                                        <div className="text-lg font-bold text-gray-12">{data.element}</div>
                                    </div>
                                </div>
                                <div className="p-6 bg-gradient-to-br from-amber-50 dark:from-amber-900/10 to-transparent border border-amber-200 dark:border-amber-900/30 rounded-xl flex flex-col justify-center">
                                    <h4 className="font-bold text-amber-900 dark:text-amber-100 uppercase text-xs tracking-wider mb-3">Your Cosmic Directive</h4>
                                    <p className="text-gray-12 text-md leading-relaxed italic border-l-2 border-amber-500 pl-4">
                                        "{data.summaryDirective}"
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-black text-lg border-b pb-2 mb-4 text-green-700 dark:text-green-400 flex items-center gap-2">
                                        <Zap className="w-5 h-5"/> Core Strengths
                                    </h3>
                                    <ul className="space-y-2">
                                        {data.strengths?.map((s: string, i: number) => (
                                            <li key={i} className="flex gap-2 items-start text-sm"><div className="text-green-500 mt-1">•</div><span className="text-gray-11 leading-snug">{s}</span></li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-black text-lg border-b pb-2 mb-4 text-rose-700 dark:text-rose-400 flex items-center gap-2">
                                        <Activity className="w-5 h-5"/> Growth Areas
                                    </h3>
                                    <ul className="space-y-2">
                                        {data.growthAreas?.map((g: string, i: number) => (
                                            <li key={i} className="flex gap-2 items-start text-sm"><div className="text-rose-500 mt-1">•</div><span className="text-gray-11 leading-snug">{g}</span></li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-black text-lg border-b pb-2 mb-4 text-gray-12 flex items-center gap-2"><Grid className="w-5 h-5 text-indigo-500"/> Numerological Pillars</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="text-center space-y-2 p-4 bg-gray-a2 border border-gray-a3 rounded-xl shadow-sm">
                                        <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black text-xl">{data.lifePath}</div>
                                        <div className="font-bold text-sm text-gray-12">Life Path</div>
                                        <div className="text-xs text-gray-11">Life Purpose</div>
                                    </div>
                                    {data.soulUrgeNumber && (
                                        <div className="text-center space-y-2 p-4 bg-gray-a2 border border-gray-a3 rounded-xl shadow-sm">
                                            <div className="mx-auto w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-black text-xl">{data.soulUrgeNumber}</div>
                                            <div className="font-bold text-sm text-gray-12">Soul Urge</div>
                                            <div className="text-xs text-gray-11">Inner Desire</div>
                                        </div>
                                    )}
                                    {data.personalityNumber && (
                                        <div className="text-center space-y-2 p-4 bg-gray-a2 border border-gray-a3 rounded-xl shadow-sm">
                                            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black text-xl">{data.personalityNumber}</div>
                                            <div className="font-bold text-sm text-gray-12">Personality</div>
                                            <div className="text-xs text-gray-11">Physical Mask</div>
                                        </div>
                                    )}
                                    {data.expressionNumber && (
                                        <div className="text-center space-y-2 p-4 bg-gray-a2 border border-gray-a3 rounded-xl shadow-sm">
                                            <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 flex items-center justify-center font-black text-xl">{data.expressionNumber}</div>
                                            <div className="font-bold text-sm text-gray-12">Expression</div>
                                            <div className="text-xs text-gray-11">Public Mission</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <AIFeatureChat
                                endpoint="/api/explore/all-about-you/interact"
                                payload={{
                                    lifePath: data.lifePath,
                                    archetype: data.archetype,
                                    element: data.element
                                }}
                                placeholder="Ask a question about your composite profile..."
                                buttonText="Ask Matrix Self"
                                isTextarea={true}
                            />
                        </div>
                    ) : null}
                    </div>
                </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 14. Saturn Insights
export function SaturnInsightsDialog({ open, onClose, birthDate }: any) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/explore/saturn-insights', birthDate],
        queryFn: async () => {
            if (!birthDate) return null;
            const res = await fetch(`/api/explore/saturn-insights/${birthDate}`);
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        },
        enabled: open && !!birthDate,
    });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-gray-1 shadow-2xl">
                <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 pb-4 bg-gradient-to-br from-amber-a3 to-transparent border-b border-amber-a4">
                <DialogHeader className="p-0 space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-gray-12">
                        <div className="p-2 bg-amber-9 rounded-lg text-white shadow-lg shadow-amber-9/20">
                        <CircleDashed className="w-6 h-6" />
                        </div>
                        Saturn Insights
                    </DialogTitle>
                    <DialogDescription className="text-gray-11 font-medium ml-12">Lessons and karmic cycles of your Saturn return</DialogDescription>
                </DialogHeader>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                    {isLoading ? <LoadingSkeleton /> : error ? <ErrorMessage text="Failed to load saturn insights" /> : data ? (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6 p-6 bg-gradient-to-br from-gray-a2 to-transparent rounded-xl border-2 border-gray-a3 shadow-sm">
                                <div className="shrink-0 flex flex-col items-center justify-center space-y-3">
                                    <div className="w-24 h-24 rounded-full border-4 border-amber-9 border-dashed flex items-center justify-center bg-gray-a2 shadow-inner relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-5xl font-serif text-amber-9 relative z-10 group-hover:scale-110 transition-transform duration-500">♄</span>
                                    </div>
                                    <Badge variant={data.state === 'Active' ? 'default' : 'outline'} className={data.state === 'Active' ? 'bg-amber-600' : ''}>
                                        {data.state} Saturn Return
                                    </Badge>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="text-2xl font-black mb-3 tracking-tighter text-gray-12">{data.headline}</div>
                                    <p className="text-sm text-gray-11 leading-relaxed">{data.overview}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-5 bg-gradient-to-br from-red-a2 to-transparent dark:from-red-950/20 border border-red-a3 dark:border-red-900/30 rounded-xl relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-3 opacity-10"><AlertTriangle className="w-16 h-16"/></div>
                                    <h4 className="font-bold text-red-800 dark:text-red-400 mb-3 flex items-center gap-2 relative z-10"><Swords className="w-4 h-4"/> The Lesson</h4>
                                    <p className="text-sm text-red-900/80 dark:text-red-300/80 leading-relaxed relative z-10">{data.lesson}</p>
                                </div>
                                <div className="p-5 bg-gradient-to-br from-green-a2 to-transparent dark:from-green-950/20 border border-green-a3 dark:border-green-900/30 rounded-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-10"><Trophy className="w-16 h-16"/></div>
                                    <h4 className="font-bold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2 relative z-10"><Medal className="w-4 h-4"/> The Reward</h4>
                                    <p className="text-sm text-green-900/80 dark:text-green-300/80 leading-relaxed relative z-10">{data.reward}</p>
                                </div>
                            </div>

                            {data.timeline && data.timeline.length > 0 && (
                                <div className="p-5 bg-gray-a1 border border-gray-a3 rounded-xl shadow-sm">
                                    <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-12 border-b pb-2">
                                        <History className="w-4 h-4 text-amber-500" /> Karmic Timeline
                                    </h4>
                                    <div className="relative space-y-3 ml-2">
                                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-800 z-0 hidden sm:block" />
                                        {data.timeline.map((event: any, i: number) => {
                                            const isDone = event.status === 'completed';
                                            const isActive = event.status === 'active';
                                            const Icon = isDone ? CheckCircle2 : (isActive ? CircleDot : CircleDashed);
                                            const colorClass = isActive ? 'text-amber-500' : (isDone ? 'text-green-500' : 'text-gray-400');
                                            
                                            return (
                                                <div key={i} className="relative z-10 flex gap-4 items-center group">
                                                    <div className={`w-8 h-8 rounded-full bg-gray-a2 flex items-center justify-center shrink-0 ${colorClass}`}>
                                                        <Icon className="w-5 h-5 bg-gray-a2" />
                                                    </div>
                                                    <div className={`flex-1 p-3 rounded-lg border transition-colors ${isActive ? 'bg-amber-a2 border-amber-200 dark:border-amber-900/30 shadow-sm' : 'bg-transparent border-transparent group-hover:bg-gray-a2'}`}>
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                                            <div className={`font-bold text-sm ${isActive ? 'text-amber-900 dark:text-amber-100' : 'text-gray-12'}`}>{event.event}</div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-xs font-bold bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-12">{event.year}</span>
                                                                <span className="text-[10px] uppercase font-bold text-gray-500">{event.age} yrs</span>
                                                            </div>
                                                        </div>
                                                        <div className={`text-xs ${isActive ? 'text-amber-800/80 dark:text-amber-200/80' : 'text-gray-11'}`}>{event.description}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <AIFeatureChat
                                endpoint="/api/explore/saturn-insights/interact"
                                payload={{
                                    birthDate: birthDate,
                                    state: data.state
                                }}
                                placeholder="Ask a question about your current Saturn cycle..."
                                buttonText="Decode Karmic Lesson"
                                isTextarea={true}
                            />
                        </div>
                    ) : null}
                    </div>
                </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
