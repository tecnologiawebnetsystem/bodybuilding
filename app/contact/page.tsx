import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Entre em Contato</h1>
          <p className="text-lg text-muted-foreground">
            Estamos aqui para ajudar. Envie sua mensagem e retornaremos em breve.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </main>
  )
}
