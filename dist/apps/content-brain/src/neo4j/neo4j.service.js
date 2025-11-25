"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Neo4jService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neo4jService = void 0;
const common_1 = require("@nestjs/common");
const neo4j_driver_1 = require("neo4j-driver");
let Neo4jService = Neo4jService_1 = class Neo4jService {
    constructor() {
        this.logger = new common_1.Logger(Neo4jService_1.name);
        this.driver = neo4j_driver_1.default.driver(process.env.NEO4J_URI || 'bolt://localhost:7687', neo4j_driver_1.default.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'password'));
    }
    getSession() {
        return this.driver.session();
    }
    async getAllConcepts() {
        const session = this.getSession();
        try {
            const result = await session.run(`
        MATCH (c:Concept)
        RETURN
          c.id AS id,
          coalesce(c.title, c.id) AS title,
          coalesce(c.difficulty, 0.5) AS difficulty
        `);
            return result.records.map((record) => ({
                id: record.get('id'),
                title: record.get('title'),
                difficulty: Number(record.get('difficulty')),
            }));
        }
        catch (error) {
            this.logger.error('Error fetching concepts from Neo4j', error);
            return [];
        }
        finally {
            await session.close();
        }
    }
    async getPrerequisiteConceptIds(conceptId) {
        const session = this.getSession();
        try {
            const result = await session.run(`
        MATCH (p:Concept)-[:PREREQUISITE_OF]->(c:Concept { id: $conceptId })
        RETURN p.id AS id
        `, { conceptId });
            return result.records.map((record) => record.get('id'));
        }
        catch (error) {
            this.logger.error(`Error fetching prerequisites for concept ${conceptId}`, error);
            return [];
        }
        finally {
            await session.close();
        }
    }
    async onModuleDestroy() {
        await this.driver.close();
    }
};
exports.Neo4jService = Neo4jService;
exports.Neo4jService = Neo4jService = Neo4jService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], Neo4jService);
//# sourceMappingURL=neo4j.service.js.map