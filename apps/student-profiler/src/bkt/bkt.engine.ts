import { Injectable, Logger } from '@nestjs/common';
import { BKTState } from '@cognilingua/shared'; // Import interface from shared lib

@Injectable()
export class BKTEngine {
  private readonly logger = new Logger(BKTEngine.name);

  /**
   * Atualiza o estado de conhecimento (BKT) dado se o aluno acertou ou errou.
   *
   * pLo     = probabilidade de ter aprendido (estado "pós-transição")
   * pKnown  = crença atual de que o aluno sabe o conceito (antes da transição)
   * pG      = guess (acertar sem saber)
   * pS      = slip (errar mesmo sabendo)
   * pT      = transition (aprender entre um passo e outro)
   */
  updateKnowledgeState(currentState: BKTState, correct: boolean): BKTState {
    const { pLo, pG, pS, pT, pKnown } = currentState;

    // crença anterior à observação
    const prior = pKnown;

    let posteriorGivenObservation: number;

    if (correct) {
      // Resposta CORRETA:
      // P(Ln | correct) = ( (1 - S) * L_{n-1} ) / ( (1 - S) * L_{n-1} + G * (1 - L_{n-1}) )
      const numerator = prior * (1 - pS);
      const denominator = numerator + (1 - prior) * pG;
      posteriorGivenObservation = denominator !== 0 ? numerator / denominator : prior;
    } else {
      // Resposta ERRADA:
      // P(Ln | incorrect) = ( S * L_{n-1} ) / ( S * L_{n-1} + (1 - G) * (1 - L_{n-1}) )
      const numerator = prior * pS;
      const denominator = numerator + (1 - prior) * (1 - pG);
      posteriorGivenObservation = denominator !== 0 ? numerator / denominator : prior;
    }

    // Este é o "saber" após a observação da resposta
    const new_pKnown = posteriorGivenObservation;

    // Aplica o learning/transition para o próximo passo:
    // p(Ln+1) = p(Ln) + (1 - p(Ln)) * pT
    const next_pLo = new_pKnown + (1 - new_pKnown) * pT;

    const newState: BKTState = {
      ...currentState,
      pLo: next_pLo,
      pKnown: new_pKnown,
    };

    this.logger.debug(
      `BKT Update: Correct=${correct}, Old pKnown=${pKnown.toFixed(
        4,
      )}, New pKnown=${new_pKnown.toFixed(4)}, Next pLo=${next_pLo.toFixed(4)}`,
    );

    return newState;
  }

  // Inicializa o estado BKT para um novo conceito
  initializeState(pLo: number, pG: number, pS: number, pT: number): BKTState {
    return {
      pLo,
      pG,
      pS,
      pT,
      // crença inicial: igual ao prior de aprendizagem
      pKnown: pLo,
    };
  }
}
