import Link from "next/link"

export function SharedFooter() {
  return (
    <footer className="border-t border-white/10 py-12 px-4 bg-black/40">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text mb-4">
              FitTransform
            </h3>
            <p className="text-gray-400 mb-4">
              A plataforma completa de gestão para academias e personal trainers. Transforme seu negócio fitness.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#funcionalidades" className="text-gray-400 hover:text-white transition">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link href="/get-started" className="text-gray-400 hover:text-white transition">
                  Começar Agora
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white transition">
                  Fazer Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sobre-nos" className="text-gray-400 hover:text-white transition">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white transition">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 FitTransform. Todos os direitos reservados. | Desenvolvido por{" "}
            <Link href="/sobre-nos" className="text-orange-500 hover:underline">
              Web NetSystem
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
