"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Função para CRIAR conta
  async function cadastrar() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Erro: " + error.message);
    else alert("Usuário criado! Verifique seu email (ou apenas tente logar se o Supabase permitir)");
  }

  // Função para ENTRAR
  async function logar() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Erro: " + error.message);
    else alert("Logado com sucesso! Usuário: " + data.user?.email);
  }

  return (
    <main className="p-10 flex flex-col gap-4 max-w-sm mx-auto text-black">
      <h1 className="text-xl font-bold text-white">Login Simples</h1>
      <input 
        type="email" placeholder="Email" className="p-2 rounded"
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" placeholder="Senha" className="p-2 rounded"
        onChange={(e) => setPassword(e.target.value)} 
      />
      
      <div className="flex gap-2">
        <button onClick={logar} className="bg-blue-500 text-white p-2 flex-1 rounded">Entrar</button>
        <button onClick={cadastrar} className="bg-green-500 text-white p-2 flex-1 rounded">Cadastrar</button>
      </div>
    </main>
  );
}