// Custom A* (adaptive) that blends concept difficulty with proficiency/FSRS context
// Parameters:
//   $studentId -> aluno ativo
//   $sourceId  -> conceito de origem (atual)
//   $targetId  -> conceito alvo (próximo objetivo)
//
// Requer o GDS (Graph Data Science) plugin.

:param studentId => 'student-123';
:param sourceId => 'concept:start';
:param targetId => 'concept:goal';

MATCH (student:Student { id: $studentId })
WITH student
CALL {
  WITH student
  // Mapa de proficiência declarativa do estudante
  MATCH (student)-[state:MASTERS]->(c:Concept)
  RETURN apoc.map.fromPairs(
    collect([c.id, coalesce(state.mastery, 0.5)])
  ) AS proficiencyMap;
}
CALL {
  WITH student
  // Mapa de estabilidade FSRS a partir de revisões anteriores
  MATCH (student)-[review:REVIEWED]->(c:Concept)
  RETURN apoc.map.fromPairs(
    collect([c.id, coalesce(review.fsrsStability, 0.5)])
  ) AS stabilityMap;
}

// Cria projeção temporária com pesos baseados em dificuldade de nó/aresta
CALL gds.graph.project.cypher(
  'adaptive-pathfinding',
  'MATCH (c:Concept) RETURN id(c) AS id, c.id AS conceptId, coalesce(c.difficulty, 0.5) AS difficulty',
  'MATCH (a:Concept)-[r:PREREQUISITE_OF]->(b:Concept) RETURN id(a) AS source, id(b) AS target, coalesce(r.difficulty, 0.5) AS baseDifficulty',
  {
    relationshipProperties: 'baseDifficulty',
    nodeProperties: 'difficulty'
  }
) YIELD graphName;

MATCH (start:Concept { id: $sourceId }), (goal:Concept { id: $targetId })
CALL gds.shortestPath.astar.stream(
  graphName,
  {
    startNode: id(start),
    endNode: id(goal),
    relationshipWeightProperty: 'baseDifficulty',
    // Heurística: dificuldade como "latitude/longitude" sintética
    latitudeProperty: 'difficulty',
    longitudeProperty: 'difficulty'
  }
)
YIELD totalCost, nodeIds, path
WITH graphName, totalCost, nodeIds, path, proficiencyMap, stabilityMap

// Ajusta custo: quanto menor proficiência/estabilidade, maior peso da transição
WITH graphName, path, nodeIds,
     totalCost + reduce(adjust = 0.0, nodeId IN nodeIds |
       adjust + (1 - coalesce(proficiencyMap[gds.util.asNode(nodeId).id], 0.5))
             + (1 - coalesce(stabilityMap[gds.util.asNode(nodeId).id], 0.5)) * 0.5
     ) AS adaptiveCost
ORDER BY adaptiveCost ASC
LIMIT 1

CALL gds.graph.drop(graphName) YIELD graphName AS dropped;

RETURN adaptiveCost AS cost,
       [nodeId IN nodeIds | gds.util.asNode(nodeId).id] AS conceptPath,
       path;
