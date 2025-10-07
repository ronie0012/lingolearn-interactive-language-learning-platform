"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/Navigation"
import { useSession, authClient } from "@/lib/auth-client"
import { Mail, Calendar, Award, BookOpen, MessageCircle, TrendingUp, Loader2, LogOut, ArrowLeft } from "lucide-react"

export default function ProfilePage() {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Profile Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left flex-1">
                  <CardTitle className="text-3xl mb-2">{session.user.name}</CardTitle>
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{session.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {session.user.createdAt ? formatDate(session.user.createdAt) : "Recently"}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Active Courses</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">3</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-secondary mb-2" />
                <CardTitle>Learning Streak</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">7 Days</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Achievements</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">12</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Learning Progress */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Your language learning achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-xl">🇪🇸</span>
                    </div>
                    <div>
                      <p className="font-medium">Spanish</p>
                      <p className="text-sm text-muted-foreground">Intermediate</p>
                    </div>
                  </div>
                  <Badge className="bg-primary">65% Complete</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <span className="text-xl">🇫🇷</span>
                    </div>
                    <div>
                      <p className="font-medium">French</p>
                      <p className="text-sm text-muted-foreground">Beginner</p>
                    </div>
                  </div>
                  <Badge className="bg-secondary">40% Complete</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-xl">🇯🇵</span>
                    </div>
                    <div>
                      <p className="font-medium">Japanese</p>
                      <p className="text-sm text-muted-foreground">Beginner</p>
                    </div>
                  </div>
                  <Badge>25% Complete</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Your latest milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">7-Day Streak</p>
                    <p className="text-sm text-muted-foreground">Completed lessons for 7 days in a row</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Conversation Master</p>
                    <p className="text-sm text-muted-foreground">Completed 10 AI practice sessions</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Quick Learner</p>
                    <p className="text-sm text-muted-foreground">Completed first course module</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}