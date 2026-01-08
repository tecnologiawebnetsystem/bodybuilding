import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "contato@academia.com",
    href: "mailto:contato@academia.com",
  },
  {
    icon: Phone,
    label: "Telefone",
    value: "+55 (11) 1234-5678",
    href: "tel:+5511123456789",
  },
  {
    icon: MapPin,
    label: "Endereço",
    value: "São Paulo, SP - Brasil",
    href: null,
  },
]

export function ContactInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Contato</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {contactDetails.map((detail) => (
          <div key={detail.label} className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <detail.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{detail.label}</p>
              {detail.href ? (
                <a href={detail.href} className="text-muted-foreground hover:text-primary transition-colors">
                  {detail.value}
                </a>
              ) : (
                <p className="text-muted-foreground">{detail.value}</p>
              )}
            </div>
          </div>
        ))}

        <div className="mt-8 rounded-lg bg-muted p-4">
          <h3 className="mb-2 font-semibold">Horário de Atendimento</h3>
          <p className="text-sm text-muted-foreground">
            Segunda a Sexta: 9h às 18h
            <br />
            Sábado: 9h às 13h
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
