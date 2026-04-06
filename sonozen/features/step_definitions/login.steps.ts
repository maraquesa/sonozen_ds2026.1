import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import assert from 'assert';

let browser: Browser;
let page: Page;
let mensagemAlerta = ""; // Variável para guardar o texto do alert()

Before(async () => {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();

  // O Playwright precisa ser avisado para interceptar alertas (window.alert)
  page.on('dialog', async dialog => {
    mensagemAlerta = dialog.message(); // Guarda a mensagem
    await dialog.accept(); // Clica em "OK" automaticamente
  });
});

After(async () => {
  mensagemAlerta = ""; // Limpa a mensagem para o próximo teste
  if (browser) {
    await browser.close();
  }
});

// --- CENÁRIO 1 E 2: NAVEGAÇÃO E LOGIN ---

Given('que eu estou na página de login', async function () {
  await page.goto('http://localhost:3000/login');
});

When('eu preencho o e-mail com {string} e a senha com {string}', async function (email, senha) {
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(senha);
});

// O (eu )? serve para aceitar tanto "E clico" quanto "E eu clico"
When(/^(?:eu )?clico no botão "([^"]*)"$/, async function (textoBotao) {
  await page.getByRole('button', { name: textoBotao }).click();
});

Then('eu devo ser redirecionado para a página inicial', async function () {
  await page.waitForURL('http://localhost:3000/');
  assert.strictEqual(page.url(), 'http://localhost:3000/');
});

Then('eu devo ver uma mensagem de erro', async function () {
  // Espera um segundo para dar tempo do Supabase responder e o alert aparecer
  await page.waitForTimeout(1000); 
  
  // Verifica se a mensagem salva não está vazia e contém a palavra "Erro"
  assert(mensagemAlerta.includes("Erro"), `Esperava um erro, mas recebeu: ${mensagemAlerta}`);
});


// --- CENÁRIO 3: LOGOUT ---

// No arquivo features/step_definitions/login.steps.ts, atualize o passo de Logout:

Given('que eu estou logado com o usuário {string} e a senha {string}', async function (email, senha) {
  // 1. Vai para a página de login
  await page.goto('http://localhost:3000/login');
  
  // 2. Preenche com os dados que vieram do arquivo .feature
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(senha);
  
  // 3. Clica para entrar
  await page.getByRole('button', { name: 'Acessar Conta' }).click();
  
  // 4. Aguarda chegar na home para garantir que o login funcionou e o botão renderizou
  await page.waitForURL('http://localhost:3000/');

  // 5. Comando para ele clicar no botão de logout "Sair"
  await page.getByRole('button', { name: 'Sair' }).click();

});

Then('eu devo ser redirecionado para a página de login', async function () {
  // Espera a página terminar de carregar a nova rota
  await page.waitForURL('http://localhost:3000/login');
  
  // Confirma se a URL atual é realmente a tela de login
  assert.strictEqual(page.url(), 'http://localhost:3000/login');
});