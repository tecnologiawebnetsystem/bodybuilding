import type { Metadata } from "next"
import Link from "next/link"
import { Dumbbell, ArrowRight, ArrowLeft, Smartphone, Share, PlusSquare, MoreVertical, Download, CheckCircle, Info } from "lucide-react"

export const metadata: Metadata = {
  title: "Baixar App | FitTransform",
  description: "Instale o FitTransform no seu celular iPhone ou Android. Siga o passo a passo para ter o app na sua tela inicial.",
}

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.08] backdrop-blur-xl sticky top-0 z-50 bg-[#0a0a0a]/90">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">FitTransform</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <Smartphone className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-300">Instale no seu celular</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-balance">
              Baixe o{" "}
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
                FitTransform
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed text-pretty">
              O FitTransform funciona como um app nativo no seu celular. Siga as instrucoes abaixo
              para instalar no iPhone ou Android.
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <div className="flex items-start gap-4 p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Importante</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Para instalar o app, voce precisa primeiro <strong className="text-white">fazer login</strong> no sistema.
              Acesse{" "}
              <Link href="/entrar" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">
                fittransform.com.br/entrar
              </Link>
              {" "}com seu CPF e PIN, e depois siga os passos abaixo para adicionar a tela inicial.
            </p>
          </div>
        </div>
      </section>

      {/* iOS Instructions */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.10] flex items-center justify-center">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">iPhone (iOS)</h2>
            <p className="text-gray-400 text-sm">Safari obrigatorio</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-sm font-bold shrink-0">
                1
              </div>
              <div className="w-px flex-1 bg-white/[0.08] mt-2" />
            </div>
            <div className="pb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Faca login no sistema</h3>
              <p className="text-gray-400 leading-relaxed">
                Abra o <strong className="text-white">Safari</strong> (navegador da Apple) e acesse{" "}
                <span className="text-orange-400 font-medium">fittransform.com.br/entrar</span>.
                Faca login com seu CPF e PIN.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-sm font-bold shrink-0">
                2
              </div>
              <div className="w-px flex-1 bg-white/[0.08] mt-2" />
            </div>
            <div className="pb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Toque no botao Compartilhar</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Na barra inferior do Safari, toque no icone de compartilhar (quadrado com seta para cima).
              </p>
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/[0.06] border border-white/[0.10] rounded-xl">
                <Share className="w-6 h-6 text-blue-400" />
                <span className="text-sm text-gray-300">Icone de compartilhar na barra inferior</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-sm font-bold shrink-0">
                3
              </div>
              <div className="w-px flex-1 bg-white/[0.08] mt-2" />
            </div>
            <div className="pb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Selecione "Adicionar a Tela de Inicio"</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Role a lista de opcoes e toque em <strong className="text-white">"Adicionar a Tela de Inicio"</strong>.
              </p>
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/[0.06] border border-white/[0.10] rounded-xl">
                <PlusSquare className="w-6 h-6 text-gray-300" />
                <span className="text-sm text-gray-300">Adicionar a Tela de Inicio</span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-sm font-bold shrink-0">
                4
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Confirme tocando em "Adicionar"</h3>
              <p className="text-gray-400 leading-relaxed">
                Toque em <strong className="text-white">"Adicionar"</strong> no canto superior direito. Pronto!
                O icone do FitTransform aparecera na sua tela inicial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-white/[0.08]" />
      </div>

      {/* Android Instructions */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.10] flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.523 2.246l1.392-2.41a.4.4 0 00-.693-.4l-1.41 2.44A8.02 8.02 0 0012 .79a8.02 8.02 0 00-4.812 1.086L5.778-.564a.4.4 0 10-.693.4l1.392 2.41C3.697 3.818 1.743 6.44 1.5 9.6h21c-.243-3.16-2.197-5.782-4.977-7.354zM7.5 7.2a.9.9 0 110-1.8.9.9 0 010 1.8zm9 0a.9.9 0 110-1.8.9.9 0 010 1.8zM1.5 10.8v8.4a1.8 1.8 0 003.6 0v-8.4H1.5zm3.6 10.8a1.8 1.8 0 003.6 0V10.8H5.1v10.8zm4.8 0a1.8 1.8 0 003.6 0V10.8H9.9v10.8zm4.8-10.8v8.4a1.8 1.8 0 003.6 0v-8.4h-3.6zm4.8 0v8.4a1.8 1.8 0 003.6 0v-8.4h-3.6z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Android</h2>
            <p className="text-gray-400 text-sm">Chrome recomendado</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                1
              </div>
              <div className="w-px flex-1 bg-white/[0.08] mt-2" />
            </div>
            <div className="pb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Faca login no sistema</h3>
              <p className="text-gray-400 leading-relaxed">
                Abra o <strong className="text-white">Chrome</strong> e acesse{" "}
                <span className="text-orange-400 font-medium">fittransform.com.br/entrar</span>.
                Faca login com seu CPF e PIN.
              </p>
            </div>
          </div>

          {/* Step 2 - Option A */}
          <div className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                2
              </div>
              <div className="w-px flex-1 bg-white/[0.08] mt-2" />
            </div>
            <div className="pb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Aceite o banner ou use o menu</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                O Chrome pode exibir automaticamente um banner na parte inferior perguntando se deseja
                {" "}<strong className="text-white">"Adicionar a tela inicial"</strong>. Toque nele!
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                Se o banner nao aparecer, toque nos <strong className="text-white">tres pontinhos</strong> no canto superior direito do Chrome.
              </p>
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/[0.06] border border-white/[0.10] rounded-xl">
                <MoreVertical className="w-6 h-6 text-gray-300" />
                <span className="text-sm text-gray-300">Menu do Chrome (tres pontinhos)</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                3
              </div>
              <div className="w-px flex-1 bg-white/[0.08] mt-2" />
            </div>
            <div className="pb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Selecione "Adicionar a tela inicial"</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                No menu, toque em <strong className="text-white">"Adicionar a tela inicial"</strong> ou
                {" "}<strong className="text-white">"Instalar aplicativo"</strong>.
              </p>
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/[0.06] border border-white/[0.10] rounded-xl">
                <Download className="w-6 h-6 text-green-400" />
                <span className="text-sm text-gray-300">Instalar aplicativo / Adicionar a tela inicial</span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                4
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Confirme a instalacao</h3>
              <p className="text-gray-400 leading-relaxed">
                Toque em <strong className="text-white">"Instalar"</strong> ou <strong className="text-white">"Adicionar"</strong> na caixa de confirmacao.
                Pronto! O icone do FitTransform aparecera na sua tela inicial como um app real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-white/[0.08]" />
      </div>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Vantagens do app instalado</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Acesso rapido",
              desc: "Abra direto da tela inicial, sem precisar digitar o endereco no navegador.",
            },
            {
              title: "Tela cheia",
              desc: "Funciona em tela cheia, sem barra de endereco do navegador. Experiencia de app nativo.",
            },
            {
              title: "Notificacoes",
              desc: "Receba lembretes de treino, hidratacao e atualizacoes da sua academia.",
            },
            {
              title: "Funciona offline",
              desc: "Acesse seus treinos e informacoes mesmo sem conexao com internet.",
            },
            {
              title: "Sem ocupar espaco",
              desc: "Nao precisa baixar na loja. Ocupa muito menos espaco que apps tradicionais.",
            },
            {
              title: "Sempre atualizado",
              desc: "Recebe atualizacoes automaticamente, sem precisar atualizar pela loja.",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-5 bg-white/[0.03] border border-white/[0.08] rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center p-10 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Pronto para comecar?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Faca login no sistema e siga os passos acima para instalar o app no seu celular.
          </p>
          <Link
            href="/entrar"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-orange-500/20"
          >
            Fazer Login
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#050505]">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">2026 FitTransform. Todos os direitos reservados.</p>
          <p className="text-gray-600 text-xs">
            Desenvolvido com excelencia por{" "}
            <Link href="/sobre-nos" className="text-orange-500 hover:text-orange-400 font-medium">
              Web NetSystem
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
