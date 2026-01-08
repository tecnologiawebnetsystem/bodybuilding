import { Hero } from "@/components/home/hero"
import { Features } from "@/components/home/features"
import { CallToAction } from "@/components/home/call-to-action"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Features />
      <CallToAction />
    </main>
  )
}
