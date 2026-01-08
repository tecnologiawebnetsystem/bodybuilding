# FitTracker - Sistema Completo de Academia

Sistema personalizado de acompanhamento de treinos, corrida, nutrição e progresso físico.

## 🎯 Funcionalidades

### ✅ Sistema de Login
- Login por PIN (6 dígitos)
- Perfis separados: Kleber (080754) e Pamela (191018)
- Interface descontraída e vibrante

### ✅ Perfis Personalizados
**Kleber Gonçalves**
- Objetivo: 93kg → 78kg com massa magra
- Foco: Peito firme, pernas fortes, ombros largos, barriga de chopp
- Cores: Laranja/Roxo/Azul

**Pamela Gonçalves**
- Objetivo: 78kg → 70kg com massa magra
- Foco: Glúteos firmes e empinados, abdômen pós-gravidez, pernas lindas
- Cores: Rosa/Pink/Coral

### ✅ Sistema de Check-in
- Check-in global diário (não por treino individual)
- Menu dedicado para check-in de treino e corrida
- Estatísticas mensais e semanais
- Visualização de performance e dias treinados
- **Tudo gravado no banco de dados Neon**

### ✅ Treinos Personalizados
- **Treino A, B, C** específicos para cada objetivo
- Esteira 10min antes + 15min depois
- Kleber: Mais exercícios para peito e pernas
- Pamela: Foco total em glúteos e pernas
- **Treinos salvos no banco de dados**

### ✅ Plano de Corrida Progressivo
- Progressão gradual de distância
- Programa de 8 semanas
- Acompanhamento de distância e tempo
- **Check-in de corrida gravado no banco**

### ✅ Nutrição e Suplementação
- Plano alimentar personalizado
- Suplementação para perda de peso e ganho de massa
- Pamela: Suplementos para libido (Maca Peruana, Tribulus)
- **Logs de suplementos no banco de dados**

### ✅ Acompanhamento de Peso
- Registro de peso com datas
- Gráfico de progresso
- Cálculo automático de IMC
- **Histórico completo no banco de dados**

### ✅ Sistema de Progressão (A cada 3 meses)
- Ciclos de treino automatizados
- Aumento automático de dificuldade
- Alertas 7 dias antes do fim do ciclo
- **Controle de progressão no banco de dados**

### ✅ PWA - Instalável em Android
- Manifest.json configurado
- Ícones 192x192 e 512x512
- Instalável em tablets e celulares
- Modo standalone (funciona como app nativo)

## 🗄️ Banco de Dados Neon

Todas as funcionalidades integradas com PostgreSQL:

**Tabelas:**
- `users` - Dados dos usuários
- `weight_logs` - Histórico de peso
- `daily_checkins` - Check-ins de treino e corrida
- `workout_progressions` - Ciclos de treino a cada 3 meses
- `running_checkins` - Histórico de corridas
- `supplement_logs` - Logs de suplementação
- `nutrition_logs` - Logs de alimentação

**Scripts SQL:**
- `001-create-tables.sql` - Estrutura inicial
- `002-seed-users.sql` - Dados dos usuários
- `003-create-checkin-tables.sql` - Sistema de check-in

## 📱 Como Instalar no Android

1. Abra o app no navegador do celular/tablet
2. No Chrome: Menu → "Adicionar à tela inicial"
3. No Firefox: Menu → "Instalar"
4. O app será instalado como aplicativo nativo

## 🚀 Início do Projeto

**Data de início:** 06/01/2026

**Dias de treino:**
- Segunda, Terça, Quarta, Sexta, Sábado
- Descanso: Quinta e Domingo

**Corrida:** Todos os dias

## 🎨 Design

- Mobile-first (otimizado para celular)
- Cores vibrantes e claras para melhor visualização
- Temas personalizados por usuário
- Interface motivacional

## 🔐 Segurança

- Autenticação por PIN
- Dados isolados por usuário
- Banco de dados seguro Neon PostgreSQL
- APIs REST protegidas

---

**Desenvolvido para Kleber e Pamela Gonçalves - Jornada de Transformação 2026** 💪🔥
