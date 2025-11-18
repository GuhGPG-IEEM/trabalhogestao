import { useState, useEffect } from 'react';
import { BookOpen, ListChecks, Lightbulb, Info, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user, signOut } = useAuth();
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    loadStudentData();
  }, [user]);

  const loadStudentData = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('students')
      .select('name')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setStudentName(data.name);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const menuItems = [
    {
      id: 'grades',
      title: 'Notas',
      description: 'Gerencie suas notas',
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'subjects',
      title: 'Matérias',
      description: 'Horários e disciplinas',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'tasks',
      title: 'Tarefas',
      description: 'Organize suas atividades',
      icon: ListChecks,
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'tips',
      title: 'Dicas de Estudo',
      description: 'Aprenda com IA',
      icon: Lightbulb,
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {getGreeting()}, {studentName || 'Estudante'}!
            </h1>
            <p className="text-gray-600 text-lg">
              Bem-vindo à sua rotina escolar
            </p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

              <div className="p-8">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} mb-4`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-600">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => onNavigate('about')}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all shadow-sm"
        >
          <Info className="w-5 h-5" />
          <span>Sobre o Aplicativo</span>
        </button>
      </div>
    </div>
  );
}
