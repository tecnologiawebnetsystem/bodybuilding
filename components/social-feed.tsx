"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Share2, Dumbbell, Trophy, TrendingUp } from "lucide-react"

interface Post {
  id: number
  user_id: string
  user_name: string
  post_type: string
  content: string
  media_url?: string
  workout_data?: any
  likes_count: number
  comments_count: number
  created_at: string
  user_liked: boolean
}

export function SocialFeed({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [feedType, setFeedType] = useState<"following" | "explore" | "gym">("following")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [feedType])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/social/posts?userId=${userId}&feedType=${feedType}`)
      const data = await response.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = async (postId: number) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await response.json()

      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                user_liked: data.liked,
                likes_count: post.likes_count + (data.liked ? 1 : -1),
              }
            : post,
        ),
      )
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const getPostIcon = (type: string) => {
    switch (type) {
      case "workout":
        return <Dumbbell className="h-4 w-4" />
      case "achievement":
        return <Trophy className="h-4 w-4" />
      case "progress":
        return <TrendingUp className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const posted = new Date(date)
    const diffMs = now.getTime() - posted.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) return `${diffMins}min atrás`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h atrás`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d atrás`
  }

  return (
    <div className="space-y-4">
      <Tabs value={feedType} onValueChange={(v) => setFeedType(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="following">Seguindo</TabsTrigger>
          <TabsTrigger value="gym">Minha Academia</TabsTrigger>
          <TabsTrigger value="explore">Explorar</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Carregando feed...</div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma atividade para mostrar. Comece seguindo pessoas ou treine para compartilhar!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {post.user_name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{post.user_name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        {getPostIcon(post.post_type)}
                        {formatTimeAgo(post.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                {post.content && <p className="mb-3">{post.content}</p>}

                {post.workout_data && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="font-semibold">Treino Completo!</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duração:</span>
                        <span className="ml-2 font-semibold">{post.workout_data.duration || "45min"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Exercícios:</span>
                        <span className="ml-2 font-semibold">{post.workout_data.exercises || "8"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {post.media_url && (
                  <img
                    src={post.media_url || "/placeholder.svg"}
                    alt="Post"
                    className="rounded-lg w-full object-cover max-h-96 mt-3"
                  />
                )}
              </CardContent>

              <CardFooter className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => toggleLike(post.id)} className="gap-2">
                  <Heart className={`h-4 w-4 ${post.user_liked ? "fill-red-500 text-red-500" : ""}`} />
                  <span>{post.likes_count}</span>
                </Button>

                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments_count}</span>
                </Button>

                <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                  <Share2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
