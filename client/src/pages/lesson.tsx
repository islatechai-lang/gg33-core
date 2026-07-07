import { useParams, Link, useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { StarField } from '@/components/StarField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { getCourseById, getLessonById } from '@/lib/courses-data';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWhopContext } from '@/context/WhopContext';

export default function Lesson() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [, setLocation] = useLocation();
  const course = getCourseById(courseId || '');
  const lesson = getLessonById(courseId || '', lessonId || '');
  const { basePath } = useWhopContext();

  const { data: progress, refetch: refetchProgress } = useQuery<{ lessonId: string; completed: boolean }[]>({
    queryKey: ['/api/progress', courseId],
  });

  const markCompleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/progress/complete', {
        courseId,
        lessonId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress', courseId] });
    }
  });

  const isCompleted = progress?.some(p => p.lessonId === lessonId && p.completed) || false;

  const currentIndex = course?.lessons.findIndex(l => l.id === lessonId) ?? -1;
  const prevLesson = currentIndex > 0 ? course?.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < (course?.lessons.length || 0) - 1 ? course?.lessons[currentIndex + 1] : null;

  const handleComplete = async () => {
    await markCompleteMutation.mutateAsync();
    window.scrollTo(0, 0);
    if (nextLesson) {
      setLocation(`${basePath}/learn/${courseId}/${nextLesson.id}`);
    } else {
      setLocation(`${basePath}/course/${courseId}`);
    }
  };

  if (!course || !lesson) {
    return (
      <>
        <StarField />
        <Navigation />
        <main className="pt-20 pb-12 px-4 min-h-screen" data-testid="page-lesson-not-found">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-6 font-semibold mb-4">Lesson Not Found</h1>
            <p className="text-gray-11 mb-6">The lesson you're looking for doesn't exist.</p>
            <Link href={`${basePath}/learn`}>
              <Button variant="gold" data-testid="button-back-to-courses">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  const formatContent = (content: string) => {
    const processInline = (text: string): string => {
      return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>');
    };

    const blocks = content.split('\n\n');
    const elements: React.ReactNode[] = [];
    let keyCounter = 0;

    for (const block of blocks) {
      const lines = block.split('\n');
      let lineIdx = 0;

      while (lineIdx < lines.length) {
        const trimmed = lines[lineIdx].trim();

        if (!trimmed) {
          lineIdx++;
          continue;
        }

        // Standalone section heading: **Something:** on its own line (no trailing content)
        if (/^\*\*[^*]+:\*\*$/.test(trimmed)) {
          const headingText = trimmed.replace(/\*\*/g, '');
          elements.push(
            <h3 key={keyCounter++} className="text-3 font-semibold text-amber-9 mb-2">{headingText}</h3>
          );
          lineIdx++;
          continue;
        }

        // Bullet list: collect consecutive lines starting with -
        if (trimmed.startsWith('- ')) {
          const items: string[] = [];
          while (lineIdx < lines.length && lines[lineIdx].trim().startsWith('- ')) {
            items.push(lines[lineIdx].trim().substring(2));
            lineIdx++;
          }
          elements.push(
            <ul key={keyCounter++} className="list-disc list-inside space-y-1 mb-4 text-gray-11">
              {items.map((item, j) => (
                <li key={j} dangerouslySetInnerHTML={{ __html: processInline(item) }} />
              ))}
            </ul>
          );
          continue;
        }

        // Numbered list: collect consecutive lines starting with digits
        if (/^\d+[\.\)]/.test(trimmed)) {
          const items: string[] = [];
          while (lineIdx < lines.length && /^\d+[\.\)]/.test(lines[lineIdx].trim())) {
            items.push(lines[lineIdx].trim().replace(/^\d+[\.\)]\s*/, ''));
            lineIdx++;
          }
          elements.push(
            <ol key={keyCounter++} className="list-decimal list-inside space-y-1 mb-4 text-gray-11">
              {items.map((item, j) => (
                <li key={j} dangerouslySetInnerHTML={{ __html: processInline(item) }} />
              ))}
            </ol>
          );
          continue;
        }

        // Regular text line with inline bold formatting
        elements.push(
          <p
            key={keyCounter++}
            className="text-gray-11 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: processInline(trimmed) }}
          />
        );
        lineIdx++;
      }
    }

    return elements;
  };

  return (
    <>
      <StarField />
      <Navigation />

      <main className="pt-20 pb-12 px-4 min-h-screen" data-testid="page-lesson">
        <div className="container mx-auto max-w-3xl space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Link href={`${basePath}/course/${courseId}`}>
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {course.title}
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-2 text-gray-11">
              <BookOpen className="w-4 h-4" />
              Lesson {currentIndex + 1} of {course.lessons.length}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="frosted">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="outline" size="sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {lesson.duration}
                  </Badge>
                  {isCompleted && (
                    <Badge color="green" variant="outline" size="sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-5">{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-invert max-w-none">
                  {formatContent(lesson.content)}
                </div>

                {lesson.keyPoints.length > 0 && (
                  <Card variant="glass" className="bg-amber-a2 border-amber-6">
                    <CardContent className="py-4">
                      <h4 className="text-3 font-semibold text-amber-9 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Key Takeaways
                      </h4>
                      <ul className="space-y-2">
                        {lesson.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-2 text-gray-11">
                            <span className="text-amber-9 mt-1">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex items-center justify-between gap-4">
            {prevLesson ? (
              <Link href={`${basePath}/learn/${courseId}/${prevLesson.id}`} onClick={() => window.scrollTo(0, 0)}>
                <Button variant="outline" data-testid="button-prev-lesson">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Button
                variant="gold"
                onClick={handleComplete}
                disabled={markCompleteMutation.isPending}
                data-testid="button-next-lesson"
              >
                {markCompleteMutation.isPending ? 'Saving...' : 'Complete & Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="gold"
                onClick={handleComplete}
                disabled={markCompleteMutation.isPending}
                data-testid="button-finish-course"
              >
                {markCompleteMutation.isPending ? 'Saving...' : 'Complete Course'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
