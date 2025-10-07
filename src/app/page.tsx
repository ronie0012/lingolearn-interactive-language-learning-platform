"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navigation from "@/components/Navigation"
import { Globe, MessageCircle, Users, Award, BookOpen, TrendingUp, ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useSession } from "@/lib/auth-client"

export default function Home() {
  const { data: session, isPending } = useSession()
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 gradient-bg opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Language Learning</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              {session?.user ? (
                <>
                  Welcome back, {session.user.name?.split(' ')[0]}!
                  <br />
                  Continue Your Journey
                </>
              ) : (
                <>
                  Master Any Language
                  <br />
                  at Your Own Pace
                </>
              )}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              {session?.user ? (
                "Pick up where you left off and continue mastering new languages with personalized lessons and AI-powered practice."
              ) : (
                "Join millions of learners worldwide. Practice with AI, connect with native speakers, and achieve fluency faster than ever before."
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isPending ? (
                <div className="flex gap-4">
                  <div className="h-14 w-48 animate-pulse bg-muted rounded-lg" />
                  <div className="h-14 w-32 animate-pulse bg-muted rounded-lg" />
                </div>
              ) : session?.user ? (
                // Authenticated user buttons
                <>
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto group">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/courses">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                      Browse Courses
                    </Button>
                  </Link>
                </>
              ) : (
                // Guest user buttons
                <>
                  <Link href="/signup">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto group">
                      Start Learning Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Floating Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            <Card className="p-6 glass-effect hover:scale-105 transition-transform duration-300">
              <Globe className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">30+ Languages</h3>
              <p className="text-muted-foreground">From Spanish to Mandarin, learn any language you desire</p>
            </Card>
            
            <Card className="p-6 glass-effect hover:scale-105 transition-transform duration-300">
              <MessageCircle className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Conversation</h3>
              <p className="text-muted-foreground">Practice speaking with our advanced AI chatbot</p>
            </Card>
            
            <Card className="p-6 glass-effect hover:scale-105 transition-transform duration-300">
              <Users className="h-12 w-12 text-accent-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Community</h3>
              <p className="text-muted-foreground">Connect with native speakers worldwide</p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose LingoLearn?</h2>
            <p className="text-xl text-muted-foreground">Everything you need to become fluent</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-card rounded-xl shadow-lg"
            >
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Interactive Lessons</h3>
              <p className="text-muted-foreground">
                Engaging, bite-sized lessons that fit into your busy schedule
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-card rounded-xl shadow-lg"
            >
              <TrendingUp className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your improvement with detailed analytics and insights
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-card rounded-xl shadow-lg"
            >
              <Award className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Earn Certificates</h3>
              <p className="text-muted-foreground">
                Get recognized for your achievements with official certificates
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!session?.user && (
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-10" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join over 10 million learners achieving their language goals
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-12 py-6 h-auto">
                Get Started Now - It's Free
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">LingoLearn</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Making language learning accessible to everyone, everywhere.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
                <li><Link href="/chatbot" className="hover:text-primary transition-colors">AI Practice</Link></li>
                <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 LingoLearn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}