/**
 * Learning Trail Recommendations — Master Premium EdTech
 * Maps COPSOQ factor results → recommended learning content
 * 
 * Collaborators: Laurie Santos (Science of Well-Being) + TED
 * Managers/Admins: Work Wellbeing Playbook gamified trails (12 drivers)
 */

import type { FactorScore } from "./scoring";

export interface TrailVideo {
  id: string;
  platform: "youtube" | "ted";
  title: string;
  titlePt: string;
  summary: string;
  tags: string[];
  url: string;
  embedUrl: string;
  durationMin?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tags: string[];
}

export interface PracticeChallenge {
  id: string;
  title: string;
  description: string;
  type: "reflection" | "action" | "observation";
  xpReward: number;
}

export interface LearningModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  targetFactors: number[];
  level: "collaborator" | "manager" | "admin";
  videos: TrailVideo[];
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  practices: PracticeChallenge[];
  xpReward: number;
  estimatedMinutes: number;
  unlockCondition?: string;
}

/* ── Laurie Santos — Real embed URLs ────────────────────────────── */

const LS: TrailVideo[] = [
  { id: "LS-01", platform: "youtube", title: "Become Happier by Learning & Applying Psychological Science", titlePt: "Ficar mais feliz usando a ciência psicológica", summary: "Introdução à ideia de que felicidade é habilidade treinável.", tags: ["introdução", "ciência"], url: "https://www.youtube.com/watch?v=s-00jpvglb8", embedUrl: "https://www.youtube.com/embed/s-00jpvglb8?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 12 },
  { id: "LS-02", platform: "youtube", title: "Why This Course Exists", titlePt: "Por que este curso existe?", summary: "A crise de saúde mental e a necessidade da ciência do bem-estar.", tags: ["propósito", "introdução"], url: "https://www.youtube.com/watch?v=y5s3uunbnSQ", embedUrl: "https://www.youtube.com/embed/y5s3uunbnSQ?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 8 },
  { id: "LS-03", platform: "youtube", title: "What is the G.I. Joe Fallacy?", titlePt: "A Falácia do G.I. Joe", summary: "Saber não basta — é preciso praticar para mudar.", tags: ["comportamento", "mudança"], url: "https://www.youtube.com/watch?v=YslKo9KkNi4", embedUrl: "https://www.youtube.com/embed/YslKo9KkNi4?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 7 },
  { id: "LS-04", platform: "youtube", title: "What We Get Wrong About Happiness: A Good Job", titlePt: "O que erramos: um bom emprego", summary: "O emprego 'perfeito' não traz a felicidade esperada.", tags: ["trabalho", "expectativas"], url: "https://www.youtube.com/watch?v=A7jW_h6b6RM", embedUrl: "https://www.youtube.com/embed/A7jW_h6b6RM?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 9 },
  { id: "LS-05", platform: "youtube", title: "What We Get Wrong About Happiness: Money", titlePt: "O que erramos: dinheiro", summary: "Dinheiro ajuda até certo ponto, depois não.", tags: ["dinheiro", "expectativas"], url: "https://www.youtube.com/watch?v=ReN52M1gO4Q", embedUrl: "https://www.youtube.com/embed/ReN52M1gO4Q?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 10 },
  { id: "LS-06", platform: "youtube", title: "Awesome Stuff, True Love, Perfect Body & Good Grades", titlePt: "Coisas legais, amor, corpo perfeito e boas notas", summary: "Intuições erradas sobre fontes de felicidade.", tags: ["expectativas", "miswanting"], url: "https://www.youtube.com/watch?v=ScoBnbxg_JU", embedUrl: "https://www.youtube.com/embed/ScoBnbxg_JU?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 11 },
  { id: "LS-07", platform: "youtube", title: "Annoying Features of The Mind", titlePt: "Bugs irritantes da mente", summary: "Vieses cognitivos que atrapalham felicidade.", tags: ["cérebro", "viés"], url: "https://www.youtube.com/watch?v=ZI_Q5NGtSik", embedUrl: "https://www.youtube.com/embed/ZI_Q5NGtSik?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 14 },
  { id: "LS-09", platform: "youtube", title: "Miswanting: The Bias That's Sabotaging Your Happiness", titlePt: "Miswanting: o viés que sabota sua felicidade", summary: "Desejamos coisas erradas por previsões afetivas falhas.", tags: ["miswanting", "viés"], url: "https://www.youtube.com/watch?v=tH5fwcIitIU", embedUrl: "https://www.youtube.com/embed/tH5fwcIitIU?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 12 },
  { id: "LS-10", platform: "youtube", title: "Why Having More Doesn't Make You Happier", titlePt: "Por que ter mais não te faz mais feliz", summary: "Adaptação hedônica e o paradoxo da abundância.", tags: ["adaptação hedônica"], url: "https://www.youtube.com/watch?v=_5qGVpy4-mc", embedUrl: "https://www.youtube.com/embed/_5qGVpy4-mc?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 10 },
  { id: "LS-13", platform: "youtube", title: "Miswanting: How Your Mind Tricks You", titlePt: "Como a mente te engana", summary: "Aprofundamento em miswanting e previsão afetiva.", tags: ["miswanting", "aprofundamento"], url: "https://www.youtube.com/watch?v=megBHgELA88", embedUrl: "https://www.youtube.com/embed/megBHgELA88?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 11 },
  { id: "LS-14", platform: "youtube", title: "How Social Comparison Impacts Our Happiness", titlePt: "Como a comparação social impacta a felicidade", summary: "Comparações sociais como sabotadores do bem-estar.", tags: ["comparação social", "viés"], url: "https://www.youtube.com/watch?v=ba4Q_S6cFEI", embedUrl: "https://www.youtube.com/embed/ba4Q_S6cFEI?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 9 },
  { id: "LS-17", platform: "youtube", title: "Reset Your Reference Points", titlePt: "Redefina seus pontos de referência", summary: "Gratidão e reframe como ferramentas de reset.", tags: ["gratidão", "reframe"], url: "https://www.youtube.com/watch?v=NzkVWHyBH70", embedUrl: "https://www.youtube.com/embed/NzkVWHyBH70?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 10 },
  { id: "LS-19", platform: "youtube", title: "Use Your Signature Strengths", titlePt: "Use suas forças de caráter", summary: "Identificar e usar forças pessoais aumenta bem-estar.", tags: ["forças", "VIA", "propósito"], url: "https://www.youtube.com/watch?v=tteShB3_EnA", embedUrl: "https://www.youtube.com/embed/tteShB3_EnA?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 11 },
  { id: "LS-20", platform: "youtube", title: "Want to Be Happier? Do Kind Things", titlePt: "Quer ser feliz? Pratique gentileza", summary: "Atos de gentileza impulsionam felicidade de quem dá e recebe.", tags: ["gentileza", "prosocial"], url: "https://www.youtube.com/watch?v=A3CKhwB7LTU", embedUrl: "https://www.youtube.com/embed/A3CKhwB7LTU?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 9 },
  { id: "LS-22", platform: "youtube", title: "More Friends, More Happiness?", titlePt: "Mais amigos, mais felicidade?", summary: "Conexão social real vs. quantidade de contatos.", tags: ["conexão", "relacionamentos"], url: "https://www.youtube.com/watch?v=nbrCu6pliu0", embedUrl: "https://www.youtube.com/embed/nbrCu6pliu0?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 10 },
  { id: "LS-24", platform: "youtube", title: "The Psychology of Time Affluence", titlePt: "A psicologia da riqueza de tempo", summary: "Ter tempo é mais valioso que ter dinheiro para o bem-estar.", tags: ["tempo", "riqueza", "bem-estar"], url: "https://www.youtube.com/watch?v=ilRNAQ76Vsg", embedUrl: "https://www.youtube.com/embed/ilRNAQ76Vsg?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 10 },
  { id: "LS-25", platform: "youtube", title: "Mind Wandering and Happiness", titlePt: "Mente vagante e felicidade", summary: "A mente vagante é infeliz — mindfulness como antídoto.", tags: ["mindfulness", "atenção"], url: "https://www.youtube.com/watch?v=q_4PWjrNpns", embedUrl: "https://www.youtube.com/embed/q_4PWjrNpns?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 8 },
  { id: "LS-26", platform: "youtube", title: "Want to Be Happier? Prioritize Exercise and Sleep", titlePt: "Priorize exercício e sono", summary: "Sono e exercício são a base física do bem-estar.", tags: ["sono", "exercício", "corpo"], url: "https://www.youtube.com/watch?v=m3C5elUqIjU", embedUrl: "https://www.youtube.com/embed/m3C5elUqIjU?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 12 },
  { id: "LS-28", platform: "youtube", title: "Why Knowing What Makes You Happy Isn't Enough", titlePt: "Por que saber não basta", summary: "A lacuna entre conhecimento e ação — implementação.", tags: ["implementação", "hábito"], url: "https://www.youtube.com/watch?v=w98MSEWJWFs", embedUrl: "https://www.youtube.com/embed/w98MSEWJWFs?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 9 },
  { id: "LS-29", platform: "youtube", title: "How to Achieve Your Goals", titlePt: "Como alcançar seus objetivos", summary: "Intenção de implementação 'Se-Então' para mudança real.", tags: ["metas", "implementação"], url: "https://www.youtube.com/watch?v=u1fryeGFJCs", embedUrl: "https://www.youtube.com/embed/u1fryeGFJCs?cc_load_policy=1&hl=pt&cc_lang_pref=pt", durationMin: 10 },
];

/* ── TED Talks — Real embed URLs ────────────────────────────────── */

const TED: TrailVideo[] = [
  { id: "TED-001", platform: "ted", title: "The new era of positive psychology", titlePt: "A nova era da psicologia positiva — Martin Seligman", summary: "PERMA e os três caminhos para a felicidade.", tags: ["PERMA", "psicologia positiva"], url: "https://www.ted.com/talks/martin_seligman_the_new_era_of_positive_psychology", embedUrl: "https://embed.ted.com/talks/martin_seligman_the_new_era_of_positive_psychology?language=pt-br", durationMin: 24 },
  { id: "TED-002", platform: "ted", title: "Flow, the secret to happiness", titlePt: "Flow, o segredo da felicidade — Csikszentmihalyi", summary: "Estado de concentração absoluta como forma de bem-estar.", tags: ["flow", "engajamento"], url: "https://www.ted.com/talks/mihaly_csikszentmihalyi_flow_the_secret_to_happiness", embedUrl: "https://embed.ted.com/talks/mihaly_csikszentmihalyi_flow_the_secret_to_happiness?language=pt-br", durationMin: 19 },
  { id: "TED-003", platform: "ted", title: "What makes a good life?", titlePt: "O que faz uma vida boa? — Robert Waldinger", summary: "75 anos de pesquisa Harvard: bons relacionamentos.", tags: ["relacionamentos", "Harvard"], url: "https://www.ted.com/talks/robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness", embedUrl: "https://embed.ted.com/talks/robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness?language=pt-br", durationMin: 13 },
  { id: "TED-004", platform: "ted", title: "The surprising science of happiness", titlePt: "A surpreendente ciência da felicidade — Dan Gilbert", summary: "O cérebro fabrica felicidade real.", tags: ["felicidade sintética", "resiliência"], url: "https://www.ted.com/talks/dan_gilbert_the_surprising_science_of_happiness", embedUrl: "https://embed.ted.com/talks/dan_gilbert_the_surprising_science_of_happiness?language=pt-br", durationMin: 21 },
  { id: "TED-005", platform: "ted", title: "The power of vulnerability", titlePt: "O poder da vulnerabilidade — Brené Brown", summary: "Vulnerabilidade como base do pertencimento e da coragem.", tags: ["vulnerabilidade", "pertencimento"], url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability", embedUrl: "https://embed.ted.com/talks/brene_brown_the_power_of_vulnerability?language=pt-br", durationMin: 20 },
];

/* ── MODULE 1 — As Grandes Mentiras Sobre Ser Feliz ─────────────── */

const M1: LearningModule = {
  id: "MOD-COL-01",
  title: "As Grandes Mentiras Sobre Ser Feliz",
  subtitle: "Módulo 1 — Desmontando intuições erradas",
  description: "Explore por que achamos que sabemos o que nos faz felizes — mas estamos errados. Desafie 'bom emprego', 'dinheiro', 'corpo perfeito' e descubra o que a ciência diz.",
  icon: "🧠",
  color: "cycle-educar",
  targetFactors: [1, 2],
  level: "collaborator",
  videos: [LS[0], LS[1], LS[2], LS[3], LS[4], LS[5], LS[6]],
  quiz: [
    { id: "Q1-01", question: "Segundo Laurie Santos, felicidade é:", options: ["Um traço de personalidade fixo", "Uma habilidade treinável com prática", "Determinada 100% pela genética", "Apenas sorte"], correctIndex: 1, explanation: "A pesquisa mostra que ~40% da felicidade depende de ações intencionais, ou seja, é treinável." },
    { id: "Q1-02", question: "O que é a 'Falácia do G.I. Joe'?", options: ["Saber já basta para mudar", "Força física traz felicidade", "Dinheiro compra bem-estar", "Comparação é motivadora"], correctIndex: 0, explanation: "A falácia diz que 'saber é metade da batalha' — na verdade, sem prática deliberada, o conhecimento não muda comportamento." },
    { id: "Q1-03", question: "Qual dessas NÃO é uma crença errada sobre felicidade?", options: ["Um emprego perfeito me fará feliz", "Muito dinheiro garante felicidade", "Conexões sociais genuínas contribuem para o bem-estar", "Um corpo perfeito me fará feliz para sempre"], correctIndex: 2, explanation: "Relacionamentos reais são um dos mais fortes preditores de bem-estar — confirmado pelo Estudo de Harvard (75 anos)." },
  ],
  flashcards: [
    { id: "F1-01", front: "O que é Previsão Afetiva?", back: "A tentativa de prever como nos sentiremos no futuro — geralmente incorreta. Superestimamos duração e intensidade de emoções.", tags: ["previsão afetiva"] },
    { id: "F1-02", front: "Qual % da felicidade depende de ações intencionais?", back: "~40% — segundo modelo de Sonja Lyubomirsky. Genética ~50%, circunstâncias ~10%.", tags: ["modelo de felicidade"] },
    { id: "F1-03", front: "O que são 'Annoying Features of the Mind'?", back: "Vieses cognitivos (comparação social, adaptação hedônica, foco em negatividade) que sabotam nosso bem-estar.", tags: ["viés cognitivo"] },
    { id: "F1-04", front: "Falácia do G.I. Joe", back: "'Saber já basta' — falso. Sem prática deliberada, o conhecimento não muda comportamento (Santos, Yale).", tags: ["mudança de hábito"] },
  ],
  practices: [
    { id: "P1-01", title: "Diário de Crenças", description: "Liste 3 coisas que você acredita trazer felicidade. Ao final do módulo, reavalie cada uma com base na ciência.", type: "reflection", xpReward: 15 },
    { id: "P1-02", title: "Conversa Científica", description: "Compartilhe um insight deste módulo com um colega durante o almoço. Registre a reação.", type: "action", xpReward: 10 },
  ],
  xpReward: 80,
  estimatedMinutes: 60,
};

/* ── MODULE 2 — O Bug das Expectativas ──────────────────────────── */

const M2: LearningModule = {
  id: "MOD-COL-02",
  title: "O Bug das Expectativas",
  subtitle: "Módulo 2 — Miswanting e Adaptação Hedônica",
  description: "Descubra por que desejamos coisas que não nos fazem felizes. Miswanting, adaptação hedônica e pontos de referência distorcidos.",
  icon: "🔄",
  color: "copsoq-prevencao",
  targetFactors: [3, 7],
  level: "collaborator",
  videos: [LS[7], LS[8], LS[9], LS[10], LS[11]],
  quiz: [
    { id: "Q2-01", question: "O que é 'Miswanting'?", options: ["Desejar as coisas certas", "Desejar coisas que não nos farão felizes como imaginamos", "Não desejar nada", "Desejar coisas baratas"], correctIndex: 1, explanation: "Daniel Gilbert cunhou o termo para descrever previsões afetivas falhas sobre o que nos trará felicidade." },
    { id: "Q2-02", question: "A adaptação hedônica significa que:", options: ["Nunca nos adaptamos a mudanças", "Nos acostumamos com coisas boas E ruins", "Só nos adaptamos a coisas ruins", "A felicidade é constante"], correctIndex: 1, explanation: "O hedonic treadmill mostra que voltamos a um baseline de felicidade após eventos positivos e negativos." },
    { id: "Q2-03", question: "Como combater a comparação social?", options: ["Comparar mais para motivar", "Praticar gratidão e redefinir pontos de referência", "Isolar-se completamente", "Ignorar todas as emoções"], correctIndex: 1, explanation: "Gratidão e reframing dos pontos de referência ajudam a interromper o ciclo de comparação prejudicial." },
  ],
  flashcards: [
    { id: "F2-01", front: "O que é Adaptação Hedônica?", back: "A tendência do cérebro a se 'acostumar' com mudanças positivas, retornando ao nível basal de felicidade. Também funciona com eventos negativos.", tags: ["adaptação hedônica"] },
    { id: "F2-02", front: "O que são Pontos de Referência?", back: "O padrão contra o qual comparamos nossas experiências. Quando o ponto é alto demais, até coisas boas parecem insuficientes.", tags: ["comparação social"] },
    { id: "F2-03", front: "Focalism", back: "Tendência a focar demais num único aspecto e ignorar outros fatores que também afetam nosso bem-estar.", tags: ["viés cognitivo"] },
  ],
  practices: [
    { id: "P2-01", title: "Detox de Comparação", description: "Durante 1 dia, observe quantas vezes você se compara com outros. Anote e reflita: essas comparações ajudam ou prejudicam?", type: "observation", xpReward: 15 },
    { id: "P2-02", title: "3 Gratidões Novas", description: "Escreva 3 coisas pelas quais é grato que são diferentes das de ontem. Praticar novidade combate a adaptação hedônica.", type: "action", xpReward: 10 },
  ],
  xpReward: 80,
  estimatedMinutes: 55,
  unlockCondition: "Complete o Módulo 1",
};

/* ── MODULE 3 — O Que Realmente Funciona ────────────────────────── */

const M3: LearningModule = {
  id: "MOD-COL-03",
  title: "O Que Realmente Funciona",
  subtitle: "Módulo 3 — Forças, Gentileza e Conexão",
  description: "Forças de caráter, atos de gentileza, conexão social autêntica e flow como estratégias comprovadas pela ciência.",
  icon: "💡",
  color: "copsoq-salus",
  targetFactors: [5, 6],
  level: "collaborator",
  videos: [LS[12], LS[13], LS[14], TED[0], TED[1], TED[2]],
  quiz: [
    { id: "Q3-01", question: "Segundo a pesquisa, usar forças de caráter no trabalho:", options: ["Não tem efeito mensurável", "Aumenta engajamento e satisfação", "Causa estresse", "É irrelevante"], correctIndex: 1, explanation: "VIA Character Strengths research mostra aumento significativo em satisfação e redução de depressão." },
    { id: "Q3-02", question: "O que o estudo de Harvard de 75 anos concluiu?", options: ["Dinheiro é o fator principal", "Bons relacionamentos são o melhor preditor de felicidade", "Carreira é mais importante que saúde", "Genética determina tudo"], correctIndex: 1, explanation: "Robert Waldinger dirige o estudo mais longo sobre felicidade humana, que confirma: conexões de qualidade são fundamentais." },
  ],
  flashcards: [
    { id: "F3-01", front: "O que é Flow?", back: "Estado de concentração total numa atividade desafiadora e significativa. Csikszentmihalyi o descreve como o 'segredo da felicidade'.", tags: ["flow"] },
    { id: "F3-02", front: "VIA Character Strengths", back: "Classificação de 24 forças de caráter humanas. Usar as top 5 no dia a dia aumenta engajamento e bem-estar.", tags: ["forças pessoais"] },
    { id: "F3-03", front: "Paradoxo da Gentileza", back: "Quem pratica atos de gentileza ganha mais felicidade do que quem recebe (Dunn, 2008).", tags: ["prosocial"] },
  ],
  practices: [
    { id: "P3-01", title: "Teste VIA de Forças", description: "Acesse viacharacter.org e descubra suas 5 forças top. Planeje como usar uma delas amanhã no trabalho.", type: "action", xpReward: 20 },
    { id: "P3-02", title: "Ato de Gentileza Secreto", description: "Faça algo gentil por um colega sem que ele saiba. Registre como você se sentiu.", type: "action", xpReward: 15 },
    { id: "P3-03", title: "Conexão Autêntica", description: "Tenha uma conversa genuína de >5 min com alguém hoje — sem celular, com escuta ativa.", type: "action", xpReward: 15 },
  ],
  xpReward: 100,
  estimatedMinutes: 70,
  unlockCondition: "Complete o Módulo 2",
};

/* ── MODULE 4 — Hackeando o Cérebro ─────────────────────────────── */

const M4: LearningModule = {
  id: "MOD-COL-04",
  title: "Hackeando o Cérebro para Sentir-se Melhor",
  subtitle: "Módulo 4 — Corpo, Sono, Mindfulness e Rewirement",
  description: "Exercício, sono de qualidade, mindfulness e o poder de redefinir a riqueza de tempo. Neurociência do bem-estar aplicada.",
  icon: "⚡",
  color: "cycle-mensurar",
  targetFactors: [1, 2],
  level: "collaborator",
  videos: [LS[15], LS[16], LS[17], TED[3], TED[4]],
  quiz: [
    { id: "Q4-01", question: "A 'mente vagante' está associada a:", options: ["Mais criatividade sempre", "Menos felicidade na maioria dos casos", "Mais produtividade", "Melhor sono"], correctIndex: 1, explanation: "Killingsworth & Gilbert (2010): a mente divaga ~47% do tempo, e isso está correlacionado com menor bem-estar." },
    { id: "Q4-02", question: "O que é 'riqueza de tempo' (time affluence)?", options: ["Ter muito dinheiro para economizar tempo", "A sensação de ter tempo suficiente para as coisas que importam", "Trabalhar muitas horas", "Acumular férias"], correctIndex: 1, explanation: "Pesquisas mostram que a percepção de ter tempo suficiente é mais preditiva de bem-estar do que renda." },
  ],
  flashcards: [
    { id: "F4-01", front: "Quanto exercício para impactar o humor?", back: "30 minutos de exercício moderado têm efeito comparável a um antidepressivo em casos leves (Blumenthal et al.).", tags: ["exercício"] },
    { id: "F4-02", front: "Felicidade Sintética", back: "Dan Gilbert: o cérebro fabrica felicidade real mesmo quando não obtém o que deseja. É tão legítima quanto a 'natural'.", tags: ["felicidade sintética"] },
    { id: "F4-03", front: "Mindfulness e mente vagante", back: "A mente vaga ~47% do tempo e isso reduz felicidade. Meditação treina atenção plena ao presente.", tags: ["mindfulness"] },
  ],
  practices: [
    { id: "P4-01", title: "Mini-Meditação 5min", description: "Pratique 5 minutos de respiração consciente antes de começar o trabalho. Use um timer.", type: "action", xpReward: 10 },
    { id: "P4-02", title: "Auditoria de Tempo", description: "Registre como você passou as últimas 24h. Identifique 30 min que poderia realocar para algo significativo.", type: "reflection", xpReward: 15 },
    { id: "P4-03", title: "Desafio Corpo+Mente", description: "Faça 20 min de exercício + 5 min de meditação. Registre seu humor antes e depois.", type: "action", xpReward: 20 },
  ],
  xpReward: 100,
  estimatedMinutes: 65,
  unlockCondition: "Complete o Módulo 3",
};

/* ── MODULE 5 — Virando o Jogo da Vida Real ─────────────────────── */

const M5: LearningModule = {
  id: "MOD-COL-05",
  title: "Virando o Jogo da Vida Real",
  subtitle: "Módulo 5 — Implementação Se-Então e Hábitos Duradouros",
  description: "Transformar toda a ciência em hábitos duradouros. Intenção de implementação, WOOP, e compromisso social para mudança real.",
  icon: "🚀",
  color: "cycle-evoluir",
  targetFactors: [4, 5],
  level: "collaborator",
  videos: [LS[18], LS[19], TED[0], TED[1]],
  quiz: [
    { id: "Q5-01", question: "O que é intenção de implementação (Se-Então)?", options: ["Pensar positivo", "Planejar: 'Se [situação], então eu [ação]'", "Fazer listas genéricas", "Esperar motivação"], correctIndex: 1, explanation: "Peter Gollwitzer mostrou que planos Se-Então triplicam a chance de executar ações planejadas." },
    { id: "Q5-02", question: "Para manter hábitos de felicidade, o mais eficaz é:", options: ["Contar só com motivação", "Criar gatilhos situacionais + compromisso social", "Fazer tudo de uma vez", "Esperar o momento perfeito"], correctIndex: 1, explanation: "Situational cues + accountability são os motores mais fortes de mudança comportamental sustentável." },
  ],
  flashcards: [
    { id: "F5-01", front: "WOOP", back: "Wish (desejo), Outcome (resultado), Obstacle (obstáculo), Plan (plano Se-Então). Técnica de Gabriele Oettingen.", tags: ["metas", "implementação"] },
    { id: "F5-02", front: "Compromisso Social", back: "Compartilhar suas metas com outros aumenta a probabilidade de cumprimento em ~65% (estudos AJPM).", tags: ["accountability"] },
  ],
  practices: [
    { id: "P5-01", title: "Plano WOOP Pessoal", description: "Escolha 1 hábito de felicidade deste curso. Aplique WOOP: Desejo → Resultado → Obstáculo → Plano Se-Então.", type: "action", xpReward: 25 },
    { id: "P5-02", title: "Buddy de Bem-Estar", description: "Convide um colega para ser seu 'buddy de bem-estar' por 2 semanas. Compartilhem práticas diárias.", type: "action", xpReward: 20 },
    { id: "P5-03", title: "Carta ao Eu Futuro", description: "Escreva uma carta ao seu 'eu' de daqui a 3 meses descrevendo os hábitos que terá incorporado.", type: "reflection", xpReward: 15 },
  ],
  xpReward: 120,
  estimatedMinutes: 50,
  unlockCondition: "Complete o Módulo 4",
};

/* ── MANAGER TRAILS (12 Drivers) ────────────────────────────────── */

const MGR_FOUND: LearningModule = {
  id: "MOD-MGR-01",
  title: "Fundação — Gestão & Confiança",
  subtitle: "Drivers Fundacionais — Trust + Management",
  description: "Trust e Management são co-nucleares. Sem eles, nenhuma intervenção funciona. Liderança transformacional + segurança psicológica.",
  icon: "🏛️",
  color: "primary",
  targetFactors: [5, 6],
  level: "manager",
  videos: [TED[0], TED[2], TED[4]],
  quiz: [
    { id: "QM1-01", question: "Por que Trust é driver fundacional?", options: ["Porque é o mais fácil de medir", "Porque habilita Employee Voice e Inclusion", "Porque é o mais barato", "Porque não tem trade-offs"], correctIndex: 1, explanation: "Segurança psicológica (Edmondson, 1999) é pré-requisito para que funcionários se expressem sem medo de represálias." },
    { id: "QM1-02", question: "Gestores determinam qual % da variância no engajamento?", options: ["20%", "40%", "70%", "90%"], correctIndex: 2, explanation: "Gallup (2023): gestores são responsáveis por ~70% da variância no engajamento das equipes." },
  ],
  flashcards: [
    { id: "FM1-01", front: "Modelo de dependência Trust → Management", back: "Trust habilita: Psychological Safety → Employee Voice → Inclusion & Belonging → Achievement → Purpose. Management habilita: Appreciation → Support → Energy → Stress (gestão) → Flexibility → Compensation.", tags: ["sistema de drivers"] },
    { id: "FM1-02", front: "Sequência recomendada (Fase 1)", back: "0-90 dias: Trust + Management → Appreciation + Support. Sem fundação, intervenções posteriores fracassam.", tags: ["roadmap"] },
  ],
  practices: [
    { id: "PM1-01", title: "Diagnóstico de Confiança da Equipe", description: "Use 3 perguntas rápidas (anonimato, segurança para errar, voz ativa) para medir o nível de confiança da sua equipe.", type: "observation", xpReward: 20 },
    { id: "PM1-02", title: "Check-in Semanal de 15 min", description: "Implemente um check-in semanal com cada membro direto. Pergunte: O que está indo bem? O que posso fazer para ajudar?", type: "action", xpReward: 25 },
  ],
  xpReward: 100,
  estimatedMinutes: 45,
};

const MGR_RISK: LearningModule = {
  id: "MOD-MGR-02",
  title: "Redução de Dano — Stress, Support & Energy",
  subtitle: "Fase 2 — Eliminar fatores que destroem bem-estar",
  description: "Identificar fontes de stress sistêmico, construir suporte real (POS) e infraestrutura de recuperação. O 'médico trata a hemorragia antes das vitaminas'.",
  icon: "🛡️",
  color: "copsoq-pathos",
  targetFactors: [2, 3],
  level: "manager",
  videos: [TED[1], TED[3]],
  quiz: [
    { id: "QM2-01", question: "No modelo JD-R, o que são Job Demands excessivas?", options: ["Desafios saudáveis", "Fatores que drenam energia e causam burnout", "Metas de aprendizagem", "Benefícios extras"], correctIndex: 1, explanation: "Bakker & Demerouti (2007): demandas excessivas sem recursos adequados levam a exaustão e cinismo." },
    { id: "QM2-02", question: "Qual é o risco de metas sem suporte?", options: ["Mais criatividade", "Mais burnout e estresse", "Melhor engajamento", "Mais autonomia"], correctIndex: 1, explanation: "Achievement sem Support gera 'performance management' tóxico — metas desafiadoras precisam de scaffolding." },
  ],
  flashcards: [
    { id: "FM2-01", front: "POS (Perceived Organizational Support)", back: "Percepção do funcionário de que a organização valoriza suas contribuições e se preocupa com seu bem-estar. Mediado pela qualidade do gestor.", tags: ["support", "POS"] },
    { id: "FM2-02", front: "Detachment Psicológico", back: "Capacidade de 'desligar' do trabalho durante descanso. Sonnentag (2003): recovery → mais energia e performance no dia seguinte.", tags: ["energy", "recovery"] },
  ],
  practices: [
    { id: "PM2-01", title: "Mapeamento de Estressores", description: "Liste os 5 maiores estressores do seu time. Classifique cada um como: eliminável, reduzível ou gerenciável.", type: "reflection", xpReward: 20 },
    { id: "PM2-02", title: "Política de Recovery", description: "Crie uma regra de equipe sobre emails fora do horário. Teste por 2 semanas.", type: "action", xpReward: 25 },
  ],
  xpReward: 100,
  estimatedMinutes: 40,
  unlockCondition: "Complete Fundação — Gestão & Confiança",
};

const MGR_JUSTICE: LearningModule = {
  id: "MOD-MGR-03",
  title: "Coesão & Justiça",
  subtitle: "Inclusão, Compensação & Flexibilidade",
  description: "Pertencimento genuíno, justiça na remuneração e controle de tempo/lugar com equidade. Trade-offs entre transparência e conflito.",
  icon: "⚖️",
  color: "accent",
  targetFactors: [6, 7],
  level: "manager",
  videos: [TED[4], TED[2]],
  quiz: [
    { id: "QM3-01", question: "Qual o risco de transparência salarial sem preparo?", options: ["Nenhum", "Gerar ressentimento e conflito", "Aumento automático de satisfação", "Redução de turnover"], correctIndex: 1, explanation: "Transparência sem prontidão cultural pode gerar confronto — preparar gestores antes é essencial." },
  ],
  flashcards: [
    { id: "FM3-01", front: "Trade-off Flexibility ↔ Coordenação", back: "Autonomia de horário pode fragmentar colaboração. Mitigação: 'core hours' de sobreposição + ferramentas assíncronas.", tags: ["flexibility", "tradeoff"] },
  ],
  practices: [
    { id: "PM3-01", title: "Auditoria de Equidade", description: "Revise: todos na equipe têm acesso equivalente a oportunidades de desenvolvimento, flexibilidade e reconhecimento?", type: "reflection", xpReward: 20 },
  ],
  xpReward: 80,
  estimatedMinutes: 35,
  unlockCondition: "Complete Redução de Dano",
};

const MGR_CULTURE: LearningModule = {
  id: "MOD-MGR-04",
  title: "Capacidade & Cultura",
  subtitle: "Aprendizagem, Propósito, Apreciação & Realização",
  description: "Learning, Purpose, Appreciation e Achievement como motores de cultura. Co-construir propósito, feedback justo, reconhecimento peer-to-peer.",
  icon: "🌟",
  color: "cycle-evoluir",
  targetFactors: [1, 4, 5],
  level: "manager",
  videos: [TED[0], TED[1]],
  quiz: [
    { id: "QM4-01", question: "Propósito organizacional imposto 'de cima' pode gerar:", options: ["Engajamento imediato", "Cinismo e performatividade", "Lealdade incondicional", "Inovação"], correctIndex: 1, explanation: "Propósito precisa ser co-construído com colaboradores para ser autêntico e motivador." },
  ],
  flashcards: [
    { id: "FM4-01", front: "Achievement sem Purpose", back: "Metas sem significado geram performance vazia e burnout. Purpose dá direção ao Achievement.", tags: ["purpose", "achievement"] },
  ],
  practices: [
    { id: "PM4-01", title: "Workshop de Propósito", description: "Faça uma sessão de 30 min com a equipe: 'Para que serve nosso trabalho?' Registre as respostas.", type: "action", xpReward: 30 },
  ],
  xpReward: 120,
  estimatedMinutes: 45,
  unlockCondition: "Complete Coesão & Justiça",
};

/* ── EXPORTS ────────────────────────────────────────────────────── */

export const COLLABORATOR_MODULES: LearningModule[] = [M1, M2, M3, M4, M5];
export const MANAGER_MODULES: LearningModule[] = [MGR_FOUND, MGR_RISK, MGR_JUSTICE, MGR_CULTURE];

export function getRecommendedTrails(
  factorScores: FactorScore[],
  role: "collaborator" | "manager" | "admin"
): LearningModule[] {
  const modules = role === "collaborator" ? COLLABORATOR_MODULES : MANAGER_MODULES;
  const riskFactorIds = factorScores
    .filter((f) => f.riskBand === "ALTO" || f.riskBand === "MODERADO")
    .sort((a, b) => a.score - b.score)
    .map((f) => f.factorId);

  return [...modules].sort((a, b) => {
    const aR = a.targetFactors.filter((id) => riskFactorIds.includes(id)).length;
    const bR = b.targetFactors.filter((id) => riskFactorIds.includes(id)).length;
    return bR - aR;
  });
}

export { LS as LAURIE_SANTOS_VIDEOS, TED as TED_VIDEOS };
