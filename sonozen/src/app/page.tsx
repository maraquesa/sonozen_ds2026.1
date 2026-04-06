"use client";

import { useState, useEffect } from "react";
import { perguntarParaIA } from "./actions";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

// Definindo o tipo do histórico
interface HistoricoItem {
  id: string;
  pergunta: string;
  resposta: string;
  created_at: string;
}

export default function PaginaPrincipal() {
  // 1. Definição de todos os Hooks dentro do componente
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [respostaAtual, setRespostaAtual] = useState("");
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [carregandoIA, setCarregandoIA] = useState(false);

  // 2. Efeito para checar autenticação e carregar dados
  useEffect(() => {
    async function inicializar() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Se não tem usuário, manda para o login
          router.push("/login");
        } else {
          setUsuario(user);
          // Carrega o histórico se o usuário existir
          const { data, error } = await supabase
            .from("historico")
            .select("*")
            .eq("usuario_id", user.id)
            .order("created_at", { ascending: false });

          if (!error && data) setHistorico(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro na inicialização:", err);
        setLoading(false);
      }
    }
    inicializar();
  }, [router]);

  // 3. Função para buscar o histórico atualizado
  async function carregarHistorico(userId: string) {
    const { data, error } = await supabase
      .from("historico")
      .select("*")
      .eq("usuario_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) setHistorico(data);
  }

  // 4. Função Principal: IA + Salvar
  async function enviarPergunta() {
    if (!input || !usuario) return;

    setCarregandoIA(true);
    try {
      const textoIA = await perguntarParaIA(input);
      setRespostaAtual(textoIA);

      const { error } = await supabase.from("historico").insert([
        {
          pergunta: input,
          resposta: textoIA,
          usuario_id: usuario.id,
        },
      ]);

      if (error) throw error;

      setInput("");
      carregarHistorico(usuario.id);
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao processar sua solicitação.");
    } finally {
      setCarregandoIA(false);
    }
  }

  // 5. Função para deslogar
  async function deslogar() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Erro ao sair: " + error.message);
    } else {
      router.push("/login");
    }
  }

  // Tela de carregamento inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white font-bold text-xl">
        Carregando Sonozen...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-20">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <section className="flex justify-between items-center bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-blue-400">Sonozen AI</h1>
            <p className="text-xs text-gray-500">Conectado: {usuario?.email}</p>
          </div>
          <button
            onClick={deslogar}
            className="px-4 py-2 bg-red-900/50 hover:bg-red-600 text-red-200 text-sm font-bold rounded-lg border border-red-500/50 transition"
          >
            Sair
          </button>
        </section>

        {/* Campo de Pergunta */}
        <section className="bg-gray-800 p-6 rounded-xl shadow-xl space-y-4">
          <textarea
            className="w-full p-4 bg-gray-700 rounded-lg text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            rows={3}
            placeholder="Sua dúvida sobre sono ou estudos..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={enviarPergunta}
            disabled={carregandoIA}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition disabled:bg-gray-600"
          >
            {carregandoIA ? "A IA está pensando..." : "Enviar Pergunta"}
          </button>
        </section>

        {/* Resposta Atual */}
        {respostaAtual && (
          <section className="bg-blue-900/30 border border-blue-500/50 p-6 rounded-xl animate-pulse">
            <h2 className="text-blue-300 font-bold mb-2">Resposta da IA:</h2>
            <p className="leading-relaxed">{respostaAtual}</p>
          </section>
        )}

        <hr className="border-gray-700" />

        {/* Histórico */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-300">Seu Histórico</h2>
          <div className="space-y-4">
            {historico.map((item) => (
              <div key={item.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-blue-400 font-medium">P: {item.pergunta}</p>
                <p className="text-gray-300 mt-2 text-sm">
                  <span className="text-gray-500 font-bold">R:</span> {item.resposta}
                </p>
                <span className="text-[10px] text-gray-600 mt-2 block">
                  {new Date(item.created_at).toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}