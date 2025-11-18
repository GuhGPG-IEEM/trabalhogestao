import { ArrowLeft, GraduationCap, Code, Database, Sparkles } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export default function About({ onBack }: AboutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-2xl">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Minha Rotina Escolar
          </h1>

          <p className="text-center text-gray-600 mb-12 text-lg">
            Seu assistente pessoal para organizar a vida acadêmica
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sobre o Projeto
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                O <strong>Minha Rotina Escolar</strong> é um aplicativo desenvolvido para
                ajudar estudantes a organizarem sua vida acadêmica de forma simples e eficiente.
                Com ele, você pode gerenciar suas notas, acompanhar suas matérias, organizar
                tarefas e até receber dicas de estudo personalizadas usando inteligência artificial.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Este projeto foi criado como trabalho da disciplina de Programação, demonstrando
                a aplicação prática de conceitos modernos de desenvolvimento web.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Funcionalidades
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Gerenciamento de Notas
                  </h3>
                  <p className="text-sm text-gray-600">
                    Registre suas notas por disciplina e calcule automaticamente sua média.
                    Receba alertas quando sua média estiver abaixo de 6.0.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-cyan-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Controle de Matérias
                  </h3>
                  <p className="text-sm text-gray-600">
                    Organize suas disciplinas com horários e dias da semana,
                    mantendo sua grade sempre à mão.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-orange-50 to-cyan-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Organização de Tarefas
                  </h3>
                  <p className="text-sm text-gray-600">
                    Crie e gerencie suas tarefas por disciplina, com datas de entrega
                    e marcação de conclusão.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Dicas de Estudo com IA
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gere dicas personalizadas usando inteligência artificial e
                    salve suas favoritas para consulta posterior.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tecnologias Utilizadas
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Code className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">React + TypeScript</h3>
                    <p className="text-sm text-gray-600">
                      Framework moderno para construção de interfaces interativas e tipagem segura
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Database className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Supabase</h3>
                    <p className="text-sm text-gray-600">
                      Banco de dados PostgreSQL com autenticação e segurança integradas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Sparkles className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Tailwind CSS</h3>
                    <p className="text-sm text-gray-600">
                      Framework CSS para design responsivo e moderno
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Desenvolvido com dedicação para a disciplina de Programação
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                © 2025 Minha Rotina Escolar - Todos os direitos reservados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
