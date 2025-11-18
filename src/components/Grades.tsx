import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Calculator, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface GradesProps {
  onBack: () => void;
}

interface Subject {
  id: string;
  name: string;
}

interface Grade {
  id: string;
  subject_id: string;
  grade: number;
}

export default function Grades({ onBack }: GradesProps) {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const [subjectsRes, gradesRes] = await Promise.all([
      supabase.from('subjects').select('id, name').eq('student_id', user.id),
      supabase.from('grades').select('*').eq('student_id', user.id),
    ]);

    if (subjectsRes.data) setSubjects(subjectsRes.data);
    if (gradesRes.data) setGrades(gradesRes.data);
    setLoading(false);
  };

  const handleGradeChange = async (subjectId: string, value: string) => {
    if (!user) return;

    const gradeValue = parseFloat(value);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 10) return;

    const existingGrade = grades.find((g) => g.subject_id === subjectId);

    if (existingGrade) {
      const { data } = await supabase
        .from('grades')
        .update({ grade: gradeValue })
        .eq('id', existingGrade.id)
        .select()
        .single();

      if (data) {
        setGrades((prev) =>
          prev.map((g) => (g.id === data.id ? data : g))
        );
      }
    } else {
      const { data } = await supabase
        .from('grades')
        .insert({
          student_id: user.id,
          subject_id: subjectId,
          grade: gradeValue,
        })
        .select()
        .single();

      if (data) {
        setGrades((prev) => [...prev, data]);
      }
    }
  };

  const handleDeleteGrade = async (gradeId: string) => {
    await supabase.from('grades').delete().eq('id', gradeId);
    setGrades((prev) => prev.filter((g) => g.id !== gradeId));
    setAverage(null);
    setShowAlert(false);
  };

  const calculateAverage = () => {
    if (grades.length === 0) {
      setAverage(null);
      setShowAlert(false);
      return;
    }

    const sum = grades.reduce((acc, g) => acc + g.grade, 0);
    const avg = sum / grades.length;
    setAverage(avg);
    setShowAlert(avg < 6.0);
  };

  const getGradeForSubject = (subjectId: string) => {
    const grade = grades.find((g) => g.subject_id === subjectId);
    return grade?.grade?.toString() || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Notas</h1>
          </div>

          {subjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                Você ainda não tem matérias cadastradas.
              </p>
              <p className="text-sm text-gray-500">
                Adicione matérias primeiro para registrar suas notas.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <label className="flex-1 font-medium text-gray-700">
                      {subject.name}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={getGradeForSubject(subject.id)}
                        onChange={(e) =>
                          handleGradeChange(subject.id, e.target.value)
                        }
                        placeholder="0.0"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                      />
                      {grades.find((g) => g.subject_id === subject.id) && (
                        <button
                          onClick={() =>
                            handleDeleteGrade(
                              grades.find((g) => g.subject_id === subject.id)!
                                .id
                            )
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={calculateAverage}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calcular Média
              </button>

              {average !== null && (
                <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Média Final</p>
                    <p
                      className={`text-5xl font-bold ${
                        average >= 6.0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {average.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {showAlert && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-600 rounded-lg">
                  <p className="text-red-800 font-medium">
                    Atenção: Sua média está abaixo de 6.0!
                  </p>
                  <p className="text-red-700 text-sm mt-1">
                    É importante dedicar mais tempo aos estudos para melhorar
                    suas notas.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
