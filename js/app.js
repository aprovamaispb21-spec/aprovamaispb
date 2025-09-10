import {{ salvarInscricao }} from "../firebase.js";
import {{ enviarEmail }} from "../email.js";

function gerarSenha() {{
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let senha = '';
    for (let i = 0; i < 8; i++) {{
        senha += chars.charAt(Math.floor(Math.random() * chars.length));
    }}
    return senha;
}}

document.getElementById("registration-form").addEventListener("submit", async function(e) {{
    e.preventDefault();

    const senha = gerarSenha();
    const numeroPedido = Math.floor(100000 + Math.random() * 900000);

    const dados = {{
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        cpf: document.getElementById("cpf").value,
        course: document.getElementById("course").value,
        numeroPedido,
        senha,
        criadoEm: new Date().toISOString()
    }};

    try {{
        await salvarInscricao(dados);
        await enviarEmail(dados);
        alert(`✅ Inscrição concluída! Seus dados foram enviados para ${{dados.email}}`);
        document.getElementById("registration-form").reset();
    }} catch (err) {{
        alert("❌ Ocorreu um erro ao processar a inscrição. Tente novamente.");
    }}
}});
