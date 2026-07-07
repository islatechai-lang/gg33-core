import { useState } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { StarField } from '@/components/StarField';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UpgradeModal } from '@/components/UpgradeModal';
import { BookOpen, Play, Clock, ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import { getCourseById } from '@/lib/courses-data';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useWhopContext } from '@/context/WhopContext';

const ODIS_ID_KEY = 'gg33-odis-id';

export default function Course() {
  const { courseId } = useParams<{ courseId: string }>();
  const [, setLocation] = useLocation();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const course = getCourseById(courseId || '');
  const { basePath } = useWhopContext();

  const savedOdisId = localStorage.getItem(ODIS_ID_KEY);
  const { data: profileData } = useQuery<{ isPro?: boolean }>({
    queryKey: ['/api/profile', savedOdisId],
    enabled: !!savedOdisId,
  });
  const isPro = profileData?.isPro ?? false;

  const { data: progress } = useQuery<{ lessonId: string; completed: boolean }[]>({
    queryKey: ['/api/progress', courseId],
  });

  const completedLessons = progress?.filter(p => p.completed).length || 0;
  const totalLessons = course?.lessons.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  if (!course) {
    return (
      <>
        <StarField />
        <Navigation />
        <main className="pt-20 pb-12 px-4 min-h-screen" data-testid="page-course-not-found">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-6 font-semibold mb-4">Course Not Found</h1>
            <p className="text-gray-11 mb-6">The course you're looking for doesn't exist.</p>
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

  const isLessonCompleted = (lessonId: string) => {
    return progress?.some(p => p.lessonId === lessonId && p.completed) || false;
  };

  const getNextLesson = () => {
    for (const lesson of course.lessons) {
      if (!isLessonCompleted(lesson.id)) {
        return lesson;
      }
    }
    return course.lessons[0];
  };

  const nextLesson = getNextLesson();

  return (
    <>
      <StarField />
      <Navigation />

      <main className="pt-20 pb-12 px-4 min-h-screen" data-testid="page-course">
        <div className="container mx-auto max-w-4xl space-y-6">
          <Link href={`${basePath}/learn`}>
            <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Study Zone
            </Button>
          </Link>

          <Card variant="frosted">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {course.free ? (
                  <Badge color="green" variant="outline" size="sm">
                    Free
                  </Badge>
                ) : (
                  <Badge variant="secondary" size="sm">
                    Premium
                  </Badge>
                )}
                <Badge variant="outline" size="sm">
                  <Clock className="w-3 h-3 mr-1" />
                  {course.duration}
                </Badge>
                <Badge variant="outline" size="sm">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {course.lessons.length} lessons
                </Badge>
              </div>
              <CardTitle className="text-5 md:text-6">{course.title}</CardTitle>
              <CardDescription className="text-3 text-gray-11">{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-2">
                  <span className="text-gray-11">Progress</span>
                  <span className="text-foreground">{completedLessons} of {totalLessons} lessons completed</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {(course.free || isPro) ? (
                <Link href={`${basePath}/learn/${courseId}/${nextLesson.id}`} className="block">
                  <Button variant="gold" className="w-full" data-testid="button-continue-learning">
                    <Play className="w-4 h-4 mr-2" />
                    {completedLessons > 0 ? 'Continue Learning' : 'Start Course'}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowUpgradeModal(true)}
                  data-testid="button-locked"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Unlock with Pro
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h2 className="text-4 font-semibold">Course Lessons</h2>

            {course.lessons.map((lesson, index) => {
              const completed = isLessonCompleted(lesson.id);
              const isLocked = !course.free && !isPro;

              return (
                <Card
                  key={lesson.id}
                  variant="frosted"
                  className={`transition-all ${!isLocked ? 'hover-elevate cursor-pointer' : 'opacity-60'}`}
                  data-testid={`card-lesson-${lesson.id}`}
                >
                  {!isLocked ? (
                    <Link href={`${basePath}/learn/${courseId}/${lesson.id}`}>
                      <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${completed
                              ? 'bg-green-9 text-white'
                              : 'bg-gray-a3 text-foreground'
                            }`}>
                            {completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-3 font-medium">{lesson.title}</h3>
                            <p className="text-2 text-gray-11">{lesson.duration}</p>
                          </div>
                          <Play className="w-4 h-4 text-gray-11" />
                        </div>
                      </CardContent>
                    </Link>
                  ) : (
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-gray-a3 text-gray-10">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-3 font-medium text-gray-10">{lesson.title}</h3>
                          <p className="text-2 text-gray-11">{lesson.duration}</p>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
}
