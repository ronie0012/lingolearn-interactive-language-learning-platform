"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/Navigation"
import { Search, Clock, Users, Star, BookOpen } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Course = {
  id: string
  languageCode: string
  title: string
  description: string
  level: string
  category: string
  flag?: string
  duration?: string
  students: number
  ratingTenths: number
  totalLessons: number
}

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [items, setItems] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCourses = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set("search", searchQuery)
      if (levelFilter !== "all") params.set("level", levelFilter)
      if (categoryFilter !== "all") params.set("category", categoryFilter)
      params.set("limit", "60")
      const res = await fetch(`/api/courses?${params.toString()}`, { cache: "no-store" })
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error("Failed to load courses", e)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Real-time updates via SSE: refetch on updates
  useEffect(() => {
    const es = new EventSource("/api/courses/stream")
    es.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        if (msg?.type === 'update') {
          fetchCourses()
        }
      } catch {}
    }
    es.onerror = () => {
      es.close()
    }
    return () => es.close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, levelFilter, categoryFilter])

  useEffect(() => {
    // Refetch when filters change
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, levelFilter, categoryFilter])

  const filteredCourses = useMemo(() => {
    // Server already filters; this is mainly for client-only filtering if needed
    return items
  }, [items])

  const formatStudents = (n: number) => {
    if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n/1000).toFixed(0)}K`
    return String(n)
  }

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
            {loading ? 'Loading courses...' : (
              <>Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}</>
            )}
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
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{formatStudents(course.students)} students</span>
                      <span className="mx-2">•</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{(course.ratingTenths / 10).toFixed(1)}</span>
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

          {!loading && filteredCourses.length === 0 && (
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
