"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Alterna entre Login e Cadastro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const emailLimpo = email.trim();

    if (isLogin) {
      // Lógica de LOGIN
      const { error } = await supabase.auth.signInWithPassword({
        email: emailLimpo,
        password,
      });
      if (error) alert("Erro ao entrar: " + error.message);
      else router.push("/"); // Vai para a home após logar
    } else {
      // Lógica de CADASTRO
      const { error } = await supabase.auth.signUp({
        email: emailLimpo,
        password,
      });
      if (error) alert("Erro ao cadastrar: " + error.message);
      else alert("Cadastro realizado! Tente fazer o login agora.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl space-y-6">
        
        {/* Logo/Título */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-blue-500">Sonozen AI</h1>
          <p className="text-gray-400 text-sm">
            {isLogin ? "Bem-vindo de volta!" : "Crie sua conta gratuita"}
          </p>
        </div>

        {/* Seletor de Abas */}
        <div className="flex bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              isLogin ? "bg-blue-600 text-white shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              !isLogin ? "bg-blue-600 text-white shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1">E-mail</label>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 transition transform active:scale-95 disabled:bg-gray-700 disabled:text-gray-500"
          >
            {loading ? "Processando..." : isLogin ? "Acessar Conta" : "Criar Conta"}
          </button>
        </form>

        {/* Rodapé do Form */}
        <p className="text-center text-xs text-gray-600">
          Ao continuar, você concorda com os termos de uso do Sonozen.
        </p>
      </div>
    </main>
  );
}