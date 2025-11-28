'use client';

import { useEffect, useMemo, useState } from 'react';

type Level = 'iniciante' | 'intermediario' | 'avancado';
type ExerciseKey = 'multipleChoice' | 'translation' | 'fillBlank' | 'contextChoice';
type ExerciseState = {
  status: 'pending' | 'correct' | 'incorrect';
  attempts: number;
  lastFeedback?: string;
};

type HistoryEntry = {
  id: string;
  type: string;
  prompt: string;
  result: 'correct' | 'incorrect';
  feedback: string;
};

type FeedbackTone = 'correct' | 'incorrect' | 'neutral';

type ExerciseCardProps = {
  title: string;
  description: string;
  id: ExerciseKey;
};

const exerciseOrder: ExerciseKey[] = [
  'multipleChoice',
  'translation',
  'fillBlank',
  'contextChoice',
];

const exerciseLabels: Record<ExerciseKey, string> = {
  multipleChoice: 'Múltipla escolha',
  translation: 'Tradução PT ↔ ES',
  fillBlank: 'Completar frase',
  contextChoice: 'Palavra em contexto',
};

const mcExercise = {
  question: 'Qual opção traz a melhor tradução para "I will call you later"?',
  options: [
    'Voy a llamarte más tarde',
    'Voy a llamarte temprano',
    'Quiero llamarte ahora',
    'Te llamaré ayer',
  ],
  answerIndex: 0,
  explanation: 'O futuro simples "I will call" corresponde a "te llamaré" ou "voy a llamarte"; "más tarde" mantém a ideia temporal correta.',
};

const translationExercise = {
  ptToEs: {
    prompt: 'Traduza para espanhol: "Preciso melhorar minha pronúncia"',
    expected: 'Necesito mejorar mi pronunciación',
  },
  esToPt: {
    prompt: 'Traduza para português: "Estoy repasando los verbos irregulares"',
    expected: 'Estou revisando os verbos irregulares',
  },
  example: 'Use frases curtas e claras. Se tiver dúvidas, releia o enunciado e verifique acentos e concordância.',
};

const fillBlankExercise = {
  prompt: 'Cuando era niño, ___ en un pueblo pequeño de Colombia.',
  expected: 'vivía',
  example: 'Usamos o imperfeito "vivía" para falar de hábitos no passado.',
};

const contextExercise = {
  sentence: 'El profesor explicó la regla con un ejemplo muy ___, então todos entenderam.',
  options: ['complicado', 'claro', 'raro', 'distante'],
  answerIndex: 1,
  example: '"Claro" funciona como adjetivo para indicar que o exemplo foi fácil de entender.',
};

function useSavedLevel() {
  const [level, setLevel] = useState<Level | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cognilingua-level') as Level | null;
    if (saved) {
      setLevel(saved);
    }
  }, []);

  useEffect(() => {
    if (level) {
      localStorage.setItem('cognilingua-level', level);
    }
  }, [level]);

  return { level, setLevel } as const;
}

function SectionTitle({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {detail ? <span>{detail}</span> : null}
    </div>
  );
}

function Feedback({ message, tone }: { message: string; tone: FeedbackTone }) {
  return <div className={`feedback ${tone}`}>{message}</div>;
}

function MultipleChoiceCard({
  title,
  description,
  id,
  onResult,
  state,
}: ExerciseCardProps & {
  onResult: (result: { correct: boolean; feedback: string }) => void;
  state: ExerciseState;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: FeedbackTone;
  }>({
    message: 'Escolha a alternativa que melhor comunica a ideia.',
    tone: 'neutral',
  });

  const handleSelect = (index: number) => {
    setSelected(index);
    const isCorrect = index === mcExercise.answerIndex;
    const message = isCorrect
      ? 'Acertou! Você reproduziu o tempo verbal e a intenção corretamente.'
      : `Resposta ideal: "${mcExercise.options[mcExercise.answerIndex]}". ${mcExercise.explanation}`;

    setFeedback({ message, tone: isCorrect ? 'correct' : 'incorrect' });
    onResult({ correct: isCorrect, feedback: message });
  };

  return (
    <div className="card exercise-card" id={id}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="hero-description">{mcExercise.question}</p>
      <div className="option-grid">
        {mcExercise.options.map((option, index) => (
          <button
            key={option}
            className={`option-button ${selected === index ? (index === mcExercise.answerIndex ? 'correct' : 'incorrect') : ''}`}
            onClick={() => handleSelect(index)}
          >
            {option}
          </button>
        ))}
      </div>
      <Feedback message={feedback.message} tone={feedback.tone} />
      {state.lastFeedback ? (
        <p className="hero-description">Último feedback: {state.lastFeedback}</p>
      ) : null}
    </div>
  );
}

function TranslationCard({
  title,
  description,
  id,
  onResult,
  state,
}: ExerciseCardProps & {
  onResult: (result: { correct: boolean; feedback: string }) => void;
  state: ExerciseState;
}) {
  const [ptToEs, setPtToEs] = useState('');
  const [esToPt, setEsToPt] = useState('');
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: FeedbackTone;
  }>({
    message: 'Traduza nos dois sentidos para consolidar vocabulário e sintaxe.',
    tone: 'neutral',
  });

  const normalize = (value: string) => value.trim().toLowerCase();

  const evaluate = () => {
    const ptCorrect = normalize(ptToEs) === normalize(translationExercise.ptToEs.expected);
    const esCorrect = normalize(esToPt) === normalize(translationExercise.esToPt.expected);
    const isCorrect = ptCorrect && esCorrect;
    const feedbackMessage = isCorrect
      ? 'Você conectou as duas direções! Continue reforçando acentos e concordância.'
      : `Correcções: PT→ES "${translationExercise.ptToEs.expected}" | ES→PT "${translationExercise.esToPt.expected}". ${translationExercise.example}`;

    setFeedback({ message: feedbackMessage, tone: isCorrect ? 'correct' : 'incorrect' });
    onResult({ correct: isCorrect, feedback: feedbackMessage });
  };

  return (
    <div className="card exercise-card" id={id}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="input-row">
        <label>
          {translationExercise.ptToEs.prompt}
          <input
            className="text-input"
            value={ptToEs}
            onChange={(e) => setPtToEs(e.target.value)}
            placeholder="Escreva em espanhol"
          />
        </label>
        <label>
          {translationExercise.esToPt.prompt}
          <input
            className="text-input"
            value={esToPt}
            onChange={(e) => setEsToPt(e.target.value)}
            placeholder="Escreva em português"
          />
        </label>
      </div>
      <div style={{ marginTop: '10px' }}>
        <button className="cta-button" onClick={evaluate}>
          Verificar traduções
        </button>
      </div>
      <Feedback message={feedback.message} tone={feedback.tone} />
      {state.lastFeedback ? (
        <p className="hero-description">Último feedback: {state.lastFeedback}</p>
      ) : null}
    </div>
  );
}

function FillBlankCard({
  title,
  description,
  id,
  onResult,
  state,
}: ExerciseCardProps & {
  onResult: (result: { correct: boolean; feedback: string }) => void;
  state: ExerciseState;
}) {
  const [attempt, setAttempt] = useState('');
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: FeedbackTone;
  }>({
    message: 'Use o pretérito imperfeito para falar de hábitos no passado.',
    tone: 'neutral',
  });

  const checkAttempt = () => {
    const isCorrect = attempt.trim().toLowerCase() === fillBlankExercise.expected;
    const feedbackMessage = isCorrect
      ? 'Perfeito! O imperfeito indica uma ação habitual no passado.'
      : `A forma adequada é "${fillBlankExercise.expected}". ${fillBlankExercise.example}`;

    setFeedback({ message: feedbackMessage, tone: isCorrect ? 'correct' : 'incorrect' });
    onResult({ correct: isCorrect, feedback: feedbackMessage });
  };

  return (
    <div className="card exercise-card" id={id}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="hero-description">{fillBlankExercise.prompt}</p>
      <input
        className="text-input"
        value={attempt}
        onChange={(e) => setAttempt(e.target.value)}
        placeholder="Digite a palavra que completa a frase"
      />
      <div style={{ marginTop: '10px' }}>
        <button className="cta-button" onClick={checkAttempt}>
          Conferir resposta
        </button>
      </div>
      <Feedback message={feedback.message} tone={feedback.tone} />
      {state.lastFeedback ? (
        <p className="hero-description">Último feedback: {state.lastFeedback}</p>
      ) : null}
    </div>
  );
}

function ContextChoiceCard({
  title,
  description,
  id,
  onResult,
  state,
}: ExerciseCardProps & {
  onResult: (result: { correct: boolean; feedback: string }) => void;
  state: ExerciseState;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: FeedbackTone;
  }>({
    message: 'Escolha a palavra que mantém a frase natural e compreensível.',
    tone: 'neutral',
  });

  const handleSelect = (index: number) => {
    setSelected(index);
    const isCorrect = index === contextExercise.answerIndex;
    const feedbackMessage = isCorrect
      ? 'Boa! "Claro" reforça que o exemplo foi fácil de entender.'
      : `Melhor opção: "${contextExercise.options[contextExercise.answerIndex]}". ${contextExercise.example}`;

    setFeedback({ message: feedbackMessage, tone: isCorrect ? 'correct' : 'incorrect' });
    onResult({ correct: isCorrect, feedback: feedbackMessage });
  };

  return (
    <div className="card exercise-card" id={id}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="hero-description">{contextExercise.sentence}</p>
      <div className="option-grid">
        {contextExercise.options.map((option, index) => (
          <button
            key={option}
            className={`option-button ${selected === index ? (index === contextExercise.answerIndex ? 'correct' : 'incorrect') : ''}`}
            onClick={() => handleSelect(index)}
          >
            {option}
          </button>
        ))}
      </div>
      <Feedback message={feedback.message} tone={feedback.tone} />
      {state.lastFeedback ? (
        <p className="hero-description">Último feedback: {state.lastFeedback}</p>
      ) : null}
    </div>
  );
}

export default function DashboardHome() {
  const { level, setLevel } = useSavedLevel();
  const [activeExercise, setActiveExercise] = useState<ExerciseKey>('multipleChoice');
  const [exerciseState, setExerciseState] = useState<Record<ExerciseKey, ExerciseState>>({
    multipleChoice: { status: 'pending', attempts: 0 },
    translation: { status: 'pending', attempts: 0 },
    fillBlank: { status: 'pending', attempts: 0 },
    contextChoice: { status: 'pending', attempts: 0 },
  });
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const recommended = useMemo(
    () => exerciseOrder.find((key) => exerciseState[key].status !== 'correct') ?? exerciseOrder[0],
    [exerciseState]
  );

  const handleResult = (key: ExerciseKey, prompt: string) =>
    ({ correct, feedback }: { correct: boolean; feedback: string }) => {
      setExerciseState((prev) => ({
        ...prev,
        [key]: {
          status: correct ? 'correct' : 'incorrect',
          attempts: prev[key].attempts + 1,
          lastFeedback: feedback,
        },
      }));

      setHistory((prev) => [
        {
          id: `${Date.now()}-${prev.length}`,
          type: exerciseLabels[key],
          prompt,
          result: correct ? 'correct' : 'incorrect',
          feedback,
        },
        ...prev,
      ]);

      setActiveExercise(key);
    };

  const progress = useMemo(() => {
    const completed = Object.values(exerciseState).filter((state) => state.status === 'correct').length;
    return Math.round((completed / exerciseOrder.length) * 100);
  }, [exerciseState]);

  const scrollToExercise = () => {
    const target = document.getElementById(recommended);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveExercise(recommended);
  };

  return (
    <>
      <header>
        <div className="hero-grid">
          <div>
            <p className="badge">Nova experiência • Espanhol guiado</p>
            <h1>CogniLingua: fluência em espanhol com feedback imediato</h1>
            <p className="hero-description">
              CogniLingua acelera a aprendizagem com microexercícios inteligentes, conectando vocabulário, gramática e contexto em português e espanhol.
              Em poucos cliques, o estudante recebe correções claras e exemplos práticos.
            </p>
            <div className="badges">
              <span className="badge">Público: alunos de espanhol no Brasil</span>
              <span className="badge">Foco: conversação + escrita</span>
              <span className="badge">Recomendações personalizadas</span>
            </div>
          </div>
          <div className="card level-selector" id="estudar">
            <h3>Qual é o seu nível de espanhol?</h3>
            <p className="hero-description">Escolha para ajustar o tom das dicas e do vocabulário.</p>
            <div className="level-buttons">
              {([
                ['iniciante', 'Iniciante'],
                ['intermediario', 'Intermediário'],
                ['avancado', 'Avançado'],
              ] as [Level, string][]).map(([value, label]) => (
                <button
                  key={value}
                  className={level === value ? 'active' : ''}
                  onClick={() => setLevel(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="cta-area">
              <div>
                <p className="hero-description">
                  Conte para o CogniLingua: o site adapta o tom das explicações e prioriza tópicos que costumam travar estudantes do seu nível.
                </p>
                <p className="hero-description">Nível salvo automaticamente para a próxima visita.</p>
              </div>
              <button className="cta-button" onClick={scrollToExercise}>
                Começar a estudar →
              </button>
            </div>
          </div>
        </div>
        <nav className="menu" aria-label="Navegação principal">
          <a href="#estudar">Estudar</a>
          <a href="#revisar">Revisar</a>
          <a href="#progresso">Progresso</a>
        </nav>
      </header>

      <SectionTitle title="Roteiro inteligente" detail="Veja o próximo exercício recomendado" />
      <div className="progress-panel" id="revisar">
        <p className="hero-description">
          Próximo passo sugerido: <strong>{exerciseLabels[recommended]}</strong>.
          Botões e feedbacks são responsivos para mobile-first: cards empilham no celular e viram grade dupla no desktop.
        </p>
        <div className="progress-bar" aria-label={`Progresso geral: ${progress}%`}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <SectionTitle title="Exercícios interativos" detail="Feedback imediato e exemplos claros" />
      <div className="grid-2">
        <MultipleChoiceCard
          title="Múltipla escolha"
          description="Treine leitura rápida com alternativas próximas e feedback visual imediato."
          id="multipleChoice"
          onResult={handleResult('multipleChoice', mcExercise.question)}
          state={exerciseState.multipleChoice}
        />

        <TranslationCard
          title="Tradução PT ↔ ES"
          description="Compare estruturas nos dois sentidos para fixar falsos cognatos e acentuação."
          id="translation"
          onResult={handleResult('translation', `${translationExercise.ptToEs.prompt} / ${translationExercise.esToPt.prompt}`)}
          state={exerciseState.translation}
        />

        <FillBlankCard
          title="Completar frase"
          description="Pratique tempos verbais em contexto real, com correção automática."
          id="fillBlank"
          onResult={handleResult('fillBlank', fillBlankExercise.prompt)}
          state={exerciseState.fillBlank}
        />

        <ContextChoiceCard
          title="Palavra em contexto"
          description="Escolha o termo que deixa a frase natural e coerente."
          id="contextChoice"
          onResult={handleResult('contextChoice', contextExercise.sentence)}
          state={exerciseState.contextChoice}
        />
      </div>

      <SectionTitle title="Progresso e histórico" detail="Veja o que já acertou e onde revisar" />
      <div className="grid-2" id="progresso">
        <div className="card">
          <h3>Resumo rápido</h3>
          <p className="hero-description">Nível escolhido: {level ?? 'defina seu nível para personalizar dicas'}</p>
          <p className="hero-description">Exercício ativo: {exerciseLabels[activeExercise]}</p>
          <p className="hero-description">Tentativas totais: {history.length}</p>
          <div className="progress-bar" aria-label={`Progresso geral: ${progress}%`}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="progress-panel">
          <h3>Histórico recente</h3>
          <ul className="history-list">
            {history.length === 0 ? (
              <li className="hero-description">Resolva um exercício para ver seu histórico aparecer aqui.</li>
            ) : (
              history.slice(0, 6).map((item) => (
                <li key={item.id} className="history-item">
                  <div className={`tag ${item.result}`}>{item.result === 'correct' ? 'Acerto' : 'Correção'}</div>
                  <strong>{item.type}</strong>
                  <span className="hero-description">{item.prompt}</span>
                  <span className="hero-description">{item.feedback}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
