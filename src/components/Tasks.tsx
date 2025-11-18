import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, ListChecks, Trash2, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface TasksProps {
  onBack: () => void;
}

interface Subject {
  id: string;
  name: string;
}

interface Task {
  id: string;
  subject_id: string;
  title: string;
  due_date: string;
  completed: boolean;
  subject?: Subject;
}

export default function Tasks({ onBack }: TasksProps) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const [subjectsRes, tasksRes] = await Promise.all([
      supabase.from('subjects').select('id, name').eq('student_id', user.id),
      supabase
        .from('tasks')
        .select('*, subjects(id, name)')
        .eq('student_id', user.id)
        .order('due_date', { ascending: true }),
    ]);

    if (subjectsRes.data) setSubjects(subjectsRes.data);
    if (tasksRes.data) {
      const formattedTasks = tasksRes.data.map((task: any) => ({
        ...task,
        subject: task.subjects,
      }));
      setTasks(formattedTasks);
    }
    setLoading(false);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !dueDate || !selectedSubject) return;

    const { data } = await supabase
      .from('tasks')
      .insert({
        student_id: user.id,
        subject_id: selectedSubject,
        title: title.trim(),
        due_date: dueDate,
        completed: false,
      })
      .select('*, subjects(id, name)')
      .single();

    if (data) {
      const formattedTask = {
        ...data,
        subject: data.subjects,
      };
      setTasks([...tasks, formattedTask]);
      setTitle('');
      setDueDate('');
      setSelectedSubject('');
      setShowForm(false);
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    const { data } = await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', taskId)
      .select('*, subjects(id, name)')
      .single();

    if (data) {
      const formattedTask = {
        ...data,
        subject: data.subjects,
      };
      setTasks(tasks.map((t) => (t.id === taskId ? formattedTask : t)));
    }
  };

  const handleDeleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date() && !tasks.find(t => t.due_date === dateString)?.completed;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-cyan-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-cyan-50 p-6">
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
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
                <ListChecks className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Tarefa</span>
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleAddTask}
              className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-cyan-50 rounded-xl"
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                Adicionar Tarefa
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matéria
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione uma matéria</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição da Tarefa
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ex: Fazer exercícios da página 42"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Entrega
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    Adicionar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setTitle('');
                      setDueDate('');
                      setSelectedSubject('');
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
              <p className="text-gray-600 mb-4">
                Você precisa cadastrar matérias primeiro.
              </p>
              <p className="text-sm text-gray-500">
                Adicione matérias para poder criar tarefas.
              </p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <ListChecks className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Nenhuma tarefa cadastrada ainda.
              </p>
              <p className="text-sm text-gray-500">
                Clique em "Nova Tarefa" para começar.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-5 rounded-xl border transition-all ${
                    task.completed
                      ? 'bg-gray-50 border-gray-200'
                      : isOverdue(task.due_date)
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() =>
                        handleToggleComplete(task.id, task.completed)
                      }
                      className="mt-1 flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-orange-600 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3
                          className={`font-medium text-gray-900 ${
                            task.completed ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {task.title}
                        </h3>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded font-medium">
                          {task.subject?.name}
                        </span>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(task.due_date)}</span>
                        </div>
                      </div>
                    </div>
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
