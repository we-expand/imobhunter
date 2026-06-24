# 🔧 Guia de Manutenção - Centro de RGPD

## 📋 Como Atualizar o Score de Conformidade

### Localização
```typescript
// Arquivo: /components/gdpr-compliance.tsx
// Linha: ~32-45

useEffect(() => {
  let current = 0;
  const target = 42; // ← MUDAR AQUI
  const interval = setInterval(() => {
    if (current < target) {
      current += 1;
      setComplianceScore(current);
    } else {
      clearInterval(interval);
    }
  }, 20);
  return () => clearInterval(interval);
}, []);
```

### Passo a Passo
1. Abra `/components/gdpr-compliance.tsx`
2. Procure por `const target = 42`
3. Altere o número (ex: `const target = 65`)
4. Salve o arquivo
5. O score será animado automaticamente

### Cálculo do Score
```
Score = (Implementações + Docs + Segurança) / 3

Implementações: 6/14 = 43%
Documentação: 2/8 = 25%
Segurança: 4/6 = 67%

Score Total: (43 + 25 + 67) / 3 = 45%
```

---

## ➕ Como Adicionar Nova Implementação

### 1. Atualizar Tab "Visão Geral"

```typescript
// Arquivo: /components/gdpr-compliance.tsx
// Procure por: TabsContent value="overview"

// Adicionar em "Implementado" (linha ~214)
{
  icon: NovoIcone,
  text: 'Nova funcionalidade implementada',
  color: 'text-green-600'
}

// OU adicionar em "Pendente" (linha ~244)
{
  icon: NovoIcone,
  text: 'Nova funcionalidade pendente',
  priority: 'Alta', // ou 'Média'
  color: 'text-red-600' // ou 'text-orange-600'
}
```

### 2. Atualizar Contadores

```typescript
// Linha ~86-88
<span className="font-medium">7/14</span> // Era 6/14
```

### 3. Atualizar Progresso

```typescript
// Linha ~91
<Progress value={50} className="h-2" /> // Era 43
```

---

## 📄 Como Adicionar Novo Documento Legal

### Localização
```typescript
// Arquivo: /components/gdpr-compliance.tsx
// TabsContent value="docs"
// Linha ~635-700
```

### Template
```typescript
{
  title: 'Nome do Documento',
  status: 'Pendente', // ou 'Rascunho' ou 'Disponível'
  progress: 0, // 0-100
  required: true, // ou false
  action: () => toast.info('Mensagem'),
  color: 'red' // ou 'yellow' ou 'green'
}
```

### Exemplo Real
```typescript
{
  title: 'Código de Conduta Interno',
  status: 'Rascunho',
  progress: 40,
  required: false,
  action: () => window.open('/docs/codigo-conduta.pdf', '_blank'),
  color: 'yellow'
}
```

---

## 🌍 Como Adicionar Nova API

### Localização
```typescript
// Arquivo: /components/gdpr-compliance.tsx
// TabsContent value="apis"
// Linha ~535-590
```

### Template
```typescript
{
  name: 'Nome da API',
  purpose: 'Descrição do serviço',
  location: '🇺🇸 Estados Unidos', // ou 🇪🇺 União Europeia
  status: 'Ativo', // ou 'Inativo'
  safeguards: 'SCC + DPF', // ou apenas 'SCC' ou 'RGPD Nativo'
  risk: 'Médio' // ou 'Baixo' ou 'Alto'
}
```

### Exemplo Real
```typescript
{
  name: 'Twilio',
  purpose: 'Envio de SMS e mensagens WhatsApp',
  location: '🇺🇸 Estados Unidos',
  status: 'Ativo',
  safeguards: 'SCC + DPF',
  risk: 'Baixo'
}
```

---

## 👥 Como Adicionar Novo Direito RGPD

### Localização
```typescript
// Arquivo: /components/gdpr-compliance.tsx
// TabsContent value="rights"
// Linha ~380-440
```

### Template
```typescript
{
  icon: IconeDoLucide,
  title: 'Nome do Direito',
  article: 'Art. XXº',
  desc: 'Descrição clara do direito',
  action: 'Texto do botão',
  color: 'blue' // ou outra cor da paleta
}
```

### Exemplo Real
```typescript
{
  icon: Shield,
  title: 'Direito de Não Ser Sujeito a Decisões Automatizadas',
  article: 'Art. 22º',
  desc: 'Não ser sujeito a decisões baseadas unicamente em tratamento automatizado',
  action: 'Exercer Direito',
  color: 'indigo'
}
```

---

## 🔍 Como Adicionar Log de Auditoria

### Manualmente
```typescript
// Arquivo: /components/gdpr-compliance.tsx
// Função: generateAuditLogs()
// Linha ~63-90

const logs: AuditLog[] = [
  ...logsExistentes,
  {
    id: 'novo-id',
    timestamp: new Date(),
    action: 'Tipo de Ação',
    dataType: 'Tipo de Dado',
    user: 'email@exemplo.pt',
    details: 'Descrição detalhada'
  }
];
```

### Automaticamente (Futura Implementação)
```typescript
// Criar função utilitária
export function logAudit(
  action: string,
  dataType: string,
  user: string,
  details: string
) {
  const log = {
    id: Date.now().toString(),
    timestamp: new Date(),
    action,
    dataType,
    user,
    details
  };
  
  // Salvar no localStorage ou backend
  const logs = JSON.parse(localStorage.getItem('audit-logs') || '[]');
  logs.unshift(log);
  localStorage.setItem('audit-logs', JSON.stringify(logs.slice(0, 100)));
}

// Usar em qualquer lugar
logAudit(
  'Exportação de Dados',
  'Leads',
  'admin@kw.pt',
  '50 registos exportados'
);
```

---

## 🎨 Como Alterar Cores

### Paleta Atual
```typescript
// Localização: Várias linhas no arquivo

const cores = {
  azul: '#3B82F6',      // Privacidade, Segurança
  roxo: '#8B5CF6',      // Conformidade, Legal
  verde: '#10B981',     // OK, Implementado
  laranja: '#F59E0B',   // Avisos
  vermelho: '#EF4444',  // Crítico
  cinza: '#6B7280'      // Neutra
};
```

### Como Alterar
1. Procure pela cor no código (ex: `text-blue-600`)
2. Substitua pela nova cor (ex: `text-purple-600`)
3. Mantenha consistência visual

### Classes Tailwind Comuns
```css
/* Texto */
text-blue-600
text-purple-600
text-green-600

/* Background */
bg-blue-50
bg-purple-100
bg-green-500

/* Borda */
border-blue-200
border-l-4 border-l-green-500

/* Gradiente */
bg-gradient-to-r from-blue-600 to-purple-600
```

---

## 📊 Como Atualizar Estatísticas de Auditoria

### Localização
```typescript
// Arquivo: /components/gdpr-compliance.tsx
// TabsContent value="audit"
// Linha ~455-465
```

### Atualizar Números
```typescript
{[
  { label: 'Acessos Hoje', value: '47', icon: Eye, color: 'blue' },
  { label: 'Exportações', value: '12', icon: Download, color: 'green' },
  { label: 'Modificações', value: '8', icon: FileText, color: 'purple' },
  { label: 'Apagamentos', value: '3', icon: Trash2, color: 'red' }
]}
```

### Tornar Dinâmico (Futura Implementação)
```typescript
const [stats, setStats] = useState({
  acessos: 0,
  exportacoes: 0,
  modificacoes: 0,
  apagamentos: 0
});

useEffect(() => {
  // Calcular do localStorage ou backend
  const logs = JSON.parse(localStorage.getItem('audit-logs') || '[]');
  const hoje = new Date().toDateString();
  
  setStats({
    acessos: logs.filter(l => 
      l.action.includes('Acesso') && 
      new Date(l.timestamp).toDateString() === hoje
    ).length,
    // ... similar para outros
  });
}, []);
```

---

## 🔄 Como Atualizar Roteiro de Conformidade

### Localização
```typescript
// Arquivo: /components/gdpr-compliance.tsx
// TabsContent value="overview"
// Linha ~268-300
```

### Adicionar Novo Passo
```typescript
{ 
  step: 9, 
  title: 'Novo passo importante', 
  time: '2 semanas', 
  cost: '€1.000' 
}
```

### Remover Passo Concluído
Simplesmente apague o objeto do array ou mude o título:
```typescript
{ 
  step: 1, 
  title: '✅ Advogado consultado', // Adicione ✅
  time: 'Concluído', 
  cost: '€3.000' 
}
```

---

## 📧 Como Alterar Email de Contacto

### Procurar e Substituir
```bash
# Procure por todas as ocorrências
privacidade@kw-portugal.pt

# Substitua por
seu-novo-email@exemplo.pt
```

### Localizações
1. Linha ~284 (Tab Direitos)
2. Linha ~707 (Tab Documentação)
3. Linha ~750 (Contactos)
4. Linha ~855 (Modal Exercício de Direitos)

---

## 🔧 Debugging e Troubleshooting

### Problema: Score não anima
```typescript
// Verificar se useEffect está rodando
useEffect(() => {
  console.log('🎯 Animando score...');
  // ... resto do código
}, []);
```

### Problema: Tabs não mudam
```typescript
// Verificar estado
const [activeTab, setActiveTab] = useState('overview');
console.log('📑 Tab ativa:', activeTab);
```

### Problema: Modal não abre
```typescript
// Verificar estado
const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
console.log('🪟 Modal aberto?', showPrivacyPolicy);
```

### Problema: Cores não aparecem
```typescript
// Verificar se Tailwind reconhece as classes
// No terminal:
npm run dev

// Verificar no navegador:
// Inspecionar elemento → Classes aplicadas?
```

---

## 📱 Testes Responsivos

### Desktop (>1024px)
```
- Grid de 2-3 colunas
- Sidebar visível
- Tabs horizontais
```

### Tablet (768px-1024px)
```
- Grid de 2 colunas
- Sidebar colapsável
- Tabs horizontais
```

### Mobile (<768px)
```
- Single column
- Sidebar em menu
- Tabs empilhadas
```

### Teste Manual
1. Abra DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Teste em:
   - iPhone 12 (390px)
   - iPad (768px)
   - Desktop (1920px)

---

## 🔐 Boas Práticas de Manutenção

### ✅ Fazer
- Comentar código complexo
- Manter consistência visual
- Testar em mobile
- Validar TypeScript
- Usar nomes descritivos

### ❌ Evitar
- Hardcoded strings (usar constantes)
- Cores inline (usar Tailwind)
- Animações pesadas
- Mudanças sem backup
- Remover funcionalidades sem avisar

---

## 📊 Checklist de Atualização

Ao fazer mudanças, sempre verificar:

- [ ] Score de conformidade atualizado?
- [ ] Contadores ajustados?
- [ ] Barras de progresso corretas?
- [ ] Cores consistentes?
- [ ] Textos revisados?
- [ ] Links funcionando?
- [ ] Emails atualizados?
- [ ] Mobile responsivo?
- [ ] TypeScript sem erros?
- [ ] Documentação atualizada?

---

## 🔄 Versionamento

### Formato
```
v[Major].[Minor].[Patch]

v2.0.0 - Redesign completo (atual)
v2.1.0 - Novas funcionalidades
v2.1.1 - Correções de bugs
```

### Como Versionar
```typescript
// Adicione constante no topo do arquivo
const RGPD_VERSION = '2.0.0';
const LAST_UPDATE = '2025-12-14';

// Use em comentários ou interface
{/* Centro de RGPD v{RGPD_VERSION} */}
```

---

## 📞 Suporte

### Dúvidas Técnicas
- Consulte este guia primeiro
- Verifique os arquivos de documentação
- Inspecione o código comentado

### Dúvidas Legais
- 📧 privacidade@kw-portugal.pt
- 🏛️ CNPD Portugal
- 👨‍⚖️ Advogado especializado RGPD

---

## 🎯 Próximas Melhorias Sugeridas

### V2.1 - Funcionalidades
- [ ] Sistema de notificações push
- [ ] Exportação automática de relatórios
- [ ] Gráficos de evolução temporal
- [ ] Dashboard analytics avançado

### V2.2 - Integrações
- [ ] API para logs externos
- [ ] Webhook para eventos RGPD
- [ ] Sincronização com CRM
- [ ] Integração com email marketing

### V2.3 - IA e Automação
- [ ] Sugestões de conformidade com IA
- [ ] Auto-classificação de dados
- [ ] Detecção automática de riscos
- [ ] Chatbot de suporte RGPD

---

**💙 Mantenha este guia atualizado sempre que fizer modificações!**

**Última atualização:** 14 de Dezembro de 2025  
**Versão do guia:** 1.0  
**Autor:** Sistema de Documentação Automática
