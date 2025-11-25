import neo4j, { Driver, Session } from 'neo4j-driver';

// Use environment variables or default values
const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD;

if (!password) {
  throw new Error('NEO4J_PASSWORD must be set in environment variables before running seed-db.ts');
}

async function seedDatabase(): Promise<void> {
  const driver: Driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  let session: Session | undefined;

  try {
    session = driver.session();

    console.log('Starting to seed Neo4j database...');

    // --- Constraints ---
    await session.run(`
      CREATE CONSTRAINT concept_id_unique IF NOT EXISTS
      FOR (c:Concept) REQUIRE c.id IS UNIQUE;
    `);
    await session.run(`
      CREATE CONSTRAINT grammar_topic_name_unique IF NOT EXISTS
      FOR (gt:GrammarTopic) REQUIRE gt.name IS UNIQUE;
    `);

    // --- Create Concepts ---
    await session.run(`
      MERGE (pronouns:GrammarTopic:Concept {id: 'sp_gr_001', name: 'Pronomes Pessoais', level: 'Beginner'})
      MERGE (presInd:GrammarTopic:Concept {id: 'sp_gr_002', name: 'Presente do Indicativo', level: 'Beginner'})
      MERGE (pretImp:GrammarTopic:Concept {id: 'sp_gr_003', name: 'Pretérito Imperfeito', level: 'Intermediate'})
      MERGE (pretPerf:GrammarTopic:Concept {id: 'sp_gr_004', name: 'Pretérito Perfeito', level: 'Intermediate'})
      MERGE (artigos:GrammarTopic:Concept {id: 'sp_gr_005', name: 'Artigos Definidos e Indefinidos', level: 'Beginner'})
      MERGE (subjonctifPres:GrammarTopic:Concept {id: 'sp_gr_006', name: 'Subjuntivo Presente', level: 'Advanced'})
      MERGE (conditionnel:GrammarTopic:Concept {id: 'sp_gr_007', name: 'Modo Condicional', level: 'Advanced'});
    `);

    // --- Create Relationships ---
    await session.run(`
      MATCH (pronouns:Concept {id: 'sp_gr_001'}), (presInd:Concept {id: 'sp_gr_002'})
      MERGE (presInd)-[:DEPENDS_ON]->(pronouns);

      MATCH (presInd:Concept {id: 'sp_gr_002'}), (pretImp:Concept {id: 'sp_gr_003'})
      MERGE (pretImp)-[:DEPENDS_ON]->(presInd);

      MATCH (presInd:Concept {id: 'sp_gr_002'}), (pretPerf:Concept {id: 'sp_gr_004'})
      MERGE (pretPerf)-[:DEPENDS_ON]->(presInd);

      MATCH (presInd:Concept {id: 'sp_gr_002'}), (subjonctifPres:Concept {id: 'sp_gr_006'})
      MERGE (subjonctifPres)-[:DEPENDS_ON]->(presInd);

      MATCH (pretImp:Concept {id: 'sp_gr_003'}), (subjonctifPres:Concept {id: 'sp_gr_006'})
      MERGE (subjonctifPres)-[:DEPENDS_ON]->(pretImp);

      MATCH (pretImp:Concept {id: 'sp_gr_003'}), (conditionnel:Concept {id: 'sp_gr_007'})
      MERGE (conditionnel)-[:DEPENDS_ON]->(pretImp);
    `);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('An error occurred during seeding:', error);
  } finally {
    if (session) {
      await session.close();
    }
    await driver.close();
  }
}

// Execute the seeding function
seedDatabase()
  .then(() => console.log('Script finished.'))
  .catch((error) => console.error('Script failed:', error));
