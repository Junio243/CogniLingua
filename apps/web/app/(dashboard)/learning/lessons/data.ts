import type { Flashcard, Lesson } from '../../../../types/learning';

export type LessonDetail = Lesson & {
  objectives: string[];
  sections: { title: string; body: string }[];
  quiz: { question: string; options: string[]; answerIndex: number; explanation: string }[];
  flashcards?: Flashcard[];
  nextLessonId?: string;
};

const fallbackCards: Flashcard[] = [
  { front: 'Hola, ¿qué tal tu día?', back: 'Oi, como foi seu dia?' },
  { front: 'Estoy terminando el reporte', back: 'Estou terminando o relatório.' },
  { front: '¿Quieres repasar juntos?', back: 'Quer revisar juntos?' },
];

export const lessons: Record<string, LessonDetail> = {
  aquecimento: {
    id: 'aquecimento',
    moduleId: 'basico-1',
    title: 'Aquecimento de escuta e fala',
    description: 'Ative o ouvido com frases curtas e aprenda a responder de forma natural.',
    durationMinutes: 15,
    objectives: ['Reconhecer padrões de saudação', 'Responder perguntas rápidas', 'Evitar falsos cognatos'],
    sections: [
      {
        title: 'Saudações rápidas',
        body: 'Escute e repita saudações formais e informais. Foque em entonação e ritmo natural.',
      },
      {
        title: 'Perguntas de rotina',
        body: 'Pratique respostas curtas sobre seu dia e planos próximos. Combine verbos no presente e futuro imediato.',
      },
    ],
    quiz: [
      {
        question: 'Qual resposta deixa o diálogo mais natural?',
        options: ['Estoy bien, gracias. ¿Y tú?', 'Estoy bueno, gracias. ¿Y tú?'],
        answerIndex: 0,
        explanation: 'Usamos “estoy bien” para estado momentâneo; “estoy bueno” se refere a aparência/forma física.',
      },
      {
        question: 'Escolha a pergunta mais comum para abrir uma conversa.',
        options: ['¿Qué hora es tu plan?', '¿Qué tal tu día?'],
        answerIndex: 1,
        explanation: '“¿Qué tal tu día?” soa natural e abre espaço para detalhes; a outra frase é gramaticalmente estranha.',
      },
    ],
    flashcards: fallbackCards,
    nextLessonId: 'dialogos-curtos',
  },
  revisao: {
    id: 'revisao',
    moduleId: 'basico-1',
    title: 'Revisão expressa de vocabulário',
    description: 'Reforce expressões essenciais para não travar em conversas rápidas.',
    durationMinutes: 10,
    objectives: ['Recuperar verbos irregulares', 'Rever conectores simples', 'Garantir acentuação correta'],
    sections: [
      {
        title: 'Verbos que mais caem',
        body: 'Concentre-se em “ir”, “tener” e “poder” com conjugações no presente e passado.',
      },
      {
        title: 'Conectores e acentuação',
        body: 'Use “entonces”, “pero”, “aunque” para ligar ideias e revise acentos em “también” e “fácil”.',
      },
    ],
    quiz: [
      {
        question: 'Qual frase mantém concordância correta?',
        options: ['Ellos fue al cine ayer.', 'Ellos fueron al cine ayer.'],
        answerIndex: 1,
        explanation: 'O pretérito de “ir” no plural é “fueron”, mantendo sujeito e verbo no plural.',
      },
    ],
    flashcards: [
      { front: 'Aunque me gusta, no puedo ir', back: 'Embora eu goste, não posso ir.' },
      { front: 'Entonces quedamos así', back: 'Então combinamos assim.' },
      { front: '¿Pudiste terminar?', back: 'Você conseguiu terminar?' },
    ],
    nextLessonId: 'dialogos-curtos',
  },
  'dialogos-curtos': {
    id: 'dialogos-curtos',
    moduleId: 'basico-2',
    title: 'Diálogos curtos sobre rotina',
    description: 'Use perguntas e respostas curtas para marcar compromissos e combinar encontros.',
    durationMinutes: 18,
    objectives: ['Pedir e oferecer horários', 'Usar futuro imediato', 'Conectar ideias com naturalidade'],
    sections: [
      {
        title: 'Horários e convites',
        body: 'Combine “podemos”, “qué te parece” e horas exatas para soar natural ao marcar encontros.',
      },
      {
        title: 'Futuro imediato',
        body: 'Pratique “ir a + infinitivo” para falar de planos próximos, mantendo concordância e pronomes.',
      },
    ],
    quiz: [
      {
        question: 'Escolha a resposta mais natural para marcar um encontro.',
        options: ['Voy llamar después.', '¿Te parece si practicamos a las 19h?'],
        answerIndex: 1,
        explanation: 'A pergunta abre espaço para confirmar horário; a primeira opção soa abrupta e incompleta.',
      },
    ],
    flashcards: [
      { front: 'Podemos vernos mañana a las 8h', back: 'Podemos nos ver amanhã às 8h.' },
      { front: 'Te aviso si me atraso', back: 'Te aviso se eu me atrasar.' },
    ],
    nextLessonId: 'reflexivos',
  },
  reflexivos: {
    id: 'reflexivos',
    moduleId: 'basico-2',
    title: 'Verbos reflexivos na prática',
    description: 'Construa frases fluídas com “me/te/se” e conecte ações diárias sem travar.',
    durationMinutes: 20,
    objectives: ['Usar pronomes átonos', 'Falar de rotina pessoal', 'Conectar ações no pretérito'],
    sections: [
      {
        title: 'Rotina com pronomes',
        body: 'Pratique “me levanto”, “se prepara”, “nos dormimos tarde” com atenção à ordem das palavras.',
      },
      {
        title: 'Sequência de ações',
        body: 'Use conectores como “después”, “luego”, “antes de” para encadear frases sobre o dia.',
      },
    ],
    quiz: [
      {
        question: 'Qual frase soa mais natural?',
        options: ['Luego me voy a entrenar', 'Luego voy me a entrenar'],
        answerIndex: 0,
        explanation: 'O pronome vem antes do verbo principal (“me voy a entrenar”) para soar natural.',
      },
    ],
    flashcards: fallbackCards,
    nextLessonId: undefined,
  },
};

export function getLessonById(lessonId: string): LessonDetail {
  return lessons[lessonId] ?? lessons.aquecimento;
}

export function getFallbackCards(): Flashcard[] {
  return fallbackCards;
}
