"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navigation from "@/components/Navigation"
import { ArrowLeft, Play, CheckCircle2, Lock, Clock, Users, Star, BookOpen, Award } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const courseData: { [key: string]: any } = {
  "spanish-beginners": {
    title: "Spanish for Beginners",
    description: "Master the basics of Spanish with interactive lessons and real-world conversations",
    level: "Beginner",
    duration: "8 weeks",
    students: "120K",
    rating: 4.8,
    totalLessons: 45,
    completedLessons: 12,
    flag: "🇪🇸",
    instructor: "Maria Rodriguez",
    instructorBio: "Native Spanish speaker with 10+ years of teaching experience",
    modules: [
      {
        id: 1,
        title: "Introduction to Spanish",
        lessons: [
          { id: 1, title: "Spanish Alphabet and Pronunciation", duration: "15 min", completed: true },
          { id: 2, title: "Basic Greetings and Introductions", duration: "20 min", completed: true },
          { id: 3, title: "Numbers 1-100", duration: "18 min", completed: true },
          { id: 4, title: "Days of the Week and Months", duration: "15 min", completed: false }
        ]
      },
      {
        id: 2,
        title: "Essential Grammar",
        lessons: [
          { id: 5, title: "Personal Pronouns", duration: "25 min", completed: false },
          { id: 6, title: "Present Tense - Regular Verbs", duration: "30 min", completed: false },
          { id: 7, title: "Gender and Articles", duration: "20 min", completed: false },
          { id: 8, title: "Question Formation", duration: "22 min", completed: false }
        ]
      },
      {
        id: 3,
        title: "Everyday Conversations",
        lessons: [
          { id: 9, title: "At the Restaurant", duration: "25 min", completed: false },
          { id: 10, title: "Shopping and Prices", duration: "20 min", completed: false },
          { id: 11, title: "Asking for Directions", duration: "18 min", completed: false },
          { id: 12, title: "Making Plans with Friends", duration: "22 min", completed: false }
        ]
      }
    ]
  },
  "french-basics": {
    title: "French Basics",
    description: "Learn essential French phrases and grammar for everyday conversations",
    level: "Beginner",
    duration: "6 weeks",
    students: "95K",
    rating: 4.7,
    totalLessons: 38,
    completedLessons: 8,
    flag: "🇫🇷",
    instructor: "Pierre Dubois",
    instructorBio: "Parisian native and certified French language instructor",
    modules: [
      {
        id: 1,
        title: "French Fundamentals",
        lessons: [
          { id: 1, title: "French Pronunciation Guide", duration: "18 min", completed: true },
          { id: 2, title: "Essential Greetings", duration: "15 min", completed: true },
          { id: 3, title: "Numbers and Counting", duration: "20 min", completed: false }
        ]
      }
    ]
  },
  "japanese-hiragana": {
    title: "Japanese Hiragana",
    description: "Master Japanese writing system and basic conversational skills",
    level: "Beginner",
    duration: "10 weeks",
    students: "80K",
    rating: 4.9,
    totalLessons: 52,
    completedLessons: 5,
    flag: "🇯🇵",
    instructor: "Yuki Tanaka",
    instructorBio: "Tokyo native with expertise in teaching Japanese to foreigners",
    modules: [
      {
        id: 1,
        title: "Hiragana Basics",
        lessons: [
          { id: 1, title: "Introduction to Hiragana", duration: "15 min", completed: true },
          { id: 2, title: "Vowels: あ、い、う、え、お", duration: "20 min", completed: true },
          { id: 3, title: "K-row: か、き、く、け、こ", duration: "20 min", completed: false }
        ]
      }
    ]
  }
}

export default function CoursePage() {
  const params = useParams()
  const courseId = params.courseId as string
  const course = courseData[courseId]
  const [activeLesson, setActiveLesson] = useState(1)

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

  const progress = (course.completedLessons / course.totalLessons) * 100

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
                        <p className="font-medium">{course.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Lessons</p>
                        <p className="font-medium">{course.totalLessons}</p>
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
                        <p className="font-medium">{course.rating}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Your Progress</span>
                      <span className="font-medium">{course.completedLessons}/{course.totalLessons} lessons</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instructor Card */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Your Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center text-4xl">
                      👤
                    </div>
                    <h3 className="font-semibold text-lg">{course.instructor}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{course.instructorBio}</p>
                  </div>
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
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>
                    {course.modules.length} modules • {course.totalLessons} lessons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {course.modules.map((module: any) => (
                      <AccordionItem key={module.id} value={`module-${module.id}`}>
                        <AccordionTrigger className="text-lg font-semibold">
                          <div className="flex items-center gap-3">
                            <span>Module {module.id}: {module.title}</span>
                            <Badge variant="secondary">{module.lessons.length} lessons</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pl-4">
                            {module.lessons.map((lesson: any) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                  ) : (
                                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                                  )}
                                  <div>
                                    <p className="font-medium">{lesson.title}</p>
                                    <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                                  </div>
                                </div>
                                {lesson.completed ? (
                                  <Button size="sm" variant="outline">Review</Button>
                                ) : (
                                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                                    <Play className="h-3 w-3 mr-1" />
                                    Start
                                  </Button>
                                )}
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
                  <CardTitle>What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Speaking Skills</h4>
                        <p className="text-sm text-muted-foreground">Practice pronunciation and conversation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Grammar Fundamentals</h4>
                        <p className="text-sm text-muted-foreground">Master essential grammar rules</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Vocabulary Building</h4>
                        <p className="text-sm text-muted-foreground">Learn 500+ common words and phrases</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Cultural Insights</h4>
                        <p className="text-sm text-muted-foreground">Understand culture and customs</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-3">Course Requirements</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• No prior knowledge required</li>
                      <li>• Commitment to practice 15-30 minutes daily</li>
                      <li>• Access to computer or mobile device</li>
                      <li>• Enthusiasm to learn!</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                  <CardDescription>See what other students are saying</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                          👤
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">Sarah Johnson</h4>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">2 weeks ago</p>
                          <p>Excellent course! The lessons are well-structured and easy to follow. I'm already having basic conversations in Spanish!</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-b pb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-xl">
                          👤
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">Mike Chen</h4>
                            <div className="flex">
                              {[1, 2, 3, 4].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                              <Star className="h-4 w-4 text-yellow-400" />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">1 month ago</p>
                          <p>Great content and interactive exercises. Would love to see more video content though.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                          👤
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">Emma Rodriguez</h4>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">3 months ago</p>
                          <p>Best language learning platform I've used! The AI practice feature is incredibly helpful.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}