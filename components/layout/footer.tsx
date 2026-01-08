import Link from "next/link"

const footerLinks = {
  produto: [
    { name: "Recursos", href: "#" },
    { name: "Preços", href: "#" },
    { name: "Atualizações", href: "#" },
  ],
  empresa: [
    { name: "Sobre", href: "/about" },
    { name: "Blog", href: "#" },
    { name: "Carreiras", href: "#" },
  ],
  suporte: [
    { name: "Contato", href: "/contact" },
    { name: "FAQ", href: "#" },
    { name: "Ajuda", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">Academia</h3>
            <p className="text-sm text-muted-foreground">Transformando educação através da tecnologia.</p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm font-semibold capitalize">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Academia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
