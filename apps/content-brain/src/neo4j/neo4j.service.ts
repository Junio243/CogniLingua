import { Injectable, Logger } from '@nestjs/common';
import neo4j, { Driver, Session } from 'neo4j-driver';

export interface ConceptNode {
  id: string;
  title: string;
  difficulty: number;
}

@Injectable()
export class Neo4jService {
  private readonly logger = new Logger(Neo4jService.name);
  private driver: Driver;

  constructor() {
    this.driver = neo4j.driver(
      process.env.NEO4J_URI || 'bolt://localhost:7687',
      neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASSWORD || 'password',
      ),
    );
  }

  private getSession(): Session {
    return this.driver.session();
  }

  /**
   * Busca todos os conceitos no grafo.
   * Espera nós no formato:
   * (c:Concept { id: string, title: string, difficulty: number })
   */
  async getAllConcepts(): Promise<ConceptNode[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (c:Concept)
        RETURN
          c.id AS id,
          coalesce(c.title, c.id) AS title,
          coalesce(c.difficulty, 0.5) AS difficulty
        `,
      );

      return result.records.map((record) => ({
        id: record.get('id'),
        title: record.get('title'),
        difficulty: Number(record.get('difficulty')),
      }));
    } catch (error) {
      this.logger.error('Error fetching concepts from Neo4j', error);
      return [];
    } finally {
      await session.close();
    }
  }

  /**
   * Busca os IDs dos pré-requisitos de um conceito.
   * Espera algo como:
   * (p:Concept)-[:PREREQUISITE_OF]->(c:Concept { id: $conceptId })
   */
  async getPrerequisiteConceptIds(conceptId: string): Promise<string[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (p:Concept)-[:PREREQUISITE_OF]->(c:Concept { id: $conceptId })
        RETURN p.id AS id
        `,
        { conceptId },
      );

      return result.records.map((record) => record.get('id') as string);
    } catch (error) {
      this.logger.error(
        `Error fetching prerequisites for concept ${conceptId}`,
        error,
      );
      return [];
    } finally {
      await session.close();
    }
  }

  async onModuleDestroy() {
    await this.driver.close();
  }
}
