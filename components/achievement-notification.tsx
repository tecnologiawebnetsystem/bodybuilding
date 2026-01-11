"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AchievementNotificationProps {
  achievement: {
    title: string
    description: string
    points: number
  } | null
  onClose: () => void
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  return (
    <AnimatePresence>
      {isVisible && achievement && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <Card className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-lg mb-1">Conquista Desbloqueada!</div>
                <div className="font-semibold mb-1">{achievement.title}</div>
                <div className="text-sm opacity-90">{achievement.description}</div>
                <div className="text-xs font-bold mt-2">+{achievement.points} pontos</div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 text-white hover:bg-white/20"
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(onClose, 300)
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
