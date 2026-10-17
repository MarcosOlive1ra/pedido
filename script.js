const btnSim = document.getElementById('btnSim');
const btnNao = document.getElementById('btnNao');
const pergunta = document.getElementById('pergunta');
const resposta = document.getElementById('resposta');
const heartsBg = document.getElementById('heartsBg');
const morcegos = document.getElementById('morcegos');

const emojis = ['🖤', '❤️', '🥀', '🖤', '💜', '❤️‍🔥'];

// Cria um coração subindo no fundo
function criarCoracao(tamanhoMax = 26) {
  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.fontSize = 14 + Math.random() * tamanhoMax + 'px';
  heart.style.animationDuration = 5 + Math.random() * 4 + 's';
  heartsBg.appendChild(heart);
  setTimeout(() => heart.remove(), 9000);
}

// Cria um morceguinho atravessando a tela
function criarMorcego(tamanhoMax = 22) {
  const morcego = document.createElement('div');
  morcego.className = 'morcego' + (Math.random() < 0.5 ? ' invertido' : '');
  morcego.innerHTML = '<span>🦇</span>';
  morcego.style.top = 5 + Math.random() * 70 + 'vh';
  morcego.style.fontSize = 18 + Math.random() * tamanhoMax + 'px';
  const duracao = 6 + Math.random() * 6;
  morcego.style.animationDuration = duracao + 's';
  morcegos.appendChild(morcego);
  setTimeout(() => morcego.remove(), duracao * 1000);
}

let intervaloCoracoes = setInterval(criarCoracao, 600);
let intervaloMorcegos = setInterval(criarMorcego, 1500);
criarMorcego();
criarMorcego();

// Botão NÃO foge do cursor/dedo
const frases = ['NÃO 💀', 'Tem certeza? 🥀', 'Nem pensar! 🦇', 'Impossível ⚰️', 'Errou! 😈', 'Tenta de novo 🕸️'];
let tentativas = 0;

let mouseX = -1000;
let mouseY = -1000;

function fugir(e) {
  if (e && e.cancelable) e.preventDefault();

  const margem = 20;
  const largura = btnNao.offsetWidth;
  const altura = btnNao.offsetHeight;
  const maxX = window.innerWidth - largura - margem;
  const maxY = window.innerHeight - altura - margem;

  // Na primeira fuga, tira o botão de dentro do cartão e coloca direto no body.
  // O cartão usa backdrop-filter, que "prende" elementos position:fixed dentro
  // dele — por isso o botão não se movia direito pela tela.
  if (!btnNao.classList.contains('fugindo')) {
    const rect = btnNao.getBoundingClientRect();
    const espaco = document.createElement('div');
    espaco.style.width = largura + 'px';
    espaco.style.height = altura + 'px';
    btnNao.replaceWith(espaco);
    document.body.appendChild(btnNao);
    btnNao.style.left = rect.left + 'px';
    btnNao.style.top = rect.top + 'px';
    btnNao.classList.add('fugindo');
    void btnNao.offsetWidth; // força reflow para a transição funcionar
  }

  // Sorteia uma nova posição longe do cursor
  let x, y, tentativa = 0;
  do {
    x = margem + Math.random() * (maxX - margem);
    y = margem + Math.random() * (maxY - margem);
    tentativa++;
  } while (Math.hypot(x + largura / 2 - mouseX, y + altura / 2 - mouseY) < 200 && tentativa < 30);

  btnNao.style.left = x + 'px';
  btnNao.style.top = y + 'px';

  tentativas++;
  btnNao.textContent = frases[tentativas % frases.length];

  // O SIM vai ficando maior a cada tentativa
  const escala = Math.min(1 + tentativas * 0.08, 1.8);
  btnSim.style.transform = `scale(${escala})`;
}

// Foge assim que o mouse chega perto, antes mesmo de encostar
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (btnNao.style.display === 'none') return;
  const rect = btnNao.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  if (Math.hypot(cx - mouseX, cy - mouseY) < 90) fugir();
});

btnNao.addEventListener('mouseenter', fugir);
btnNao.addEventListener('touchstart', fugir, { passive: false });
btnNao.addEventListener('click', fugir);

// Envia um e-mail avisando que ela disse SIM (via FormSubmit)
const URL_AVISO = 'https://formsubmit.co/ajax/marcos.fernando.o@hotmail.com';
let avisoEnviado = false;

function enviarAviso() {
  if (avisoEnviado) return;
  avisoEnviado = true;
  fetch(URL_AVISO, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: '🖤🦇 ELA DISSE SIM! 🦇🖤',
      _template: 'table',
      mensagem: 'Ela clicou em SIM no seu convite! Parabéns, agora vocês estão namorando! 🥀',
      tentativas_de_clicar_no_nao: tentativas,
      data_hora: new Date().toLocaleString('pt-BR'),
      dispositivo: navigator.userAgent
    }),
    keepalive: true
  }).catch(() => {});
}

// Botão SIM mostra a mensagem
btnSim.addEventListener('click', () => {
  enviarAviso();
  pergunta.classList.add('escondido');
  btnNao.style.display = 'none';
  resposta.classList.remove('escondido');
  resposta.classList.add('mostrar');

  // Revoada de morcegos e chuva de corações!
  clearInterval(intervaloCoracoes);
  clearInterval(intervaloMorcegos);
  for (let i = 0; i < 50; i++) {
    setTimeout(() => criarCoracao(36), i * 60);
  }
  for (let i = 0; i < 15; i++) {
    setTimeout(() => criarMorcego(30), i * 150);
  }
  intervaloCoracoes = setInterval(() => criarCoracao(36), 200);
  intervaloMorcegos = setInterval(() => criarMorcego(26), 700);
});
