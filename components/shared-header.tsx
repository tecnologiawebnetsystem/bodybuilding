"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dumbbell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function SharedHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/#funcionalidades", label: "Funcionalidades" },
    { href: "/precos", label: "Precos" },
    { href: "/blog", label: "Blog" },
    { href: "/sobre-nos", label: "Sobre Nos" },
    { href: "/contato", label: "Contato" },
    { href: "/entrar", label: "Fazer Login" },
  ]

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Dumbbell className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
              FitTransform
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${
                  isActive(link.href) ? "text-white font-semibold" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/get-started">
              <Button className="bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 text-white font-semibold">
                Experimentar App
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 transition ${
                  isActive(link.href) ? "text-white font-semibold" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/get-started" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 text-white font-semibold mt-2">
                Experimentar App
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
