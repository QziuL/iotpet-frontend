# IoPet — Instruções para desenvolvimento de aplicativo React Native

## 1. Visão geral

Desenvolver um aplicativo mobile chamado **IoPet**, em **React Native**, para Android e iOS, que se conecta ao protótipo IoT do projeto e exibe, em tempo real ou quase em tempo real, a localização de um animal de estimação, seu histórico de rastreamento, alertas de geofencing, status do dispositivo e dados cadastrais do pet e do tutor.

O aplicativo deve seguir o conceito visual de referência: **tema dark tech**, estética premium, cantos arredondados, contraste alto, brilho sutil em tons roxos/violetas, cartões translúcidos, ícones lineares e composição limpa com aparência futurista.

Paleta de cores: Roxo vibrante (#2205E + variações), com destaque em tons lilás e ciano, backgrounds muito escuros (quase preto)

Layouts: Cards com borda sutil, ícones lineares bem definidos, uso forte de espaço em branco e alinhamento limpo

Componentes específicos: Bottom tab bar com "+" central destacado, header com foto do pet, cards com informações em grid, mapa com polígono geofencing em roxo

Telas principais: Splash com logo e paw, Login/Cadastro simples, Dashboard com resumo do pet, Rastreamento em mapa, Geofencing com editor visual, Alertas com filtros, Perfil do Pet completo, Perfil do Tutor completo, Configurações

Na raiz do projeto há um arquivo chamado "Telas-Demo.png" que contém uma demonstração das telas do aplicativo.

---

## 2. Objetivo do produto

O IoPet deve permitir que o tutor:

- crie conta e faça login;
- cadastre um ou mais pets;
- vincule um dispositivo IoT ao pet;
- visualize a posição atual do pet em mapa;
- consulte histórico de rotas e últimas coordenadas;
- configure cerca virtual (geofencing);
- receba alertas de fuga, bateria baixa e reconexão;
- gerencie perfil, preferências e dispositivos vinculados.

---

## 3. Diretrizes visuais

### 3.1 Tema e estilo
- Usar **modo escuro como padrão**.
- Paleta principal baseada em roxo, violeta, azul escuro e cinza grafite.
- A interface deve parecer moderna, tecnológica e confiável.
- Evitar aparência “genérica de app pronto”.
- Usar sombras suaves, gradientes discretos e bordas com brilho leve.

### 3.2 Cores sugeridas
- Fundo principal: quase preto / grafite.
- Superfícies: cinza escuro com transparência leve.
- Cor primária: roxo/violeta vibrante.
- Cor secundária: lilás, azul elétrico ou ciano suave.
- Estados:
  - sucesso: verde suave;
  - alerta: laranja/amarelo;
  - erro: vermelho controlado;
  - offline: cinza.

### 3.3 Tipografia
- Usar fonte moderna, legível e com boa presença em telas pequenas.
- Hierarquia clara:
  - títulos grandes e fortes;
  - subtítulos médios;
  - textos de apoio menores e discretos.
- Preservar legibilidade em telas escuras.

### 3.4 Ícones e elementos
- Ícones lineares, minimalistas, com acabamento futurista.
- Utilizar ícones para mapa, pets, alertas, dispositivo, configurações e geofencing.
- Os botões principais devem ter destaque visual claro.

---

## 4. Stack recomendada

### 4.1 Frontend mobile
- React Native
- TypeScript
- Expo ou React Native CLI, conforme decisão do desenvolvedor
- React Navigation
- Axios ou fetch
- Reanimated, se necessário, para animações leves
- Map SDK compatível com Android e iOS

### 4.2 Estado e dados
- React Query ou Zustand, conforme a arquitetura definida
- Persistência local para sessão e dados temporários
- Cache de localização e histórico recente
- Usar Context API para estado global (sessão, pets ativos, configurações)
- **Nota:** O backend ainda não foi criado, então o aplicativo deve usar dados mockados para todas as funcionalidades.
- **Nota:** O aplicativo deve ser responsivo e funcionar em diferentes tamanhos de tela.
- **Nota:** Será usado Supabase para armazenagem dos dados

### 4.3 Comunicação
- REST para cadastros, autenticação e histórico
- MQTT ou WebSocket para atualizações em tempo real, se a arquitetura do backend fornecer
- Push notifications para alertas

### 4.4 Integrações possíveis
- API do backend
- Mapa com marcador do pet e polígono do geofencing
- Notificações locais/push
- Upload de foto de perfil e foto do pet
- Google Maps para exibição do mapa

---

## 5. Telas do aplicativo

As telas devem seguir a imagem de referência enviada na conversa.

### 5.1 Splash / abertura
- Logo IoPet em destaque.
- Fundo escuro com efeito tecnológico.
- Elementos visuais com brilho roxo.
- Frase curta de posicionamento do produto.

### 5.2 Login
- Campos: e-mail e senha.
- Botão principal de entrar.
- Link para recuperação de senha.
- CTA para criar nova conta.

### 5.3 Cadastro de conta
- Nome completo
- E-mail
- Senha
- Confirmar senha
- Foto de perfil opcional
- Botão de cadastro

### 5.4 Dashboard / Home
- Saudação ao tutor.
- Cartão principal com resumo do pet.
- Indicação de status online/offline.
- Bateria do dispositivo.
- Ações rápidas:
  - ver no mapa
  - cerca virtual
  - histórico
  - alertas
- Resumo da última localização.

### 5.5 Cadastro de pet
- Foto do pet
- Nome
- Espécie
- Raça
- Porte
- Descrição
- Botão salvar

### 5.6 Rastreamento em tempo real
- Mapa em destaque.
- Marcador do pet.
- Linha/rota do deslocamento.
- Card com endereço ou coordenadas.
- Botão de atualizar localização.
- Exibir precisão estimada, quando disponível.

### 5.7 Cerca virtual
- Exibir polígono no mapa.
- Permitir adicionar, mover e remover pontos.
- Definir nome da cerca.
- Ativar/desativar geofencing.
- Salvar alterações.

### 5.8 Alertas
- Lista de eventos:
  - fuga detectada;
  - pet voltou para área segura;
  - dispositivo reconectado;
  - bateria baixa.
- Filtros por tipo de alerta.
- Data e hora de cada evento.

### 5.9 Perfil do pet
- Foto grande do pet.
- Status do dispositivo.
- Dados principais do pet.
- Última localização.
- Acesso às ações relacionadas ao pet.

### 5.9.1 Lista de Pets
- Lista de todos os pets do tutor.
- Cada pet deve ter um card com as seguintes informações:
  - nome do pet
  - foto do pet
  - status do dispositivo
  - última localização
- Botão de adicionar pet.

### 5.9.2 Vínculo de Dispositivo
- Tela para vincular dispositivo IoT ao pet.
- Campos:
  - código do dispositivo
  - chave de vínculo
- Botão de vincular.

### 5.9.3 Perfil do Tutor
- Foto do tutor
- Nome
- E-mail
- Botão de editar
- Botão de salvar

### 5.10 Configurações
- Perfil do tutor
- Alterar senha
- Gerenciar dispositivos
- Notificações
- Unidade de medida
- Ajuda
- Sobre o app
- Sair da conta

---

## 6. Componentes reutilizáveis

Criar componentes reutilizáveis para manter consistência:

- AppHeader
- BottomTabBar
- PrimaryButton
- SecondaryButton
- InputField
- PasswordField
- CardInfo
- PetSummaryCard
- DeviceStatusCard
- LocationMapCard
- AlertItem
- EmptyState
- LoadingState
- SectionTitle
- ProfileAvatar
- GlowIconButton
- ToggleSwitchCard

---

## 7. Requisitos funcionais do app

O desenvolvimento deve contemplar os seguintes comportamentos:

1. autenticação de usuário;
2. cadastro e edição de tutor;
3. cadastro e edição de pet;
4. vínculo de dispositivo IoT ao pet;
5. leitura da localização enviada pelo protótipo;
6. exibição em mapa;
7. histórico de coordenadas;
8. criação de cerca virtual;
9. disparo de alertas quando o pet sair da área definida;
10. visualização do status da bateria e conexão do dispositivo;
11. gerenciamento de múltiplos pets na mesma conta;
12. logout e proteção de sessão.

---

## 8. Requisitos não funcionais

O app deve atender aos seguintes pontos:

- interface fluida e responsiva;
- compatibilidade com Android e iOS;
- navegação intuitiva;
- consumo moderado de recursos;
- segurança no armazenamento de tokens;
- tratamento de estados offline;
- mensagens de erro claras;
- arquitetura organizada e escalável;
- código legível e bem comentado quando necessário.

---

## 9. Dados vindos do protótipo IoT

O protótipo IoT deve fornecer, no mínimo:

- identificador do dispositivo;
- identificador do pet;
- latitude;
- longitude;
- data e hora da leitura;
- status da bateria;
- status da conexão;
- precisão estimada;
- evento de cerca virtual;
- evento de alerta.

Exemplo de estrutura de payload:

```json
{
  "deviceId": "IOPET-001",
  "petId": "PET-123",
  "timestamp": "2026-06-05T12:00:00Z",
  "latitude": -25.514,
  "longitude": -48.522,
  "battery": 87,
  "signalStatus": "online",
  "precision": 12,
  "eventType": "location_update"
}
```

---

## 10. Contrato de integração

A IA deve presumir uma API backend com recursos como:

- `POST /auth/login`
- `POST /auth/register`
- `POST /pets`
- `POST /devices/link`
- `POST /geofencing`

- `GET /pets`
- `GET /devices`
- `GET /tracking/latest/{petId}`
- `GET /tracking/history/{petId}`
- `GET /alerts`
- `GET /profile`

- `PUT /pets/{id}`
- `PUT /profile`

Se a API não existir ainda, o projeto deve ser estruturado com mocks e interfaces para facilitar a integração futura.

---

## 11. Navegação sugerida

Fluxo principal:

1. Splash
2. Login
3. Cadastro
4. Dashboard
5. Tela do pet
6. Tela de mapa
7. Tela de cerca virtual
8. Alertas
9. Configurações
10. Tela do tutor
11. Tela de vínculos

A navegação deve ser simples, com acesso rápido às telas mais importantes. A barra inferior pode conter:
- Início
- Mapa
- Adicionar
- Alertas
- Perfil

---

## 12. Estados da interface

A IA deve implementar os seguintes estados visuais:

- carregando;
- vazio;
- offline;
- erro de conexão;
- sucesso;
- alerta crítico;
- alerta de bateria baixa;
- dispositivo sem localização;
- sem pets cadastrados.

Cada estado deve ter feedback visual claro e coerente com o tema dark tech.

---

## 13. Geofencing

A cerca virtual deve:

- permitir desenho de área no mapa;
- armazenar os pontos do polígono;
- exibir bordas com destaque visual;
- disparar alerta quando o pet sair da área definida;
- permitir editar e excluir a cerca;
- mostrar status ativo/inativo.

---

## 14. Alertas e notificações

O aplicativo deve suportar:

- push notification para fuga;
- push notification para bateria baixa;
- push notification para reconexão do dispositivo;
- visualização dos alertas dentro do app;
- agrupamento por tipo e data.

As notificações devem ser objetivas e diretas.

---

## 15. Banco de dados local e persistência

O projeto pode usar armazenamento local para:
- token de autenticação;
- preferências do usuário;
- cache de última localização;
- sessão ativa.

Se necessário, utilizar:
- AsyncStorage para dados simples;
- SecureStore ou Keychain/Keystore para credenciais sensíveis.

---

## 16. Organização do projeto

Estrutura sugerida:

```txt
src/
  assets/
  components/
  screens/
  navigation/
  services/
  hooks/
  store/
  context/
  utils/
  constants/
  types/
  theme/
```

Boas práticas:
- separar lógica de interface da lógica de negócio;
- manter componentes pequenos;
- centralizar cores e estilos;
- criar tipagens para todas as respostas da API;
- evitar repetição de código.

---

## 17. Instruções para gerar o código

A IA responsável pelo projeto deve:

- priorizar código limpo e reutilizável;
- seguir TypeScript;
- criar telas com aparência fiel à referência visual;
- manter consistência entre componentes;
- adaptar o layout para diferentes tamanhos de tela;
- usar animações leves apenas quando agregarem valor;
- documentar o que for importante para manutenção;
- criar mocks quando o backend não estiver pronto;
- garantir que o design seja utilizável em produção.

---

## 18. Critérios de aceite

O projeto será considerado adequado quando:

- o usuário conseguir criar conta e fazer login;
- conseguir cadastrar um pet;
- visualizar a localização do pet no mapa;
- configurar a cerca virtual;
- receber e listar alertas;
- visualizar status do dispositivo;
- perceber claramente o estilo dark tech da interface;
- o app estiver preparado para integrar os dados do protótipo IoT.

---

## 19. Observações finais

O aplicativo IoPet deve transmitir a ideia de tecnologia aplicada ao cuidado e à segurança do pet. A interface não deve parecer apenas um rastreador genérico; ela deve parecer um sistema completo de monitoramento, com identidade visual forte, sensação de confiabilidade e foco na experiência do tutor.

A imagem de referência enviada na conversa deve ser usada como guia principal de composição visual, organização das telas e linguagem estética.

