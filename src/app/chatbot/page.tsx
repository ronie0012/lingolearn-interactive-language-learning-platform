"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/Navigation"
import { Send, Volume2, Mic, RotateCcw, Languages, Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Message {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
  translated?: string
}

const languages = [
  { code: "spanish", name: "Spanish", flag: "🇪🇸" },
  { code: "french", name: "French", flag: "🇫🇷" },
  { code: "japanese", name: "Japanese", flag: "🇯🇵" },
  { code: "german", name: "German", flag: "🇩🇪" },
  { code: "mandarin", name: "Mandarin", flag: "🇨🇳" },
]

const conversationStarters = [
  "Hello, how are you?",
  "What's your name?",
  "Can you help me practice?",
  "Tell me about yourself",
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! I'm your AI language practice partner. Let's have a conversation in Spanish! Feel free to ask me anything or practice your speaking skills.",
      sender: "ai",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("spanish")
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "¡Muy bien! That's great Spanish. Let me help you improve. The correct way to say that would be...",
        "Excelente! Your pronunciation is getting better. Keep practicing!",
        "That's a good attempt! In Spanish, we would typically say it like this...",
        "¡Perfecto! You're making excellent progress. Would you like to try another sentence?",
        "Buena pregunta! Let me explain that in Spanish...",
      ]

      const aiMessage: Message = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "ai",
        timestamp: new Date(),
        translated: "Very good! That's great Spanish. Let me help you improve...",
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleTextToSpeech = (text: string) => {
    setIsSpeaking(true)
    
    // Use Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage === "spanish" ? "es-ES" : 
                       selectedLanguage === "french" ? "fr-FR" :
                       selectedLanguage === "japanese" ? "ja-JP" :
                       selectedLanguage === "german" ? "de-DE" : "zh-CN"
      utterance.rate = 0.9
      
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    } else {
      setTimeout(() => setIsSpeaking(false), 1000)
    }
  }

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.lang = selectedLanguage === "spanish" ? "es-ES" : 
                        selectedLanguage === "french" ? "fr-FR" :
                        selectedLanguage === "japanese" ? "ja-JP" :
                        selectedLanguage === "german" ? "de-DE" : "zh-CN"
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
      }
      
      recognition.start()
    }
  }

  const resetConversation = () => {
    setMessages([
      {
        id: 1,
        text: "¡Hola! I'm your AI language practice partner. Let's start fresh! How can I help you practice today?",
        sender: "ai",
        timestamp: new Date(),
      }
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Practice Partner
            </h1>
            <p className="text-lg text-muted-foreground">
              Practice real conversations with our advanced AI assistant
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Language
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Start</CardTitle>
                  <CardDescription>Try these phrases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {conversationStarters.map((starter, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-2 px-3"
                        onClick={() => setInput(starter)}
                      >
                        <span className="text-sm line-clamp-2">{starter}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Speak naturally and clearly</li>
                    <li>• Use the voice feature to practice pronunciation</li>
                    <li>• Don't worry about mistakes!</li>
                    <li>• Ask for translations anytime</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              <Card className="h-[calc(100vh-300px)] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                        {languages.find(l => l.code === selectedLanguage)?.flag}
                      </div>
                      <div>
                        <CardTitle>AI Practice Partner</CardTitle>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <CardDescription>Online and ready to chat</CardDescription>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={resetConversation}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-4 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <p className="text-sm flex-1">{message.text}</p>
                          {message.sender === "ai" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => handleTextToSpeech(message.text)}
                              disabled={isSpeaking}
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {message.translated && (
                          <div className="border-t border-border/50 pt-2 mt-2">
                            <p className="text-xs opacity-70">Translation: {message.translated}</p>
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-4">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleVoiceInput}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Press Enter to send • Click mic to use voice input
                  </p>
                </div>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{messages.filter(m => m.sender === "user").length}</p>
                      <p className="text-sm text-muted-foreground">Messages Sent</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-secondary">15 min</p>
                      <p className="text-sm text-muted-foreground">Practice Time</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">A+</p>
                      <p className="text-sm text-muted-foreground">Performance</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}