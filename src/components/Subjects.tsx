import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, BookOpen, Trash2, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SubjectsProps {
  onBack: () => void;
}

interface Subject {
  id: string;
  name: string;
  schedule_days: string[];
  schedule_time: string;
}

const DAYS_OF_WEEK = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

export default function Subjects({ onBack }: SubjectsProps) {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, [user]);

  const loadSubjects = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('subjects')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: true });

    if (data) setSubjects(data);
    setLoading(false);
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    const { data } = await supabase
      .from('subjects')
      .insert({
        student_id: user.id,
        name: name.trim(),
        schedule_days: selectedDays,
        schedule_time: time,
      })
      .select()
      .single();

    if (data) {
      setSubjects([...subjects, data]);
      setName('');
      setTime('');
      setSelectedDays([]);
      setShowForm(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    await supabase.from('subjects').delete().eq('id', id);
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Matérias</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Matéria</span>
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleAddSubject}
              className="mb-8 p-6 bg-gradient-to-br from-green-50 to-cyan-50 rounded-xl"
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                Adicionar Matéria
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Matéria
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Matemática"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dias da Semana
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedDays.includes(day)
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Adicionar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setName('');
                      setTime('');
                      setSelectedDays([]);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          )}

          {subjects.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Nenhuma matéria cadastrada ainda.
              </p>
              <p className="text-sm text-gray-500">
                Clique em "Nova Matéria" para começar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {subject.name}
                    </h3>
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {subject.schedule_time && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{subject.schedule_time}</span>
                      </div>
                    )}

                    {subject.schedule_days.length > 0 && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 mt-1" />
                        <div className="flex flex-wrap gap-1">
                          {subject.schedule_days.map((day, index) => (
                            <span
                              key={day}
                              className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded"
                            >
                              {day}
                              {index < subject.schedule_days.length - 1 && ','}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
