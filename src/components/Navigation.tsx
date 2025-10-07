"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe, LogOut, User } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient, useSession } from "@/lib/auth-client"
import { UserRole, canAccess } from "@/lib/auth-client-utils"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()
  
  const userRole = session?.user?.role as UserRole | undefined

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()
    if (error?.code) {
      toast.error("Failed to sign out")
    } else {
      localStorage.removeItem("bearer_token")
      refetch()
      router.push("/")
      router.refresh()
      toast.success("Signed out successfully")
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LingoLearn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/learn" className="text-foreground/80 hover:text-primary transition-colors">
              Learn
            </Link>
            <Link href="/courses" className="text-foreground/80 hover:text-primary transition-colors">
              Courses
            </Link>
            {canAccess(userRole, 'AI_CHATBOT') && (
              <Link href="/chatbot" className="text-foreground/80 hover:text-primary transition-colors">
                AI Practice
              </Link>
            )}
            <Link href="/community" className="text-foreground/80 hover:text-primary transition-colors">
              Community
            </Link>
            {canAccess(userRole, 'ANALYTICS') && (
              <Link href="/instructor" className="text-foreground/80 hover:text-primary transition-colors">
                Instructor
              </Link>
            )}
            {canAccess(userRole, 'ADMIN_PANEL') && (
              <Link href="/admin" className="text-foreground/80 hover:text-primary transition-colors">
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isPending ? (
              <div className="h-10 w-20 animate-pulse bg-muted rounded" />
            ) : session?.user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary hover:bg-primary/90">Start Learning</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-foreground/80 hover:bg-accent hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/learn" 
              className="block px-3 py-2 rounded-md text-foreground/80 hover:bg-accent hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Learn
            </Link>
            <Link 
              href="/courses" 
              className="block px-3 py-2 rounded-md text-foreground/80 hover:bg-accent hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Courses
            </Link>
            {canAccess(userRole, 'AI_CHATBOT') && (
              <Link 
                href="/chatbot" 
                className="block px-3 py-2 rounded-md text-foreground/80 hover:bg-accent hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                AI Practice
              </Link>
            )}
            <Link 
              href="/community" 
              className="block px-3 py-2 rounded-md text-foreground/80 hover:bg-accent hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Community
            </Link>
            {canAccess(userRole, 'ANALYTICS') && (
              <Link 
                href="/instructor" 
                className="block px-3 py-2 rounded-md text-foreground/80 hover:bg-accent hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Instructor
              </Link>
            )}
            {canAccess(userRole, 'ADMIN_PANEL') && (
              <Link 
                href="/admin" 
                className="block px-3 py-2 rounded-md text-foreground/80 hover:bg-accent hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            )}
            
            {isPending ? (
              <div className="h-20 animate-pulse bg-muted rounded" />
            ) : session?.user ? (
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user.email}</p>
                </div>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                </Link>
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Profile</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive" 
                  onClick={() => {
                    handleSignOut()
                    setIsOpen(false)
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full">Login</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90">Start Learning</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}