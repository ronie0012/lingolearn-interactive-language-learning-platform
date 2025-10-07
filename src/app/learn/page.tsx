"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Volume2, BookOpen, Newspaper, Calendar, MessageSquare, Trophy, Loader2, Search, ChevronRight, Target, Flame, Award } from "lucide-react"
import { authClient } from "@/lib/auth-client"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  country: string
}

const languages: Language[] = [
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", country: "Spain" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", country: "France" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", country: "Germany" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", country: "Italy" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", country: "Portugal" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", country: "Japan" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", country: "South Korea" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", country: "China" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", country: "Saudi Arabia" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", country: "India" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", country: "Russia" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", country: "Netherlands" },
]

export default function LearnPage() {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])
  const [vocabulary, setVocabulary] = useState<any[]>([])
  const [vocabLoading, setVocabLoading] = useState(false)
  const [vocabSearch, setVocabSearch] = useState("")
  const [grammar, setGrammar] = useState<any[]>([])
  const [grammarLoading, setGrammarLoading] = useState(false)
  const [news, setNews] = useState<any[]>([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [culture, setCulture] = useState<any>(null)
  const [cultureLoading, setCultureLoading] = useState(false)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [progressLoading, setProgressLoading] = useState(false)
  const [quiz, setQuiz] = useState<any[]>([])
  const [quizLoading, setQuizLoading] = useState(false)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Get user session
  useEffect(() => {
    const checkSession = async () => {
      const session = await authClient.getSession()
      if (session?.user?.id) {
        setUserId(session.user.id)
      }
    }
    checkSession()
  }, [])

  // Fetch all data when language changes
  useEffect(() => {
    fetchVocabulary()
    fetchGrammar()
    fetchNews()
    fetchCulture()
    fetchQuiz()
    if (userId) {
      fetchUserProgress()
    }
    // Reset chat when language changes
    setChatMessages([{
      role: "assistant",
      content: `Hello! I'm your ${selectedLanguage.name} practice assistant. Type sentences in ${selectedLanguage.name} and I'll help you practice!`
    }])
  }, [selectedLanguage, userId])

  // Fetch vocabulary from MyMemory API
  const fetchVocabulary = async () => {
    setVocabLoading(true)
    try {
      const commonWords = ["hello", "goodbye", "thank you", "please", "yes", "no", "food", "water", "house", "friend"]
      const promises = commonWords.map(async (word) => {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${word}&langpair=en|${selectedLanguage.code}`
        )
        const data = await response.json()
        return {
          english: word,
          translation: data.responseData?.translatedText || "N/A",
          languageCode: selectedLanguage.code
        }
      })
      const results = await Promise.all(promises)
      setVocabulary(results)
    } catch (error) {
      console.error("Error fetching vocabulary:", error)
      setVocabulary([])
    } finally {
      setVocabLoading(false)
    }
  }

  // Search vocabulary
  const searchVocabulary = async () => {
    if (!vocabSearch.trim()) return
    setVocabLoading(true)
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${vocabSearch}&langpair=en|${selectedLanguage.code}`
      )
      const data = await response.json()
      setVocabulary([{
        english: vocabSearch,
        translation: data.responseData?.translatedText || "Translation not found",
        languageCode: selectedLanguage.code
      }])
    } catch (error) {
      console.error("Error searching vocabulary:", error)
    } finally {
      setVocabLoading(false)
    }
  }

  // Text-to-Speech using Web Speech API
  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage.code
      window.speechSynthesis.speak(utterance)
    }
  }

  // Fetch grammar tips from Wikipedia
  const fetchGrammar = async () => {
    setGrammarLoading(true)
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${selectedLanguage.name}_grammar`
      )
      const data = await response.json()
      
      if (data.extract) {
        setGrammar([{
          title: `${selectedLanguage.name} Grammar Basics`,
          content: data.extract,
          example: `Learning ${selectedLanguage.name} grammar helps you construct proper sentences.`
        }])
      } else {
        setGrammar([{
          title: `${selectedLanguage.name} Grammar Tips`,
          content: `Start with basic sentence structure in ${selectedLanguage.name}. Practice regularly to improve your grammar skills.`,
          example: "Daily practice is key to mastering any language."
        }])
      }
    } catch (error) {
      console.error("Error fetching grammar:", error)
      setGrammar([{
        title: `${selectedLanguage.name} Grammar Tips`,
        content: `Start with basic sentence structure in ${selectedLanguage.name}. Practice regularly to improve your grammar skills.`,
        example: "Daily practice is key to mastering any language."
      }])
    } finally {
      setGrammarLoading(false)
    }
  }

  // Fetch news using GNews API (free tier)
  const fetchNews = async () => {
    setNewsLoading(true)
    try {
      // Using a fallback with Wikipedia current events for the country
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${selectedLanguage.country}`
      )
      const data = await response.json()
      
      setNews([{
        title: `${selectedLanguage.country} - Current Information`,
        description: data.extract || `Learn more about ${selectedLanguage.country} and ${selectedLanguage.name} language.`,
        source: "Wikipedia",
        publishedAt: new Date().toISOString(),
        url: data.content_urls?.desktop?.page || "#"
      }])
    } catch (error) {
      console.error("Error fetching news:", error)
      setNews([{
        title: `${selectedLanguage.country} Updates`,
        description: `Stay informed about ${selectedLanguage.country} and practice your ${selectedLanguage.name} skills with real-world content.`,
        source: "Language Learning",
        publishedAt: new Date().toISOString(),
        url: "#"
      }])
    } finally {
      setNewsLoading(false)
    }
  }

  // Fetch cultural insights from Wikipedia
  const fetchCulture = async () => {
    setCultureLoading(true)
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/Culture_of_${selectedLanguage.country.replace(' ', '_')}`
      )
      const data = await response.json()
      
      setCulture({
        title: `Culture of ${selectedLanguage.country}`,
        description: data.extract || `Explore the rich cultural heritage of ${selectedLanguage.country}.`,
        facts: [
          `${selectedLanguage.name} is spoken by millions worldwide.`,
          `${selectedLanguage.country} has a rich cultural history.`,
          "Learning the language opens doors to understanding the culture.",
          "Practice with native speakers to improve fluency."
        ]
      })
    } catch (error) {
      console.error("Error fetching culture:", error)
      setCulture({
        title: `Culture of ${selectedLanguage.country}`,
        description: `Explore the rich cultural heritage of ${selectedLanguage.country}.`,
        facts: [
          `${selectedLanguage.name} is spoken by millions worldwide.`,
          `${selectedLanguage.country} has a rich cultural history.`,
          "Learning the language opens doors to understanding the culture.",
          "Practice with native speakers to improve fluency."
        ]
      })
    } finally {
      setCultureLoading(false)
    }
  }

  // Fetch user progress
  const fetchUserProgress = async () => {
    if (!userId) return
    setProgressLoading(true)
    try {
      const response = await fetch(`/api/user-progress?userId=${userId}&languageCode=${selectedLanguage.code}`)
      if (response.ok) {
        const data = await response.json()
        setUserProgress(data)
      } else {
        // Create initial progress if not found
        const createResponse = await fetch('/api/user-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            languageCode: selectedLanguage.code,
            wordsLearned: 0,
            lessonsCompleted: 0,
            quizzesPassed: 0,
            currentStreak: 0
          })
        })
        if (createResponse.ok) {
          const data = await createResponse.json()
          setUserProgress(data)
        }
      }
    } catch (error) {
      console.error("Error fetching user progress:", error)
    } finally {
      setProgressLoading(false)
    }
  }

  // Generate dynamic quiz
  const fetchQuiz = async () => {
    setQuizLoading(true)
    try {
      // Generate simple vocabulary quiz using translations
      const quizWords = ["hello", "goodbye", "thank you", "water", "food"]
      const promises = quizWords.map(async (word) => {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${word}&langpair=en|${selectedLanguage.code}`
        )
        const data = await response.json()
        const correctAnswer = data.responseData?.translatedText || ""
        
        // Generate fake options
        const options = [correctAnswer, "Option A", "Option B", "Option C"].sort(() => Math.random() - 0.5)
        
        return {
          question: `How do you say "${word}" in ${selectedLanguage.name}?`,
          options,
          correctAnswer,
          type: "vocabulary"
        }
      })
      
      const quizData = await Promise.all(promises)
      setQuiz(quizData)
      setCurrentQuizIndex(0)
      setQuizScore(0)
      setQuizAnswered(false)
    } catch (error) {
      console.error("Error generating quiz:", error)
      setQuiz([])
    } finally {
      setQuizLoading(false)
    }
  }

  // Handle quiz answer
  const handleQuizAnswer = async (answer: string) => {
    if (quizAnswered) return
    
    const currentQuestion = quiz[currentQuizIndex]
    const isCorrect = answer === currentQuestion.correctAnswer
    
    if (isCorrect) {
      setQuizScore(quizScore + 1)
    }
    
    setQuizAnswered(true)
    
    // Save quiz result if user is logged in
    if (userId && currentQuizIndex === quiz.length - 1) {
      try {
        await fetch('/api/quiz-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            languageCode: selectedLanguage.code,
            quizType: "vocabulary",
            score: quizScore + (isCorrect ? 1 : 0),
            totalQuestions: quiz.length
          })
        })
        
        // Update progress
        if (userProgress) {
          await fetch('/api/user-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              languageCode: selectedLanguage.code,
              quizzesPassed: userProgress.quizzesPassed + 1,
              lastPracticeDate: new Date().toISOString()
            })
          })
          fetchUserProgress()
        }
      } catch (error) {
        console.error("Error saving quiz result:", error)
      }
    }
  }

  // Next quiz question
  const nextQuestion = () => {
    if (currentQuizIndex < quiz.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
      setQuizAnswered(false)
    } else {
      // Quiz completed - refetch to start new quiz
      fetchQuiz()
    }
  }

  // Handle chat message
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return
    
    const userMessage = { role: "user", content: chatInput }
    setChatMessages([...chatMessages, userMessage])
    setChatInput("")
    setChatLoading(true)
    
    try {
      // Translate user message to English for processing
      const translateResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chatInput)}&langpair=${selectedLanguage.code}|en`
      )
      const translateData = await translateResponse.json()
      const englishTranslation = translateData.responseData?.translatedText || chatInput
      
      // Generate response
      const response = `Great practice! You said: "${englishTranslation}". Keep practicing your ${selectedLanguage.name}! Try forming more sentences.`
      
      // Translate response back to target language
      const responseTranslateResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(response)}&langpair=en|${selectedLanguage.code}`
      )
      const responseTranslateData = await responseTranslateResponse.json()
      const translatedResponse = responseTranslateData.responseData?.translatedText || response
      
      const assistantMessage = { 
        role: "assistant", 
        content: translatedResponse,
        englishTranslation: response
      }
      
      setChatMessages([...chatMessages, userMessage, assistantMessage])
    } catch (error) {
      console.error("Error in chat:", error)
      const errorMessage = { 
        role: "assistant", 
        content: "I'm having trouble right now. Please try again!" 
      }
      setChatMessages([...chatMessages, userMessage, errorMessage])
    } finally {
      setChatLoading(false)
    }
  }

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Language Selector */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Learn {selectedLanguage.name} {selectedLanguage.flag}
                </h1>
                <p className="text-muted-foreground text-lg">
                  Master {selectedLanguage.name} with real-time resources and AI-powered practice
                </p>
              </div>
              
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium mb-2">Select Language</label>
                <Select
                  value={selectedLanguage.code}
                  onValueChange={(code) => {
                    const lang = languages.find(l => l.code === code)
                    if (lang) setSelectedLanguage(lang)
                  }}
                >
                  <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="Choose a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                          <span className="text-muted-foreground">({lang.nativeName})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* User Progress Card - Visible only when logged in */}
            {userId && userProgress && (
              <Card className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Your Progress in {selectedLanguage.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <Target className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{userProgress.wordsLearned}</p>
                        <p className="text-sm text-muted-foreground">Words Learned</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-8 w-8 text-secondary" />
                      <div>
                        <p className="text-2xl font-bold">{userProgress.lessonsCompleted}</p>
                        <p className="text-sm text-muted-foreground">Lessons Done</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="h-8 w-8 text-accent" />
                      <div>
                        <p className="text-2xl font-bold">{userProgress.quizzesPassed}</p>
                        <p className="text-sm text-muted-foreground">Quizzes Passed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Flame className="h-8 w-8 text-orange-500" />
                      <div>
                        <p className="text-2xl font-bold">{userProgress.currentStreak}</p>
                        <p className="text-sm text-muted-foreground">Day Streak</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!userId && (
              <Card className="mb-6 border-primary/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold mb-1">Track Your Progress</p>
                      <p className="text-sm text-muted-foreground">Log in to save your learning progress and compete with others!</p>
                    </div>
                    <Button onClick={() => router.push('/login')}>
                      Log In
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="vocabulary" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
              <TabsTrigger value="vocabulary" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Vocabulary</span>
              </TabsTrigger>
              <TabsTrigger value="grammar" className="gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Grammar</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="gap-2">
                <Newspaper className="h-4 w-4" />
                <span className="hidden sm:inline">News</span>
              </TabsTrigger>
              <TabsTrigger value="culture" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Culture</span>
              </TabsTrigger>
              <TabsTrigger value="practice" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Practice</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Quiz</span>
              </TabsTrigger>
            </TabsList>

            {/* Vocabulary Tab */}
            <TabsContent value="vocabulary">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Common Vocabulary & Phrases
                  </CardTitle>
                  <CardDescription>
                    Learn essential words and phrases in {selectedLanguage.name} with pronunciation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Search Bar */}
                  <div className="flex gap-2 mb-6">
                    <Input
                      placeholder="Search for a word to translate..."
                      value={vocabSearch}
                      onChange={(e) => setVocabSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchVocabulary()}
                    />
                    <Button onClick={searchVocabulary} disabled={vocabLoading}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  {vocabLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">English</th>
                            <th className="text-left py-3 px-4">{selectedLanguage.name}</th>
                            <th className="text-center py-3 px-4">Audio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vocabulary.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-accent/50 transition-colors">
                              <td className="py-3 px-4 font-medium">{item.english}</td>
                              <td className="py-3 px-4 text-primary font-semibold">{item.translation}</td>
                              <td className="py-3 px-4 text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => speakWord(item.translation)}
                                >
                                  <Volume2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Grammar Tab */}
            <TabsContent value="grammar">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Grammar Tips & Lessons
                  </CardTitle>
                  <CardDescription>
                    Master {selectedLanguage.name} grammar rules and sentence structure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {grammarLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {grammar.map((item, index) => (
                        <div key={index} className="border-l-4 border-primary pl-4">
                          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                          <p className="text-muted-foreground mb-4">{item.content}</p>
                          <div className="bg-accent/50 p-4 rounded-lg">
                            <p className="text-sm font-medium mb-1">Example:</p>
                            <p className="italic">{item.example}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5" />
                    Latest from {selectedLanguage.country}
                  </CardTitle>
                  <CardDescription>
                    Stay updated with real-time news and information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {newsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {news.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                          <p className="text-muted-foreground mb-3">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{item.source}</Badge>
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              Read More <ChevronRight className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Culture Tab */}
            <TabsContent value="culture">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Cultural Insights
                  </CardTitle>
                  <CardDescription>
                    Explore the culture and traditions of {selectedLanguage.country}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {cultureLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : culture ? (
                    <div>
                      <h3 className="text-2xl font-bold mb-4">{culture.title}</h3>
                      <p className="text-muted-foreground mb-6">{culture.description}</p>
                      
                      <h4 className="text-lg font-semibold mb-3">Did You Know?</h4>
                      <ul className="space-y-3">
                        {culture.facts.map((fact: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Practice Tab */}
            <TabsContent value="practice">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    AI Practice Assistant
                  </CardTitle>
                  <CardDescription>
                    Practice {selectedLanguage.name} with instant feedback and translations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-4 bg-accent/20 rounded-lg">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            <p>{msg.content}</p>
                            {msg.englishTranslation && (
                              <p className="text-xs mt-1 opacity-75">
                                (English: {msg.englishTranslation})
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder={`Type in ${selectedLanguage.name}...`}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={chatLoading}
                      />
                      <Button onClick={handleSendMessage} disabled={chatLoading}>
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quiz Tab */}
            <TabsContent value="quiz">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    {selectedLanguage.name} Quiz
                  </CardTitle>
                  <CardDescription>
                    Test your knowledge and track your progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {quizLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : quiz.length > 0 ? (
                    <div>
                      {/* Quiz Progress */}
                      <div className="mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">
                            Question {currentQuizIndex + 1} of {quiz.length}
                          </span>
                          <span className="text-sm font-medium">
                            Score: {quizScore}/{quiz.length}
                          </span>
                        </div>
                        <Progress value={((currentQuizIndex + 1) / quiz.length) * 100} />
                      </div>

                      {/* Current Question */}
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-4">
                          {quiz[currentQuizIndex].question}
                        </h3>

                        <div className="space-y-3">
                          {quiz[currentQuizIndex].options.map((option: string, index: number) => (
                            <Button
                              key={index}
                              variant={
                                quizAnswered
                                  ? option === quiz[currentQuizIndex].correctAnswer
                                    ? "default"
                                    : "outline"
                                  : "outline"
                              }
                              className="w-full justify-start text-left h-auto py-3"
                              onClick={() => handleQuizAnswer(option)}
                              disabled={quizAnswered}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Next Button */}
                      {quizAnswered && (
                        <div className="flex justify-center">
                          <Button onClick={nextQuestion}>
                            {currentQuizIndex < quiz.length - 1 ? "Next Question" : "Finish Quiz"}
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">No quiz available</p>
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