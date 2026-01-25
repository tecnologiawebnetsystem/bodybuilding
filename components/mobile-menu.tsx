"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Dumbbell, BookOpen, Users, Phone, LogIn, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  const menuItems = [
    { href: "/#features", label: "Funcionalidades", icon: Rocket },
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/sobre-nos", label: "Sobre Nos", icon: Users },
    { href: "/contato", label: "Contato", icon: Phone },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-[#0a0a0a] border-white/10 p-0">
        <SheetHeader className="p-6 border-b border-white/10">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FitTransform</span>
          </SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col p-4 gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
            >
              <item.icon className="w-5 h-5 text-orange-500" />
              {item.label}
            </Link>
          ))}
          
          <div className="border-t border-white/10 my-4" />
          
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
          >
            <LogIn className="w-5 h-5 text-orange-500" />
            Entrar
          </Link>
          
          <Link href="/get-started" onClick={() => setOpen(false)} className="mt-4">
            <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 text-white font-semibold h-12">
              Comecar Gratis
            </Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
