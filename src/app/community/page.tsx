"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Navigation from "@/components/Navigation"
import { Search, MessageCircle, ThumbsUp, Pin, TrendingUp, Users, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ForumPost {
  id: number
  title: string
  author: string
  authorAvatar?: string
  content: string
  category: string
  replies: number
  likes: number
  views: number
  isPinned: boolean
  createdAt: Date
  language: string
}

const forumPosts: ForumPost[] = [
  {
    id: 1,
    title: "Best resources for learning Spanish vocabulary?",
    author: "Maria Garcia",
    content: "I'm looking for recommendations on apps or websites that helped you expand your Spanish vocabulary. What worked best for you?",
    category: "Spanish",
    replies: 24,
    likes: 45,
    views: 320,
    isPinned: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    language: "🇪🇸"
  },
  {
    id: 2,
    title: "French pronunciation tips for beginners",
    author: "John Smith",
    content: "Just started learning French and struggling with pronunciation. Any tips or tricks that helped you?",
    category: "French",
    replies: 18,
    likes: 32,
    views: 256,
    isPinned: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    language: "🇫🇷"
  },
  {
    id: 3,
    title: "Study partners for Japanese N5 prep?",
    author: "Yuki Tanaka",
    content: "Looking for study partners to practice Japanese and prepare for JLPT N5. Anyone interested?",
    category: "Japanese",
    replies: 12,
    likes: 28,
    views: 189,
    isPinned: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    language: "🇯🇵"
  },
  {
    id: 4,
    title: "How long to become conversational?",
    author: "Emma Wilson",
    content: "For those who've reached conversational level in a new language, how long did it take you with consistent practice?",
    category: "General",
    replies: 45,
    likes: 67,
    views: 892,
    isPinned: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    language: "🌍"
  },
  {
    id: 5,
    title: "German grammar - Dative case explained",
    author: "Hans Mueller",
    content: "Can someone help me understand the dative case in German? I keep getting confused with der, dem, den...",
    category: "German",
    replies: 31,
    likes: 52,
    views: 445,
    isPinned: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    language: "🇩🇪"
  },
  {
    id: 6,
    title: "Language learning success stories!",
    author: "Sarah Lee",
    content: "Share your success stories and motivate others! What was your biggest breakthrough moment?",
    category: "General",
    replies: 89,
    likes: 156,
    views: 1240,
    isPinned: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    language: "🌍"
  }
]

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))
    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Community Forum
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with fellow language learners from around the world
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">10K+</p>
                    <p className="text-sm text-muted-foreground">Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-8 w-8 text-secondary" />
                  <div>
                    <p className="text-2xl font-bold">5.2K</p>
                    <p className="text-sm text-muted-foreground">Discussions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <ThumbsUp className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">25K</p>
                    <p className="text-sm text-muted-foreground">Helpful Answers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-secondary" />
                  <div>
                    <p className="text-2xl font-bold">1.2K</p>
                    <p className="text-sm text-muted-foreground">Active Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === "all" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory("all")}
                    >
                      🌍 All Topics
                    </Button>
                    <Button
                      variant={selectedCategory === "Spanish" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory("Spanish")}
                    >
                      🇪🇸 Spanish
                    </Button>
                    <Button
                      variant={selectedCategory === "French" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory("French")}
                    >
                      🇫🇷 French
                    </Button>
                    <Button
                      variant={selectedCategory === "Japanese" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory("Japanese")}
                    >
                      🇯🇵 Japanese
                    </Button>
                    <Button
                      variant={selectedCategory === "German" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory("German")}
                    >
                      🇩🇪 German
                    </Button>
                    <Button
                      variant={selectedCategory === "General" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory("General")}
                    >
                      💬 General
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Be respectful and supportive</li>
                    <li>• Stay on topic</li>
                    <li>• No spam or self-promotion</li>
                    <li>• Help others learn and grow</li>
                    <li>• Have fun!</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and Actions */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search discussions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      New Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Forum Posts */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="all">All Posts</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {post.author.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                {post.isPinned && (
                                  <Pin className="h-4 w-4 text-primary" />
                                )}
                                <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                                  {post.title}
                                </h3>
                              </div>
                              <Badge variant="secondary">{post.language}</Badge>
                            </div>

                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {post.content}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">{post.author}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {getTimeAgo(post.createdAt)}
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {post.replies} replies
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {post.likes}
                              </div>
                              <span>•</span>
                              <span>{post.views} views</span>
                            </div>

                            <div className="flex gap-2 mt-4">
                              <Button variant="outline" size="sm">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Like
                              </Button>
                              <Button variant="outline" size="sm">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="trending">
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Trending Discussions</h3>
                      <p className="text-muted-foreground">
                        See what's popular in the community right now
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="unanswered">
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <MessageCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Help Your Peers</h3>
                      <p className="text-muted-foreground">
                        Answer unanswered questions and earn reputation
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {filteredPosts.length === 0 && (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <p className="text-muted-foreground mb-4">No discussions found</p>
                    <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}