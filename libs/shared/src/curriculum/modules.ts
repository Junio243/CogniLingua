export type ModuleItemType = 'word' | 'phrase';

export interface ModuleCompletionCriteria {
  minAccuracyPercent: number;
  minExercises: number;
  minVocabulary: number;
}

export interface ModuleItem {
  id: string;
  type: ModuleItemType;
  content: string;
  translation: string;
  theme: string;
  tags: string[];
  example?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  level: 'Básico' | 'Intermediário' | 'Avançado';
  order: number;
  objectives: string[];
  completionCriteria: ModuleCompletionCriteria;
  prerequisites: string[];
  tags: string[];
  vocabulary: ModuleItem[];
}

export const MODULE_SEQUENCE: LearningModule[] = [
  {
    id: 'basico-1',
    title: 'Básico 1 - Saudações e Apresentações',
    level: 'Básico',
    order: 1,
    objectives: [
      'Cumprimentar e despedir-se de forma natural.',
      'Perguntar e responder informações pessoais simples.',
      'Se apresentar e dizer de onde vem.',
    ],
    completionCriteria: {
      minAccuracyPercent: 80,
      minExercises: 8,
      minVocabulary: 6,
    },
    prerequisites: [],
    tags: ['Básico', 'Saudações', 'Apresentações'],
    vocabulary: [
      {
        id: 'bas1-hola',
        type: 'word',
        content: 'hola',
        translation: 'olá',
        theme: 'Saudações',
        tags: ['saudacoes', 'cotidiano'],
        example: 'Hola, ¿cómo estás? - Olá, como você está?',
      },
      {
        id: 'bas1-buenos-dias',
        type: 'phrase',
        content: 'buenos días',
        translation: 'bom dia',
        theme: 'Saudações',
        tags: ['saudacoes', 'periodo-dia'],
        example: 'Buenos días, me llamo Ana.',
      },
      {
        id: 'bas1-como-estas',
        type: 'phrase',
        content: '¿cómo estás?',
        translation: 'como você está?',
        theme: 'Saudações',
        tags: ['saudacoes', 'perguntas'],
        example: 'Hola, ¿cómo estás hoy? - Olá, como você está hoje?',
      },
      {
        id: 'bas1-me-llamo',
        type: 'phrase',
        content: 'me llamo…',
        translation: 'me chamo…',
        theme: 'Apresentações',
        tags: ['apresentacoes', 'identidade'],
        example: 'Me llamo Carlos. - Eu me chamo Carlos.',
      },
      {
        id: 'bas1-soy-de',
        type: 'phrase',
        content: 'soy de…',
        translation: 'sou de…',
        theme: 'Apresentações',
        tags: ['apresentacoes', 'origem'],
        example: 'Soy de São Paulo. - Sou de São Paulo.',
      },
      {
        id: 'bas1-mucho-gusto',
        type: 'phrase',
        content: 'mucho gusto',
        translation: 'muito prazer',
        theme: 'Saudações',
        tags: ['saudacoes', 'etiqueta'],
        example: 'Hola, soy Ana. – Mucho gusto. - Olá, sou Ana. – Muito prazer.',
      },
      {
        id: 'bas1-adios',
        type: 'word',
        content: 'adiós',
        translation: 'tchau; adeus',
        theme: 'Despedidas',
        tags: ['despedidas', 'cotidiano'],
        example: 'Adiós, nos vemos mañana. - Tchau, nos vemos amanhã.',
      },
      {
        id: 'bas1-hasta-luego',
        type: 'phrase',
        content: 'hasta luego',
        translation: 'até logo',
        theme: 'Despedidas',
        tags: ['despedidas', 'cotidiano'],
        example: 'Hasta luego, que tengas buen día. - Até logo, tenha um bom dia.',
      },
    ],
  },
  {
    id: 'basico-2',
    title: 'Básico 2 - Rotina e Números',
    level: 'Básico',
    order: 2,
    objectives: [
      'Descrever a rotina diária com verbos básicos.',
      'Contar de 1 a 20 e usar números em contextos simples.',
      'Fazer perguntas sobre horários e compromissos.',
    ],
    completionCriteria: {
      minAccuracyPercent: 80,
      minExercises: 10,
      minVocabulary: 7,
    },
    prerequisites: ['basico-1'],
    tags: ['Básico', 'Rotina', 'Números'],
    vocabulary: [
      {
        id: 'bas2-uno',
        type: 'word',
        content: 'uno',
        translation: 'um',
        theme: 'Números',
        tags: ['numeros', 'contagem'],
        example: 'Tengo un hermano. - Eu tenho um irmão.',
      },
      {
        id: 'bas2-diez',
        type: 'word',
        content: 'diez',
        translation: 'dez',
        theme: 'Números',
        tags: ['numeros', 'contagem'],
        example: 'La cita es a las diez. - A consulta é às dez.',
      },
      {
        id: 'bas2-veinte',
        type: 'word',
        content: 'veinte',
        translation: 'vinte',
        theme: 'Números',
        tags: ['numeros', 'contagem'],
        example: 'Tengo veinte minutos libres. - Tenho vinte minutos livres.',
      },
      {
        id: 'bas2-ir-trabajo',
        type: 'phrase',
        content: 'voy al trabajo',
        translation: 'vou ao trabalho',
        theme: 'Rotina',
        tags: ['rotina', 'transporte'],
        example: 'Cada mañana voy al trabajo en metro. - Toda manhã vou ao trabalho de metrô.',
      },
      {
        id: 'bas2-estudiar',
        type: 'word',
        content: 'estudiar',
        translation: 'estudar',
        theme: 'Rotina',
        tags: ['rotina', 'verbos'],
        example: 'Estudio español por la noche. - Eu estudo espanhol à noite.',
      },
      {
        id: 'bas2-tomar-cafe',
        type: 'phrase',
        content: 'tomo café por la mañana',
        translation: 'tomo café pela manhã',
        theme: 'Rotina',
        tags: ['rotina', 'alimentacao'],
        example: 'Siempre tomo café por la mañana. - Sempre tomo café pela manhã.',
      },
      {
        id: 'bas2-que-hora',
        type: 'phrase',
        content: '¿a qué hora...?',
        translation: 'a que horas...?',
        theme: 'Horários',
        tags: ['perguntas', 'horarios'],
        example: '¿A qué hora empieza la clase? - A que horas começa a aula?',
      },
      {
        id: 'bas2-tengo-reunion',
        type: 'phrase',
        content: 'tengo una reunión',
        translation: 'tenho uma reunião',
        theme: 'Rotina',
        tags: ['trabalho', 'compromissos'],
        example: 'Hoy tengo una reunión a las tres. - Hoje tenho uma reunião às três.',
      },
    ],
  },
  {
    id: 'basico-3',
    title: 'Básico 3 - Compras e Deslocamentos',
    level: 'Básico',
    order: 3,
    objectives: [
      'Pedir preços e negociar em lojas ou mercados.',
      'Pedir ajuda e localizar lugares na cidade.',
      'Fazer pedidos simples em restaurantes.',
    ],
    completionCriteria: {
      minAccuracyPercent: 80,
      minExercises: 12,
      minVocabulary: 8,
    },
    prerequisites: ['basico-2'],
    tags: ['Básico', 'Compras', 'Cidade'],
    vocabulary: [
      {
        id: 'bas3-cuanto-cuesta',
        type: 'phrase',
        content: '¿cuánto cuesta?',
        translation: 'quanto custa?',
        theme: 'Compras',
        tags: ['compras', 'perguntas'],
        example: '¿Cuánto cuesta esta camiseta? - Quanto custa esta camiseta?',
      },
      {
        id: 'bas3-quiero-esto',
        type: 'phrase',
        content: 'quiero esto',
        translation: 'eu quero isto',
        theme: 'Compras',
        tags: ['compras', 'pedido'],
        example: 'Quiero esto en una talla más grande. - Quero isto em um tamanho maior.',
      },
      {
        id: 'bas3-la-cuenta',
        type: 'phrase',
        content: 'la cuenta, por favor',
        translation: 'a conta, por favor',
        theme: 'Restaurante',
        tags: ['restaurante', 'pedido'],
        example: 'Camarero, la cuenta, por favor. - Garçom, a conta, por favor.',
      },
      {
        id: 'bas3-donde-bano',
        type: 'phrase',
        content: '¿dónde está el baño?',
        translation: 'onde fica o banheiro?',
        theme: 'Cidade',
        tags: ['localizacao', 'perguntas'],
        example: 'Disculpa, ¿dónde está el baño? - Com licença, onde fica o banheiro?',
      },
      {
        id: 'bas3-necesito-ayuda',
        type: 'phrase',
        content: 'necesito ayuda',
        translation: 'preciso de ajuda',
        theme: 'Cidade',
        tags: ['socorro', 'perguntas'],
        example: 'Perdón, necesito ayuda para encontrar el hotel. - Perdão, preciso de ajuda para encontrar o hotel.',
      },
      {
        id: 'bas3-estoy-buscando',
        type: 'phrase',
        content: 'estoy buscando…',
        translation: 'estou procurando…',
        theme: 'Cidade',
        tags: ['localizacao', 'perguntas'],
        example: 'Estoy buscando la estación de metro. - Estou procurando a estação de metrô.',
      },
      {
        id: 'bas3-girar-derecha',
        type: 'phrase',
        content: 'gira a la derecha',
        translation: 'vire à direita',
        theme: 'Direções',
        tags: ['direcoes', 'orientacao'],
        example: 'Gira a la derecha después del semáforo. - Vire à direita depois do semáforo.',
      },
      {
        id: 'bas3-mas-barato',
        type: 'phrase',
        content: '¿tiene algo más barato?',
        translation: 'tem algo mais barato?',
        theme: 'Compras',
        tags: ['compras', 'negociacao'],
        example: '¿Tiene algo más barato en este color? - Tem algo mais barato nessa cor?',
      },
    ],
  },
];
