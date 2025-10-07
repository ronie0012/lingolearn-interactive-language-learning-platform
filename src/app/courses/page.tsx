"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/Navigation"
import { Search, Filter, Clock, Users, Star, BookOpen } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const courses = [
  {
    id: "spanish-beginners",
    title: "Spanish for Beginners",
    description: "Master the basics of Spanish with interactive lessons and real-world conversations",
    level: "Beginner",
    duration: "8 weeks",
    students: "120K",
    rating: 4.8,
    lessons: 45,
    flag: "🇪🇸",
    category: "Romance Languages"
  },
  {
    id: "french-basics",
    title: "French Basics",
    description: "Learn essential French phrases and grammar for everyday conversations",
    level: "Beginner",
    duration: "6 weeks",
    students: "95K",
    rating: 4.7,
    lessons: 38,
    flag: "🇫🇷",
    category: "Romance Languages"
  },
  {
    id: "japanese-hiragana",
    title: "Japanese Hiragana",
    description: "Master Japanese writing system and basic conversational skills",
    level: "Beginner",
    duration: "10 weeks",
    students: "80K",
    rating: 4.9,
    lessons: 52,
    flag: "🇯🇵",
    category: "East Asian Languages"
  },
  {
    id: "german-intermediate",
    title: "German Intermediate",
    description: "Advance your German skills with complex grammar and vocabulary",
    level: "Intermediate",
    duration: "12 weeks",
    students: "65K",
    rating: 4.6,
    lessons: 60,
    flag: "🇩🇪",
    category: "Germanic Languages"
  },
  {
    id: "mandarin-beginners",
    title: "Mandarin Chinese",
    description: "Start your journey with the world's most spoken language",
    level: "Beginner",
    duration: "10 weeks",
    students: "110K",
    rating: 4.8,
    lessons: 50,
    flag: "🇨🇳",
    category: "East Asian Languages"
  },
  {
    id: "italian-conversation",
    title: "Italian Conversation",
    description: "Practice Italian through engaging conversations and cultural insights",
    level: "Intermediate",
    duration: "8 weeks",
    students: "55K",
    rating: 4.7,
    lessons: 42,
    flag: "🇮🇹",
    category: "Romance Languages"
  },
  {
    id: "korean-basics",
    title: "Korean for Beginners",
    description: "Learn Korean alphabet, pronunciation, and basic grammar",
    level: "Beginner",
    duration: "8 weeks",
    students: "88K",
    rating: 4.8,
    lessons: 44,
    flag: "🇰🇷",
    category: "East Asian Languages"
  },
  {
    id: "portuguese-brazilian",
    title: "Brazilian Portuguese",
    description: "Discover Brazilian culture while learning Portuguese",
    level: "Beginner",
    duration: "7 weeks",
    students: "45K",
    rating: 4.6,
    lessons: 36,
    flag: "🇧🇷",
    category: "Romance Languages"
  },
  {
    id: "arabic-modern",
    title: "Modern Standard Arabic",
    description: "Learn to read, write, and speak Modern Standard Arabic",
    level: "Beginner",
    duration: "12 weeks",
    students: "38K",
    rating: 4.7,
    lessons: 55,
    flag: "🇸🇦",
    category: "Semitic Languages"
  }
]

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = levelFilter === "all" || course.level === levelFilter
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter
    return matchesSearch && matchesLevel && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Explore Language Courses
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose from over 30 languages and start your journey today
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-lg p-6 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Romance Languages">Romance Languages</SelectItem>
                  <SelectItem value="East Asian Languages">East Asian Languages</SelectItem>
                  <SelectItem value="Germanic Languages">Germanic Languages</SelectItem>
                  <SelectItem value="Semitic Languages">Semitic Languages</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-muted-foreground">
            Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-5xl">{course.flag}</div>
                    <Badge variant={course.level === "Beginner" ? "default" : "secondary"}>
                      {course.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                      <span className="mx-2">•</span>
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{course.students} students</span>
                      <span className="mx-2">•</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <Link href={`/courses/${course.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      View Course
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">No courses found matching your criteria</p>
              <Button onClick={() => {
                setSearchQuery("")
                setLevelFilter("all")
                setCategoryFilter("all")
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}