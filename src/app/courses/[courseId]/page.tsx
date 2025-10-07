"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navigation from "@/components/Navigation"
import { ArrowLeft, Play, CheckCircle2, Clock, Users, Star, BookOpen } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { authClient } from "@/lib/auth-client"

type Lesson = { id: number; title: string; duration?: string; lessonType?: string }
type Module = { id: number; index: number; title: string; description?: string; lessons: Lesson[] }
type Course = {
  id: string;
  languageCode: string;
  title: string;
  description: string;
  level: string;
  category: string;
  flag?: string;
  duration?: string;
  students: number;
  ratingTenths: number;
  totalLessons: number;
}

export default function CoursePage() {
  const params = useParams()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [vocabulary, setVocabulary] = useState<any[]>([])
  const [grammar, setGrammar] = useState<any[]>([])
  const [culture, setCulture] = useState<any[]>([])
  const [quiz, setQuiz] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [userProgress, setUserProgress] = useState<any>(null)

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load course")
      const data = await res.json()
      setCourse(data.course)
      setModules(data.modules)
      setVocabulary(data.vocabulary)
      setGrammar(data.grammar)
      setCulture(data.culture)
      setQuiz(data.quiz)
    } catch (e) {
      console.error(e)
      setCourse(null)
      setModules([])
      setVocabulary([])
      setGrammar([])
      setCulture([])
      setQuiz([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // session for user progress
    const loadSession = async () => {
      const session = await authClient.getSession()
      if (session?.user?.id) setUserId(session.user.id)
    }
    loadSession()
  }, [])

  useEffect(() => {
    if (!courseId) return
    fetchCourse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  // Subscribe to SSE for real-time updates
  useEffect(() => {
    if (!courseId) return
    const es = new EventSource(`/api/courses/${courseId}/stream`)
    es.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        if (msg?.type === 'update') {
          fetchCourse()
        }
      } catch {}
    }
    es.onerror = () => es.close()
    return () => es.close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  // Load user progress for this language (fallback to language-level progress)
  useEffect(() => {
    const loadProgress = async () => {
      if (!userId || !course?.languageCode) return
      try {
        const res = await fetch(`/api/user-progress?userId=${userId}&languageCode=${course.languageCode}`)
        if (res.ok) {
          const data = await res.json()
          setUserProgress(data)
        }
      } catch (e) {
        console.error("Failed to load user progress", e)
      }
    }
    loadProgress()
  }, [userId, course?.languageCode])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course not found</h1>
            <Link href="/courses">
              <Button>Back to Courses</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const lessonsCompleted = userProgress?.lessonsCompleted ?? 0
  const totalLessons = course.totalLessons ?? modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
  const progressPct = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/courses">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>

          {/* Course Header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-6xl">{course.flag}</div>
                    <Badge>{course.level}</Badge>
                  </div>
                  <CardTitle className="text-3xl mb-3">{course.title}</CardTitle>
                  <CardDescription className="text-lg">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{course.duration || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Lessons</p>
                        <p className="font-medium">{totalLessons}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Students</p>
                        <p className="font-medium">{course.students}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="font-medium">{(course.ratingTenths / 10).toFixed(1)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Your Progress</span>
                      <span className="font-medium">{lessonsCompleted}/{totalLessons} lessons</span>
                    </div>
                    <Progress value={progressPct} className="h-3" />
                    <p className="text-sm text-muted-foreground">{progressPct}% complete</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions Card */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Ready?</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Course Content */}
          <Tabs defaultValue="curriculum" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>
                    {modules.length} modules • {totalLessons} lessons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {modules.map((module: Module) => (
                      <AccordionItem key={module.id} value={`module-${module.id}`}>
                        <AccordionTrigger className="text-lg font-semibold">
                          <div className="flex items-center gap-3">
                            <span>Module {module.index + 1}: {module.title}</span>
                            <Badge variant="secondary">{module.lessons.length} lessons</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pl-4">
                            {module.lessons.map((lesson: Lesson) => (
                              <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                                <div>
                                  <p className="font-medium">{lesson.title}</p>
                                  <p className="text-sm text-muted-foreground">{lesson.duration || '—'}</p>
                                </div>
                                <Button size="sm" className="bg-primary hover:bg-primary/90">
                                  <Play className="h-3 w-3 mr-1" />
                                  Start
                                </Button>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Resources & What You'll Learn</CardTitle>
                  <CardDescription>Vocabulary, grammar topics, and cultural content curated for this course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Vocabulary</h4>
                      {vocabulary.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No vocabulary yet.</p>
                      ) : (
                        <ul className="text-sm space-y-1 max-h-48 overflow-y-auto pr-2">
                          {vocabulary.slice(0, 20).map((v, i) => (
                            <li key={i}>
                              <span className="font-medium">{v.word}</span> — <span className="text-muted-foreground">{v.translation}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Grammar</h4>
                      {grammar.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No grammar lessons yet.</p>
                      ) : (
                        <ul className="text-sm space-y-2 max-h-48 overflow-y-auto pr-2">
                          {grammar.slice(0, 10).map((g, i) => (
                            <li key={i}>
                              <span className="font-medium">{g.title}</span>
                              <p className="text-muted-foreground line-clamp-2">{g.content}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Cultural Content</h4>
                      {culture.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No cultural items yet.</p>
                      ) : (
                        <ul className="text-sm space-y-1 max-h-48 overflow-y-auto pr-2">
                          {culture.slice(0, 10).map((c, i) => (
                            <li key={i}>
                              <a href={c.url || '#'} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {c.title}
                              </a>
                              {c.description ? (
                                <p className="text-muted-foreground line-clamp-2">{c.description}</p>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quiz">
              <Card>
                <CardHeader>
                  <CardTitle>Practice Quiz</CardTitle>
                  <CardDescription>Sample questions from this course</CardDescription>
                </CardHeader>
                <CardContent>
                  {quiz.length === 0 ? (
                    <p className="text-muted-foreground">No quiz questions yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {quiz.slice(0, 5).map((q, i) => (
                        <div key={i} className="border rounded-lg p-4">
                          <p className="font-medium mb-2">{q.question}</p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(q.options || []).map((opt: string, idx: number) => (
                              <li key={idx} className="text-sm">
                                • {opt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
