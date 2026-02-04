"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  MessageCircle, Send, ArrowLeft, User, Bell, BellOff, Check, CheckCheck,
  Clock, Search, Plus, X
} from "lucide-react"

interface Message {
  id: number
  conversation_id: number
  sender_id: string
  sender_type: string
  sender_name?: string
  message: string
  is_read: boolean
  sent_at: string
}

interface Conversation {
  id: number
  user_id: string
  trainer_id: string
  status: string
  unread_count: number
  last_message: string
  last_message_time: string
}

interface Notification {
  id: number
  type: string
  title: string
  message: string
  is_read: boolean
  sent_at: string
  action_url?: string
}

interface ChatTabProps {
  userId: string
}

export function ChatTab({ userId }: ChatTabProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "notifications">("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadData()
  }, [userId])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadData = async () => {
    try {
      const [chatRes, notifRes] = await Promise.all([
        fetch(`/api/chat?userId=${userId}`),
        fetch(`/api/messages?userId=${userId}`)
      ])

      const chatData = await chatRes.json()
      const notifData = await notifRes.json()

      if (chatData.success) {
        setConversations(chatData.data || [])
      }
      if (notifData.success) {
        setNotifications(notifData.data || [])
        setUnreadCount(notifData.unreadCount || 0)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: number) => {
    try {
      const response = await fetch(`/api/chat?userId=${userId}&conversationId=${conversationId}`)
      const data = await response.json()
      if (data.success) {
        setMessages(data.data || [])
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    setSending(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          userId,
          conversationId: selectedConversation.id,
          message: newMessage,
          senderType: "user"
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessages([...messages, data.data])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
    } finally {
      setSending(false)
    }
  }

  const markAllNotificationsRead = async () => {
    try {
      await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, markAllRead: true })
      })
      
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Erro ao marcar notificacoes:", error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "Ontem"
    } else if (diffDays < 7) {
      return date.toLocaleDateString("pt-BR", { weekday: "short" })
    }
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Comunicacao</h2>
          <p className="text-gray-400">Chat e notificacoes</p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-red-500">{unreadCount} novas</Badge>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white/5 rounded-lg p-1">
        <Button
          variant={activeTab === "chat" ? "secondary" : "ghost"}
          className={`flex-1 ${activeTab === "chat" ? "bg-orange-500/20 text-orange-400" : "text-gray-400"}`}
          onClick={() => setActiveTab("chat")}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>
        <Button
          variant={activeTab === "notifications" ? "secondary" : "ghost"}
          className={`flex-1 ${activeTab === "notifications" ? "bg-orange-500/20 text-orange-400" : "text-gray-400"}`}
          onClick={() => setActiveTab("notifications")}
        >
          <Bell className="w-4 h-4 mr-2" />
          Notificacoes
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-red-500 text-xs">{unreadCount}</Badge>
          )}
        </Button>
      </div>

      {/* Chat */}
      {activeTab === "chat" && (
        <Card className="bg-white/5 border-white/10 overflow-hidden">
          {selectedConversation ? (
            // Conversa aberta
            <div className="flex flex-col h-[500px]">
              {/* Header da conversa */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-white">Personal Trainer</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhuma mensagem ainda</p>
                    <p className="text-sm">Envie uma mensagem para comecar</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] ${
                        msg.sender_id === userId 
                          ? "bg-orange-500 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                          : "bg-white/10 text-white rounded-tl-xl rounded-tr-xl rounded-br-xl"
                      } p-3`}>
                        <p>{msg.message}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                          msg.sender_id === userId ? "text-white/70" : "text-gray-500"
                        }`}>
                          <span>{formatTime(msg.sent_at)}</span>
                          {msg.sender_id === userId && (
                            msg.is_read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Lista de conversas
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Conversas</h3>
              </div>

              {conversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhuma conversa ainda</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Fale com seu personal trainer
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map(conv => (
                    <div
                      key={conv.id}
                      className="p-4 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center relative">
                          <User className="w-6 h-6 text-orange-500" />
                          {conv.unread_count > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white">Personal Trainer</p>
                            <span className="text-xs text-gray-500">
                              {conv.last_message_time && formatTime(conv.last_message_time)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 truncate">{conv.last_message || "Sem mensagens"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Notificacoes */}
      {activeTab === "notifications" && (
        <Card className="p-4 bg-white/5 border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white">Notificacoes</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>
                <BellOff className="w-4 h-4 mr-2" />
                Marcar todas como lidas
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhuma notificacao</p>
              <p className="text-sm text-gray-500 mt-1">
                Voce sera notificado sobre eventos importantes
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-lg transition-colors ${
                    notif.is_read 
                      ? "bg-white/5" 
                      : "bg-orange-500/10 border border-orange-500/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      notif.type === "achievement" ? "bg-yellow-500/20" :
                      notif.type === "reminder" ? "bg-blue-500/20" :
                      "bg-gray-500/20"
                    }`}>
                      <Bell className={`w-5 h-5 ${
                        notif.type === "achievement" ? "text-yellow-500" :
                        notif.type === "reminder" ? "text-blue-500" :
                        "text-gray-500"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${notif.is_read ? "text-gray-300" : "text-white"}`}>
                          {notif.title}
                        </p>
                        <span className="text-xs text-gray-500">{formatTime(notif.sent_at)}</span>
                      </div>
                      {notif.message && (
                        <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                      )}
                    </div>
                    {!notif.is_read && (
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
