// Camada de serviços. Hoje apenas devolve os dados mock de forma assíncrona
// (simulando uma chamada de API), para que as telas já consumam dados
// "como se" viessem de um backend. Quando o backend real existir, só esta
// camada muda — telas e componentes continuam iguais.
import { DISCIPLINES } from "../data/mock/disciplines";
import { BOOKS } from "../data/mock/books";
import { TOPICS, genericTopics } from "../data/mock/topics";

export async function fetchDisciplines() {
  return Promise.resolve(DISCIPLINES);
}

export async function fetchBooksByDiscipline(disciplineId) {
  return Promise.resolve(BOOKS.filter((b) => b.disciplineId === disciplineId));
}

export async function fetchTopicsByDiscipline(discipline) {
  return Promise.resolve(TOPICS[discipline.id] || genericTopics(discipline.topicsCount));
}
