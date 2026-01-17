"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export function TrainerMessages({ trainerId }: { trainerId: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Mensagens</h2>
        <p className="text-gray-400 mt-1">Converse com seus alunos</p>
      </div>

      <Card className="bg-white/5 border-white/10 text-center py-12">
        <CardContent>
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400 opacity-50" />
          <p className="text-gray-400">Sistema de mensagens em desenvolvimento</p>
        </CardContent>
      </Card>
    </div>
  )
}
