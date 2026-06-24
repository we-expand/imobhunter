// ═══════════════════════════════════════════════════════════════════════
// 🚨 EMERGENCY APP - Versão ultra-simples para debug
// ═══════════════════════════════════════════════════════════════════════

import React from 'react';

export default function App() {
  console.log('🚨 EMERGENCY APP CARREGADO!');
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '60px 40px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          margin: '0 auto 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px'
        }}>
          ⚡
        </div>
        
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          ImobHunter
        </h1>
        
        <p style={{
          fontSize: '20px',
          color: '#666',
          marginBottom: '40px'
        }}>
          Sistema de Lead Generation & Nurturing
        </p>

        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <div style={{ marginBottom: '15px', fontSize: '16px', color: '#333' }}>
            ✅ Sistema carregado com sucesso!
          </div>
          <div style={{ marginBottom: '15px', fontSize: '16px', color: '#333' }}>
            ✅ React funcionando
          </div>
          <div style={{ marginBottom: '15px', fontSize: '16px', color: '#333' }}>
            ✅ Estilos aplicados
          </div>
          <div style={{ fontSize: '16px', color: '#333' }}>
            ✅ Pronto para usar
          </div>
        </div>

        <button
          onClick={() => {
            console.log('🚀 Botão clicado!');
            alert('Sistema ImobHunter funcionando! ✅\n\nAgora vamos carregar a versão completa...');
            window.location.href = window.location.href;
          }}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          🚀 Teste - Clique Aqui
        </button>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffc107'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
            ⚠️ <strong>Modo Emergência Ativado</strong><br/>
            Esta é uma versão simplificada para debug
          </p>
        </div>

        <div style={{
          marginTop: '20px',
          fontSize: '12px',
          color: '#999'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#10b981',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            Sistema Operacional
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
