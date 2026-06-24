#!/usr/bin/env python3
"""
Script de migração automática de projeto Supabase
De: nooknoilfqpfzujoddlp
Para: evdyqlrssgsktctjruuq
"""

import os
import re

# Configurações antigas e novas
OLD_PROJECT_ID = "nooknoilfqpfzujoddlp"
NEW_PROJECT_ID = "evdyqlrssgsktctjruuq"

OLD_URL = f"https://{OLD_PROJECT_ID}.supabase.co"
NEW_URL = f"https://{NEW_PROJECT_ID}.supabase.co"

OLD_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vb2tub2lsZnFwZnp1am9kZGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjA3NzcsImV4cCI6MjA4MTE5Njc3N30.wced3DsQJ9onkBLSP6rWmyuCHRuZc0emirIiekKt7ss"
NEW_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw"

# Arquivos para atualizar (excluindo arquivos de sistema)
FILES_TO_UPDATE = [
    "SUPABASE-SECRETS-SETUP.md",
    "SECRETS-CONFIG-COMPLETA.md",
    "COPIAR-E-COLAR-SECRETS.txt",
    "VISUAL-SECRETS-SUPABASE.md",
    "TROUBLESHOOTING-SERVIDOR.md",
    "DEPLOY-MANUAL-SUPABASE.md",
    "DEPLOY_BACKEND_INSTRUCTIONS.md",
    "DEBUG_BUSCA_AGORA.md",
    "RESUMO_CORRECOES_APLICADAS.md",
    "GUIA_DEPLOY_URGENTE.md",
    "DEPLOY_MANUAL_COMPLETO.md",
    "SOLUCAO_FINAL_SIMPLES.md",
    "TESTE_FUNCOES_AGORA.md",
    "TESTE_RAPIDO_BROWSER.html",
    "INSTRUCOES_FINAIS.md",
    "README_DEPLOY_URGENTE.md",
    "DEPLOY_VIA_TERMINAL.txt",
    "SERVER_CODE_FOR_MANUAL_DEPLOY.md",
    "deploy-server.sh",
    "deploy-server.ps1",
]

def migrate_file(filepath):
    """Migra um arquivo específico"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Substituir Project ID
        content = content.replace(OLD_PROJECT_ID, NEW_PROJECT_ID)
        
        # Substituir URL
        content = content.replace(OLD_URL, NEW_URL)
        
        # Substituir ANON Key (se encontrada)
        content = content.replace(OLD_ANON_KEY, NEW_ANON_KEY)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"❌ Erro em {filepath}: {e}")
        return False

def main():
    print("═" * 70)
    print("🚀 MIGRAÇÃO DE PROJETO SUPABASE")
    print("═" * 70)
    print(f"📤 Projeto antigo: {OLD_PROJECT_ID}")
    print(f"📥 Projeto novo:   {NEW_PROJECT_ID}")
    print("═" * 70)
    print()
    
    updated_count = 0
    skipped_count = 0
    
    for filename in FILES_TO_UPDATE:
        filepath = f"/{filename}"
        if os.path.exists(filepath):
            if migrate_file(filepath):
                print(f"✅ Atualizado: {filename}")
                updated_count += 1
            else:
                print(f"⏭️  Sem mudanças: {filename}")
                skipped_count += 1
        else:
            print(f"⚠️  Não encontrado: {filename}")
    
    print()
    print("═" * 70)
    print(f"📊 RESUMO:")
    print(f"   ✅ Arquivos atualizados: {updated_count}")
    print(f"   ⏭️  Arquivos sem mudanças: {skipped_count}")
    print("═" * 70)
    print()
    print("🎯 PRÓXIMOS PASSOS:")
    print("   1. Configure as secrets no novo projeto")
    print("   2. Faça deploy do servidor via CLI")
    print("   3. Teste a aplicação")
    print()

if __name__ == "__main__":
    main()
