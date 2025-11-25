"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BKTEngine_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BKTEngine = void 0;
const common_1 = require("@nestjs/common");
let BKTEngine = BKTEngine_1 = class BKTEngine {
    constructor() {
        this.logger = new common_1.Logger(BKTEngine_1.name);
    }
    updateKnowledgeState(currentState, correct) {
        const { pLo, pG, pS, pT, pKnown } = currentState;
        const prior = pKnown;
        let posteriorGivenObservation;
        if (correct) {
            const numerator = prior * (1 - pS);
            const denominator = numerator + (1 - prior) * pG;
            posteriorGivenObservation = denominator !== 0 ? numerator / denominator : prior;
        }
        else {
            const numerator = prior * pS;
            const denominator = numerator + (1 - prior) * (1 - pG);
            posteriorGivenObservation = denominator !== 0 ? numerator / denominator : prior;
        }
        const new_pKnown = posteriorGivenObservation;
        const next_pLo = new_pKnown + (1 - new_pKnown) * pT;
        const newState = {
            ...currentState,
            pLo: next_pLo,
            pKnown: new_pKnown,
        };
        this.logger.debug(`BKT Update: Correct=${correct}, Old pKnown=${pKnown.toFixed(4)}, New pKnown=${new_pKnown.toFixed(4)}, Next pLo=${next_pLo.toFixed(4)}`);
        return newState;
    }
    initializeState(pLo, pG, pS, pT) {
        return {
            pLo,
            pG,
            pS,
            pT,
            pKnown: pLo,
        };
    }
};
exports.BKTEngine = BKTEngine;
exports.BKTEngine = BKTEngine = BKTEngine_1 = __decorate([
    (0, common_1.Injectable)()
], BKTEngine);
//# sourceMappingURL=bkt.engine.js.map