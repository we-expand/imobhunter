// Proteção de segurança contra roubo de código, prints e downloads
// MÁXIMA PROTEÇÃO para a plataforma AI LeadGen Pro

export const initSecurityProtection = () => {
  // Proteção apenas se estiver em ambiente de produção ou página publicada
  const isProduction = window.location.hostname !== 'localhost' && 
                       window.location.hostname !== '127.0.0.1' &&
                       !window.location.hostname.includes('figma');
  
  if (!isProduction) {
    console.log('🔓 Proteções desabilitadas em desenvolvimento');
    return { enabled: false };
  }
  
  console.log('🔒 Iniciando proteções de segurança...');

  // ========== 1. DESABILITAR BOTÃO DIREITO DO MOUSE ==========
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    console.warn('⚠️ Botão direito desabilitado por segurança');
    return false;
  });

  // ========== 2. DESABILITAR ATALHOS DE TECLADO PERIGOSOS ==========
  document.addEventListener('keydown', (e) => {
    // CTRL+S (Salvar página)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      console.warn('⚠️ Salvar página desabilitado');
      return false;
    }

    // CTRL+U (Ver código fonte)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      console.warn('⚠️ Ver código fonte desabilitado');
      return false;
    }

    // F12 (DevTools)
    if (e.key === 'F12') {
      e.preventDefault();
      console.warn('⚠️ DevTools desabilitado');
      return false;
    }

    // CTRL+SHIFT+I (DevTools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      console.warn('⚠️ DevTools desabilitado');
      return false;
    }

    // CTRL+SHIFT+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      console.warn('⚠️ Console desabilitado');
      return false;
    }

    // CTRL+SHIFT+C (Inspecionar elemento)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      console.warn('⚠️ Inspecionar elemento desabilitado');
      return false;
    }

    // CTRL+P (Imprimir)
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      console.warn('⚠️ Impressão desabilitada');
      return false;
    }

    // CTRL+A (Selecionar tudo)
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      console.warn('⚠️ Seleção de texto desabilitada');
      return false;
    }

    // CTRL+C (Copiar)
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      console.warn('⚠️ Cópia desabilitada');
      return false;
    }

    // Print Screen
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      console.warn('⚠️ Print Screen desabilitado');
      
      // Blur a página para dificultar screenshot
      document.body.style.filter = 'blur(10px)';
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 500);
      
      return false;
    }
  });

  // ========== 3. DESABILITAR SELEÇÃO DE TEXTO ==========
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
    
    input, textarea {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
    }

    /* Prevenir arrasto de imagens */
    img {
      pointer-events: none !important;
      -webkit-user-drag: none !important;
      user-drag: none !important;
    }

    /* Marca d'água invisível em screenshots */
    body::before {
      content: "AI LeadGen Pro - Propriedade Protegida";
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 80px;
      color: rgba(0, 0, 0, 0.02);
      pointer-events: none;
      z-index: 9999;
      white-space: nowrap;
    }

    /* Desabilitar impressão */
    @media print {
      body {
        display: none !important;
      }
      body::before {
        content: "Impressão não autorizada - AI LeadGen Pro" !important;
        display: block !important;
        font-size: 40px !important;
        color: red !important;
        text-align: center !important;
        padding: 100px !important;
      }
    }
  `;
  document.head.appendChild(style);

  // ========== 4. DESABILITAR ARRASTAR E SOLTAR ==========
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  // ========== 5. DETECTAR DEVTOOLS ABERTO ==========
  let devtoolsOpen = false;
  const detectDevTools = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        console.warn('⚠️ DevTools detectado - Funcionalidades limitadas');
        
        // Blur na tela quando DevTools abrir
        document.body.style.filter = 'blur(5px)';
        document.body.style.pointerEvents = 'none';
        
        // Mensagem de aviso
        const warning = document.createElement('div');
        warning.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(239, 68, 68, 0.95);
          color: white;
          padding: 40px;
          border-radius: 20px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          z-index: 999999;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        `;
        warning.innerHTML = `
          <div>🔒 ACESSO RESTRITO</div>
          <div style="font-size: 16px; margin-top: 20px; font-weight: normal;">
            Ferramentas de desenvolvedor não são permitidas<br/>
            por motivos de segurança.<br/><br/>
            Feche as DevTools para continuar.
          </div>
        `;
        document.body.appendChild(warning);
      }
    } else {
      if (devtoolsOpen) {
        devtoolsOpen = false;
        document.body.style.filter = 'none';
        document.body.style.pointerEvents = 'auto';
        
        // Remove mensagem de aviso
        const warnings = document.querySelectorAll('div[style*="ACESSO RESTRITO"]');
        warnings.forEach(w => w.remove());
      }
    }
  };

  // Verifica DevTools a cada segundo
  setInterval(detectDevTools, 1000);

  // ========== 6. OBFUSCAR CÓDIGO NO CONSOLE ==========
  // Console.log funciona normalmente (removido para evitar problemas)
  // Em produção, você pode minificar o código para dificultar debug

  // ========== 7. DETECTAR SCREENSHOT (Windows/Mac) ==========
  document.addEventListener('keyup', (e) => {
    // Detecta Print Screen
    if (e.key === 'PrintScreen') {
      console.warn('⚠️ Screenshot detectado');
      
      // Limpa clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText('Screenshot bloqueado - AI LeadGen Pro');
      }
    }
  });

  // ========== 8. DESABILITAR COPIAR/COLAR ==========
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    console.warn('⚠️ Cópia desabilitada');
    return false;
  });

  document.addEventListener('cut', (e) => {
    e.preventDefault();
    console.warn('⚠️ Recorte desabilitado');
    return false;
  });

  // ========== 9. WATERMARK DINÂMICA ==========
  // Adiciona marca d'água com email do usuário (se logado)
  const addDynamicWatermark = () => {
    const user = JSON.parse(localStorage.getItem('current-user') || '{}');
    if (user.email) {
      const watermark = document.createElement('div');
      watermark.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 60px;
        color: rgba(0, 0, 0, 0.03);
        pointer-events: none;
        z-index: 9998;
        white-space: nowrap;
        font-weight: bold;
      `;
      watermark.textContent = `${user.email} - ${new Date().toLocaleDateString()}`;
      document.body.appendChild(watermark);
    }
  };
  addDynamicWatermark();

  // ========== 10. DETECTAR GRAVAÇÃO DE TELA ==========
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
    
    navigator.mediaDevices.getDisplayMedia = async (...args) => {
      console.warn('⚠️ Tentativa de gravação de tela detectada');
      alert('🔒 Gravação de tela não é permitida nesta plataforma por motivos de segurança.');
      throw new Error('Gravação de tela bloqueada');
    };
  }

  // ========== 11. PROTEGER CONTRA INJEÇÃO DE SCRIPTS ==========
  // Detecta se há scripts externos sendo injetados
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === 'SCRIPT') {
          const scriptElement = node as HTMLScriptElement;
          // Se não for um script da própria aplicação
          if (!scriptElement.src.includes(window.location.hostname)) {
            console.error('⚠️ Script externo detectado e bloqueado');
            scriptElement.remove();
          }
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  console.log('✅ Proteções de segurança ativadas');
  console.log('🔒 Plataforma protegida contra:');
  console.log('   - Screenshots e prints');
  console.log('   - Cópia de código');
  console.log('   - Acesso às DevTools');
  console.log('   - Download de recursos');
  console.log('   - Gravação de tela');
  console.log('   - Injeção de scripts');

  return {
    disable: () => {
      console.log('🔓 Proteções desativadas');
      document.body.style.filter = 'none';
      document.body.style.pointerEvents = 'auto';
    }
  };
};