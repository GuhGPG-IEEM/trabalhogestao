import { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, ExternalLink, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface StudyTipsProps {
  onBack: () => void;
}

interface SavedTip {
  id: string;
  query: string;
  tips: string;
  created_at: string;
}

export default function StudyTips({ onBack }: StudyTipsProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [tips, setTips] = useState('');
  const [savedTips, setSavedTips] = useState<SavedTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedTips();
  }, [user]);

  const loadSavedTips = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('study_tips')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setSavedTips(data);
    setLoading(false);
  };

  const handleGenerateWithAI = () => {
    if (!query.trim()) return;

    const encodedQuery = encodeURIComponent(
      `Me dê dicas de estudo sobre: ${query}`
    );

    window.open(
      `https://gemini.google.com/?q=${encodedQuery}`,
      '_blank'
    );
  };

  const handleSaveTips = async () => {
    if (!user || !query.trim() || !tips.trim()) return;

    const { data } = await supabase
      .from('study_tips')
      .insert({
        student_id: user.id,
        query: query.trim(),
        tips: tips.trim(),
      })
      .select()
      .single();

    if (data) {
      setSavedTips([data, ...savedTips]);
      setQuery('');
      setTips('');
    }
  };

  const handleDeleteTip = async (id: string) => {
    await supabase.from('study_tips').delete().eq('id', id);
    setSavedTips(savedTips.filter((t) => t.id !== id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 rounded-xl">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dicas de Estudo com IA
            </h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O que você quer estudar?
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                placeholder="Ex: Como melhorar minha concentração nos estudos de matemática..."
                rows={3}
              />
            </div>

            <button
              onClick={handleGenerateWithAI}
              disabled={!query.trim()}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-5 h-5" />
              Gerar Dicas com IA
              <ExternalLink className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cole as dicas geradas aqui (opcional)
              </label>
              <textarea
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                placeholder="Cole aqui as dicas que você recebeu da IA..."
                rows={6}
              />

              {tips.trim() && query.trim() && (
                <button
                  onClick={handleSaveTips}
                  className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Salvar Dicas
                </button>
              )}
            </div>
          </div>
        </div>

        {savedTips.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Dicas Salvas
            </h2>

            <div className="space-y-4">
              {savedTips.map((tip) => (
                <div
                  key={tip.id}
                  className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {tip.query}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(tip.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteTip(tip.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-white rounded-lg p-4 mt-3">
                    <p className="text-gray-700 whitespace-pre-wrap text-sm">
                      {tip.tips}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
