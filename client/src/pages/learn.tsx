import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import { StarField } from '@/components/StarField';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from '@/components/UpgradeModal';
import { BookOpen, Play, Clock, Star, Lock, Sparkles } from 'lucide-react';
import { courses } from '@/lib/courses-data';
import { useWhopContext } from '@/context/WhopContext';

const ODIS_ID_KEY = 'gg33-odis-id';

export default function Learn() {
  const { basePath } = useWhopContext();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const savedOdisId = localStorage.getItem(ODIS_ID_KEY);
  const { data: profileData } = useQuery<{ isPro?: boolean }>({
    queryKey: ['/api/profile', savedOdisId],
    enabled: !!savedOdisId,
  });
  const isPro = profileData?.isPro ?? false;

  return (
    <>
      <StarField />
      <Navigation />

      <main className="pt-20 pb-12 px-4 min-h-screen" data-testid="page-learn">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Study Zone
            </Badge>
            <h1 className="text-6 md:text-7 font-semibold mb-4">
              <span className="gradient-text">Learn</span> the GG33 System
            </h1>
            <p className="text-gray-11 text-3 max-w-2xl mx-auto">
              Master the art of using numerology and astrology for life decisions through our structured courses.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Badge variant="secondary" className="py-1.5">
              <Star className="w-3 h-3 mr-1 text-amber-9" />
              2 Free Courses
            </Badge>
            <Badge variant="secondary" className="py-1.5">
              <Clock className="w-3 h-3 mr-1" />
              3+ Hours Content
            </Badge>
            <Badge variant="secondary" className="py-1.5">
              <BookOpen className="w-3 h-3 mr-1" />
              59 Lessons
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                variant={course.free ? 'frosted' : 'glass'}
                className="relative overflow-hidden flex flex-col"
                data-testid={`card-course-${course.id}`}
              >
                {!course.free && !isPro && (
                  <div className="absolute top-4 right-4">
                    <Lock className="w-4 h-4 text-gray-10" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {course.free ? (
                      <Badge variant="outline" className="bg-green-a2 text-green-11 border-green-a4 px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider">
                        Free
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-a2 text-amber-11 border-amber-a4 px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-4">{course.title}</CardTitle>
                  <CardDescription className="text-2 text-gray-11">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-2 text-gray-11 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.lessons.length} lessons
                    </span>
                  </div>
                  <div className="mt-auto">
                    {course.free || isPro ? (
                      <Link href={`${basePath}/course/${course.id}`}>
                        <Button
                          variant="gold"
                          className="w-full"
                          data-testid={`button-start-course-${course.id}`}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Learning
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowUpgradeModal(true)}
                        data-testid={`button-locked-course-${course.id}`}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock Course
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!isPro && (
            <Card variant="glow" className="text-center">
              <CardContent className="py-12">
                <BookOpen className="w-12 h-12 mx-auto text-amber-9 mb-4" />
                <h3 className="text-4 font-semibold mb-2">
                  Unlock All Courses
                </h3>
                <p className="text-gray-11 text-2 mb-6 max-w-md mx-auto">
                  Upgrade to Pro to access all premium courses and become a GG33 master.
                </p>
                <Button
                  variant="gold"
                  onClick={() => setShowUpgradeModal(true)}
                  data-testid="button-unlock-courses"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
}
