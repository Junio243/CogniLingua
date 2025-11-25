// --- Constraints to ensure unique identifiers ---
CREATE CONSTRAINT concept_id_unique FOR (c:Concept) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT grammar_topic_name_unique FOR (gt:GrammarTopic) REQUIRE gt.name IS UNIQUE;
CREATE CONSTRAINT module_id_unique FOR (m:Module) REQUIRE m.id IS UNIQUE;
CREATE CONSTRAINT vocabulary_id_unique FOR (v:Vocabulary) REQUIRE v.id IS UNIQUE;

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

// --- Learning Modules (Básico) ---
CREATE (bas1:Module {
  id: 'basico-1',
  title: 'Básico 1 - Saudações e Apresentações',
  level: 'Básico',
  order: 1,
  objectives: [
    'Cumprimentar e despedir-se de forma natural.',
    'Perguntar e responder informações pessoais simples.',
    'Se apresentar e dizer de onde vem.'
  ],
  completionCriteria: {
    minAccuracyPercent: 80,
    minExercises: 8,
    minVocabulary: 6
  },
  tags: ['Básico', 'Saudações', 'Apresentações']
});

CREATE (bas2:Module {
  id: 'basico-2',
  title: 'Básico 2 - Rotina e Números',
  level: 'Básico',
  order: 2,
  objectives: [
    'Descrever a rotina diária com verbos básicos.',
    'Contar de 1 a 20 e usar números em contextos simples.',
    'Fazer perguntas sobre horários e compromissos.'
  ],
  completionCriteria: {
    minAccuracyPercent: 80,
    minExercises: 10,
    minVocabulary: 7
  },
  tags: ['Básico', 'Rotina', 'Números']
});

CREATE (bas3:Module {
  id: 'basico-3',
  title: 'Básico 3 - Compras e Deslocamentos',
  level: 'Básico',
  order: 3,
  objectives: [
    'Pedir preços e negociar em lojas ou mercados.',
    'Pedir ajuda e localizar lugares na cidade.',
    'Fazer pedidos simples em restaurantes.'
  ],
  completionCriteria: {
    minAccuracyPercent: 80,
    minExercises: 12,
    minVocabulary: 8
  },
  tags: ['Básico', 'Compras', 'Cidade']
});

// --- Module prerequisites ---
(bas2)-[:DEPENDS_ON]->(bas1);
(bas3)-[:DEPENDS_ON]->(bas2);

// --- Vocabulary for Básico 1 ---
CREATE (v_bas1_hola:Vocabulary {
  id: 'bas1-hola', content: 'hola', translation: 'olá', type: 'word', theme: 'Saudações', tags: ['saudacoes', 'cotidiano'], example: 'Hola, ¿cómo estás? - Olá, como você está?', moduleId: 'basico-1'
});
CREATE (v_bas1_buenos_dias:Vocabulary {
  id: 'bas1-buenos-dias', content: 'buenos días', translation: 'bom dia', type: 'phrase', theme: 'Saudações', tags: ['saudacoes', 'periodo-dia'], example: 'Buenos días, me llamo Ana.', moduleId: 'basico-1'
});
CREATE (v_bas1_como_estas:Vocabulary {
  id: 'bas1-como-estas', content: '¿cómo estás?', translation: 'como você está?', type: 'phrase', theme: 'Saudações', tags: ['saudacoes', 'perguntas'], example: 'Hola, ¿cómo estás hoy? - Olá, como você está hoje?', moduleId: 'basico-1'
});
CREATE (v_bas1_me_llamo:Vocabulary {
  id: 'bas1-me-llamo', content: 'me llamo…', translation: 'me chamo…', type: 'phrase', theme: 'Apresentações', tags: ['apresentacoes', 'identidade'], example: 'Me llamo Carlos. - Eu me chamo Carlos.', moduleId: 'basico-1'
});
CREATE (v_bas1_soy_de:Vocabulary {
  id: 'bas1-soy-de', content: 'soy de…', translation: 'sou de…', type: 'phrase', theme: 'Apresentações', tags: ['apresentacoes', 'origem'], example: 'Soy de São Paulo. - Sou de São Paulo.', moduleId: 'basico-1'
});
CREATE (v_bas1_mucho_gusto:Vocabulary {
  id: 'bas1-mucho-gusto', content: 'mucho gusto', translation: 'muito prazer', type: 'phrase', theme: 'Saudações', tags: ['saudacoes', 'etiqueta'], example: 'Hola, soy Ana. – Mucho gusto.', moduleId: 'basico-1'
});
CREATE (v_bas1_adios:Vocabulary {
  id: 'bas1-adios', content: 'adiós', translation: 'tchau; adeus', type: 'word', theme: 'Despedidas', tags: ['despedidas', 'cotidiano'], example: 'Adiós, nos vemos mañana. - Tchau, nos vemos amanhã.', moduleId: 'basico-1'
});
CREATE (v_bas1_hasta_luego:Vocabulary {
  id: 'bas1-hasta-luego', content: 'hasta luego', translation: 'até logo', type: 'phrase', theme: 'Despedidas', tags: ['despedidas', 'cotidiano'], example: 'Hasta luego, que tengas buen día. - Até logo, tenha um bom dia.', moduleId: 'basico-1'
});

// --- Vocabulary for Básico 2 ---
CREATE (v_bas2_uno:Vocabulary {
  id: 'bas2-uno', content: 'uno', translation: 'um', type: 'word', theme: 'Números', tags: ['numeros', 'contagem'], example: 'Tengo un hermano. - Eu tenho um irmão.', moduleId: 'basico-2'
});
CREATE (v_bas2_diez:Vocabulary {
  id: 'bas2-diez', content: 'diez', translation: 'dez', type: 'word', theme: 'Números', tags: ['numeros', 'contagem'], example: 'La cita es a las diez. - A consulta é às dez.', moduleId: 'basico-2'
});
CREATE (v_bas2_veinte:Vocabulary {
  id: 'bas2-veinte', content: 'veinte', translation: 'vinte', type: 'word', theme: 'Números', tags: ['numeros', 'contagem'], example: 'Tengo veinte minutos libres. - Tenho vinte minutos livres.', moduleId: 'basico-2'
});
CREATE (v_bas2_ir_trabajo:Vocabulary {
  id: 'bas2-ir-trabajo', content: 'voy al trabajo', translation: 'vou ao trabalho', type: 'phrase', theme: 'Rotina', tags: ['rotina', 'transporte'], example: 'Cada mañana voy al trabajo en metro. - Toda manhã vou ao trabalho de metrô.', moduleId: 'basico-2'
});
CREATE (v_bas2_estudiar:Vocabulary {
  id: 'bas2-estudiar', content: 'estudiar', translation: 'estudar', type: 'word', theme: 'Rotina', tags: ['rotina', 'verbos'], example: 'Estudio español por la noche. - Eu estudo espanhol à noite.', moduleId: 'basico-2'
});
CREATE (v_bas2_tomar_cafe:Vocabulary {
  id: 'bas2-tomar-cafe', content: 'tomo café por la mañana', translation: 'tomo café pela manhã', type: 'phrase', theme: 'Rotina', tags: ['rotina', 'alimentacao'], example: 'Siempre tomo café por la mañana. - Sempre tomo café pela manhã.', moduleId: 'basico-2'
});
CREATE (v_bas2_que_hora:Vocabulary {
  id: 'bas2-que-hora', content: '¿a qué hora...?', translation: 'a que horas...?', type: 'phrase', theme: 'Horários', tags: ['perguntas', 'horarios'], example: '¿A qué hora empieza la clase? - A que horas começa a aula?', moduleId: 'basico-2'
});
CREATE (v_bas2_tengo_reunion:Vocabulary {
  id: 'bas2-tengo-reunion', content: 'tengo una reunión', translation: 'tenho uma reunião', type: 'phrase', theme: 'Rotina', tags: ['trabalho', 'compromissos'], example: 'Hoy tengo una reunión a las tres. - Hoje tenho uma reunião às três.', moduleId: 'basico-2'
});

// --- Vocabulary for Básico 3 ---
CREATE (v_bas3_cuanto_cuesta:Vocabulary {
  id: 'bas3-cuanto-cuesta', content: '¿cuánto cuesta?', translation: 'quanto custa?', type: 'phrase', theme: 'Compras', tags: ['compras', 'perguntas'], example: '¿Cuánto cuesta esta camiseta? - Quanto custa esta camiseta?', moduleId: 'basico-3'
});
CREATE (v_bas3_quiero_esto:Vocabulary {
  id: 'bas3-quiero-esto', content: 'quiero esto', translation: 'eu quero isto', type: 'phrase', theme: 'Compras', tags: ['compras', 'pedido'], example: 'Quiero esto en una talla más grande. - Quero isto em um tamanho maior.', moduleId: 'basico-3'
});
CREATE (v_bas3_la_cuenta:Vocabulary {
  id: 'bas3-la-cuenta', content: 'la cuenta, por favor', translation: 'a conta, por favor', type: 'phrase', theme: 'Restaurante', tags: ['restaurante', 'pedido'], example: 'Camarero, la cuenta, por favor. - Garçom, a conta, por favor.', moduleId: 'basico-3'
});
CREATE (v_bas3_donde_bano:Vocabulary {
  id: 'bas3-donde-bano', content: '¿dónde está el baño?', translation: 'onde fica o banheiro?', type: 'phrase', theme: 'Cidade', tags: ['localizacao', 'perguntas'], example: 'Disculpa, ¿dónde está el baño? - Com licença, onde fica o banheiro?', moduleId: 'basico-3'
});
CREATE (v_bas3_necesito_ayuda:Vocabulary {
  id: 'bas3-necesito-ayuda', content: 'necesito ayuda', translation: 'preciso de ajuda', type: 'phrase', theme: 'Cidade', tags: ['socorro', 'perguntas'], example: 'Perdón, necesito ayuda para encontrar el hotel. - Perdão, preciso de ajuda para encontrar o hotel.', moduleId: 'basico-3'
});
CREATE (v_bas3_estoy_buscando:Vocabulary {
  id: 'bas3-estoy-buscando', content: 'estoy buscando…', translation: 'estou procurando…', type: 'phrase', theme: 'Cidade', tags: ['localizacao', 'perguntas'], example: 'Estoy buscando la estación de metro. - Estou procurando a estação de metrô.', moduleId: 'basico-3'
});
CREATE (v_bas3_girar_derecha:Vocabulary {
  id: 'bas3-girar-derecha', content: 'gira a la derecha', translation: 'vire à direita', type: 'phrase', theme: 'Direções', tags: ['direcoes', 'orientacao'], example: 'Gira a la derecha después del semáforo. - Vire à direita depois do semáforo.', moduleId: 'basico-3'
});
CREATE (v_bas3_mas_barato:Vocabulary {
  id: 'bas3-mas-barato', content: '¿tiene algo más barato?', translation: 'tem algo mais barato?', type: 'phrase', theme: 'Compras', tags: ['compras', 'negociacao'], example: '¿Tiene algo más barato en este color? - Tem algo mais barato nessa cor?', moduleId: 'basico-3'
});

// --- Relationships between modules and vocabulary ---
(bas1)-[:CONTAINS]->(v_bas1_hola);
(bas1)-[:CONTAINS]->(v_bas1_buenos_dias);
(bas1)-[:CONTAINS]->(v_bas1_como_estas);
(bas1)-[:CONTAINS]->(v_bas1_me_llamo);
(bas1)-[:CONTAINS]->(v_bas1_soy_de);
(bas1)-[:CONTAINS]->(v_bas1_mucho_gusto);
(bas1)-[:CONTAINS]->(v_bas1_adios);
(bas1)-[:CONTAINS]->(v_bas1_hasta_luego);

(bas2)-[:CONTAINS]->(v_bas2_uno);
(bas2)-[:CONTAINS]->(v_bas2_diez);
(bas2)-[:CONTAINS]->(v_bas2_veinte);
(bas2)-[:CONTAINS]->(v_bas2_ir_trabajo);
(bas2)-[:CONTAINS]->(v_bas2_estudiar);
(bas2)-[:CONTAINS]->(v_bas2_tomar_cafe);
(bas2)-[:CONTAINS]->(v_bas2_que_hora);
(bas2)-[:CONTAINS]->(v_bas2_tengo_reunion);

(bas3)-[:CONTAINS]->(v_bas3_cuanto_cuesta);
(bas3)-[:CONTAINS]->(v_bas3_quiero_esto);
(bas3)-[:CONTAINS]->(v_bas3_la_cuenta);
(bas3)-[:CONTAINS]->(v_bas3_donde_bano);
(bas3)-[:CONTAINS]->(v_bas3_necesito_ayuda);
(bas3)-[:CONTAINS]->(v_bas3_estoy_buscando);
(bas3)-[:CONTAINS]->(v_bas3_girar_derecha);
(bas3)-[:CONTAINS]->(v_bas3_mas_barato);
