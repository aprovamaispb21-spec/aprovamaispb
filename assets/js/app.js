import { salvarInscricao, listarInscricoes, salvarProfessor, listarProfessores, autenticarProfessor } from "./firebase.js";
import { enviarEmail } from "./email.js";

function gerarSenha(tamanho = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: tamanho }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

// Matrícula
const form = document.getElementById("registration-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      cpf: document.getElementById("cpf").value,
      course: document.getElementById("course").value,
      numeroPedido: Math.floor(100000 + Math.random() * 900000),
      senha: gerarSenha(),
      criadoEm: new Date().toISOString()
    };
    try {
      await salvarInscricao(dados);
      await enviarEmail(dados);
      alert("✅ Inscrição concluída! Seus dados foram enviados para " + dados.email);
      form.reset();
      // Botão WhatsApp
      const msg = `Olá, meu nome é ${dados.name}.%0A
Me inscrevi no curso *${dados.course}*.%0A
Número do pedido: ${dados.numeroPedido}%0A
CPF: ${dados.cpf}%0A
Telefone: ${dados.phone}%0A
Gostaria de confirmar o pagamento da matrícula via WhatsApp.`;
      const numeroWhats = "5599999999999"; // coloque o número real aqui
      const url = `https://wa.me/${numeroWhats}?text=${msg}`;
      const container = document.querySelector(".actions");
      const btnWpp = document.createElement("a");
      btnWpp.href = url;
      btnWpp.target = "_blank";
      btnWpp.className = "btn-modern";
      btnWpp.textContent = "📲 Confirmar pagamento no WhatsApp";
      container.appendChild(btnWpp);
    } catch (err) {
      alert("❌ Erro ao salvar inscrição.");
      console.error(err);
    }
  });
}

// Admin login
const adminForm = document.getElementById('admin-login-form');
if(adminForm){
  adminForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const u = document.getElementById('admin-user').value;
    const p = document.getElementById('admin-pass').value;
    if(u === 'administrador' && p === '159753'){
      document.querySelector('.form-card.small').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      renderDashboard();
    } else {
      document.getElementById('admin-msg').textContent = 'Usuário ou senha incorretos.';
    }
  });
}

async function renderDashboard(){
  const inscricoes = await listarInscricoes();
  const tbody = document.querySelector('#inscricoes-table tbody');
  if(tbody){
    tbody.innerHTML = '';
    inscricoes.forEach(i=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i.name}</td><td>${i.email}</td><td>${i.course}</td><td>${i.cpf}</td><td>${new Date(i.criadoEm).toLocaleString()}</td>`;
      tbody.appendChild(tr);
    });
  }
  const profs = await listarProfessores();
  const ul = document.getElementById('prof-list');
  if(ul){
    ul.innerHTML = '';
    profs.forEach(p=>{
      const li = document.createElement('li');
      li.textContent = `${p.nome} — ${p.usuario} / ${p.senha}`;
      ul.appendChild(li);
    });
  }
  document.getElementById('gerar-prof')?.addEventListener('click', async ()=>{
    const nome = prompt('Nome do professor:');
    if(!nome) return;
    const usuario = nome.toLowerCase().split(' ')[0] + Math.floor(Math.random()*900+100);
    const senha = gerarSenha();
    await salvarProfessor({nome, usuario, senha});
    alert(`Professor criado: ${usuario} / ${senha}`);
    renderDashboard();
  });
}

// Professores login
const profForm = document.getElementById('prof-login-form');
if(profForm){
  profForm.addEventListener('submit', async e => {
    e.preventDefault();
    const u = document.getElementById('prof-user').value;
    const p = document.getElementById('prof-pass').value;
    const ok = await autenticarProfessor(u,p);
    const msg = document.getElementById('prof-msg');
    if(ok){
      msg.style.color = 'green';
      msg.textContent = 'Login bem-sucedido.';
      document.getElementById('prof-login-form').style.display = 'none';
      document.getElementById('prof-panel').style.display = 'block';
    } else {
      msg.style.color = 'crimson';
      msg.textContent = 'Usuário ou senha inválidos.';
    }
  });
}
