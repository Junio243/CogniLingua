// --- Constraints to ensure unique identifiers ---
CREATE CONSTRAINT concept_id_unique FOR (c:Concept) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT grammar_topic_name_unique FOR (gt:GrammarTopic) REQUIRE gt.name IS UNIQUE;

// --- Create sample Concepts for Spanish Grammar ---
CREATE (pronouns:GrammarTopic:Concept {id: 'sp_gr_001', name: 'Pronomes Pessoais', level: 'Beginner'});
CREATE (presInd:GrammarTopic:Concept {id: 'sp_gr_002', name: 'Presente do Indicativo', level: 'Beginner'});
CREATE (pretImp:GrammarTopic:Concept {id: 'sp_gr_003', name: 'Pretérito Imperfeito', level: 'Intermediate'});
CREATE (pretPerf:GrammarTopic:Concept {id: 'sp_gr_004', name: 'Pretérito Perfeito', level: 'Intermediate'});
CREATE (artigos:GrammarTopic:Concept {id: 'sp_gr_005', name: 'Artigos Definidos e Indefinidos', level: 'Beginner'});
CREATE (subjonctifPres:GrammarTopic:Concept {id: 'sp_gr_006', name: 'Subjuntivo Presente', level: 'Advanced'});
CREATE (conditionnel:GrammarTopic:Concept {id: 'sp_gr_007', name: 'Modo Condicional', level: 'Advanced'});

// --- Define Prerequisite Relationships (:DEPENDS_ON) ---
// Example: Presente do Indicativo depends on Pronomes Pessoais
(presInd)-[:DEPENDS_ON]->(pronouns);
// Example: Pretérito Imperfeito depends on Presente do Indicativo
(pretImp)-[:DEPENDS_ON]->(presInd);
// Example: Pretérito Perfeito depends on Presente do Indicativo
(pretPerf)-[:DEPENDS_ON]->(presInd);
// Example: Subjuntivo Presente depends on Presente do Indicativo and Pretérito Imperfeito
(subjonctifPres)-[:DEPENDS_ON]->(presInd);
(subjonctifPres)-[:DEPENDS_ON]->(pretImp);
// Example: Modo Condicional depends on Pretérito Imperfeito
(conditionnel)-[:DEPENDS_ON]->(pretImp);

// --- Optional: Reverse relationships (can be inferred) ---
// (pronouns)<-[:IS_PREREQUISITE_FOR]-(presInd);
// (presInd)<-[:IS_PREREQUISITE_FOR]-(pretImp);
// (presInd)<-[:IS_PREREQUISITE_FOR]-(pretPerf);
// (presInd)<-[:IS_PREREQUISITE_FOR]-(subjonctifPres);
// (pretImp)<-[:IS_PREREQUISITE_FOR]-(subjonctifPres);
// (pretImp)<-[:IS_PREREQUISITE_FOR]-(conditionnel);
