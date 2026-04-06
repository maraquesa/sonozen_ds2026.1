"use client"; // Precisamos de interação aqui
import { useState } from "react";
import { perguntarParaIA } from "./actions";

export default function PaginaIA() {
  const [input, setInput] = useState("");
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    setCarregando(true);
    const texto = await perguntarParaIA(input);
    setResposta(texto);
    setCarregando(false);
  }

  return (
    <main className="p-10 flex flex-col gap-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Teste Gemini AI - Sonozen</h1>
      
      <textarea 
        className="border p-2 text-black rounded"
        placeholder="Digite sua pergunta..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button 
        onClick={enviar}
        disabled={carregando}
        className="bg-green-600 text-white p-2 rounded disabled:bg-gray-400"
      >
        {carregando ? "Pensando..." : "Perguntar para a IA"}
      </button>

      {resposta && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-black shadow">
          <h2 className="font-bold mb-2">Resposta:</h2>
          <p>{resposta}</p>
        </div>
      )}
    </main>
  );
}