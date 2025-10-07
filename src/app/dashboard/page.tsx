"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Navigation from "@/components/Navigation"
import { useSession, authClient } from "@/lib/auth-client"
import { BookOpen, MessageCircle, Users, Award, TrendingUp, Loader2, LogOut } from "lucide-react"

export default function DashboardPage() {
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [session, isPending, router])

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token")

    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    if (!error) {
      localStorage.removeItem("bearer_token")
      refetch()
      router.push("/")
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user.name}!</h1>
              <p className="text-muted-foreground">Continue your language learning journey</p>
            </div>
            <div className="flex gap-3">
              <Link href="/profile">
                <Button variant="outline">View Profile</Button>
              </Link>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Courses Enrolled</CardDescription>
                <CardTitle className="text-3xl">3</CardTitle>
              </CardHeader>
              <CardContent>
                <BookOpen className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Learning Streak</CardDescription>
                <CardTitle className="text-3xl">7 days</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendingUp className="h-8 w-8 text-secondary" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Completed Lessons</CardDescription>
                <CardTitle className="text-3xl">24</CardTitle>
              </CardHeader>
              <CardContent>
                <Award className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Practice Sessions</CardDescription>
                <CardTitle className="text-3xl">15</CardTitle>
              </CardHeader>
              <CardContent>
                <MessageCircle className="h-8 w-8 text-secondary" />
              </CardContent>
            </Card>
          </div>

          {/* Current Courses */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Spanish for Beginners</CardTitle>
                  <CardDescription>Complete beginner course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <Link href="/courses/spanish-beginners">
                    <Button className="w-full bg-primary hover:bg-primary/90">Continue Learning</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>French Basics</CardTitle>
                  <CardDescription>Essential French phrases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <Link href="/courses/french-basics">
                    <Button className="w-full bg-primary hover:bg-primary/90">Continue Learning</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Japanese Hiragana</CardTitle>
                  <CardDescription>Learn Japanese writing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <Link href="/courses/japanese-hiragana">
                    <Button className="w-full bg-primary hover:bg-primary/90">Continue Learning</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/courses">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <BookOpen className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Browse Courses</CardTitle>
                    <CardDescription>Explore new languages to learn</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/chatbot">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <MessageCircle className="h-10 w-10 text-secondary mb-2" />
                    <CardTitle>AI Practice</CardTitle>
                    <CardDescription>Practice conversation with AI</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/community">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <Users className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Join Community</CardTitle>
                    <CardDescription>Connect with other learners</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}