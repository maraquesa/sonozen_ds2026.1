const axios = require("axios");     // importação da biblioteca Axios para requisições HTTP

(async () => {
  try {
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-3-4b-it:free",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Explique em poucas palavras a importancia de uma rotina do sono" },
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer <API_KEY>"  // ADICIONE SUA CHAVE!!
        }
      }
    );
    const m = response.data.choices[0].message.content;
    console.log('Status:',response.status);  // utilizando response.data é possível coletar mais informações, como a quantidade de tokens
    console.log(m);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
})();