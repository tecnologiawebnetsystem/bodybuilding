import Link from "next/link"
import { Dumbbell } from "lucide-react"

export function SharedFooter() {
  return (
    <footer className="border-t border-white/10 py-12 px-4 bg-black/40">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Logo e descricao */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
                FitTransform
              </h3>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              A plataforma completa de gestao para academias e personal trainers do Vale do Paraiba e de todo o Brasil.
            </p>
            <p className="text-gray-500 text-xs">
              Atendemos Taubate, Cacapava, Pindamonhangaba, Sao Jose dos Campos e toda a regiao.
            </p>
          </div>

          {/* Plataforma */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Plataforma</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#features" className="text-gray-400 hover:text-white transition text-sm">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link href="/precos" className="text-gray-400 hover:text-white transition text-sm">
                  Precos
                </Link>
              </li>
              <li>
                <Link href="/get-started" className="text-gray-400 hover:text-white transition text-sm">
                  Comecar Agora
                </Link>
              </li>
              <li>
                <Link href="/entrar" className="text-gray-400 hover:text-white transition text-sm">
                  Fazer Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Blog</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog?categoria=academia-treino" className="text-gray-400 hover:text-white transition text-sm">
                  Dicas de Treino
                </Link>
              </li>
              <li>
                <Link href="/blog?categoria=fit-transform" className="text-gray-400 hover:text-white transition text-sm">
                  FitTransform
                </Link>
              </li>
              <li>
                <Link href="/blog?categoria=nutricao" className="text-gray-400 hover:text-white transition text-sm">
                  Nutricao
                </Link>
              </li>
              <li>
                <Link href="/blog?categoria=suplementacao" className="text-gray-400 hover:text-white transition text-sm">
                  Suplementacao
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre-nos" className="text-gray-400 hover:text-white transition text-sm">
                  Sobre Nos
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white transition text-sm">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition text-sm">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition text-sm">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Keywords SEO */}
        <div className="border-t border-white/10 pt-6 mb-6">
          <p className="text-gray-600 text-xs text-center">
            App de academia | Sistema para academia | Gestao de academia | App para personal trainer | 
            Treinos com IA | Academia Taubate | Academia Cacapava | Academia Pindamonhangaba | 
            Academia Vale do Paraiba | App de treino | Software para academia | Plataforma fitness
          </p>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            2026 FitTransform. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-sm">
            Desenvolvido por{" "}
            <Link href="/sobre-nos" className="text-orange-500 hover:underline">
              Web NetSystem
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
