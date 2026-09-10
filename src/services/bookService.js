export async function searchBooks(query, limit = 1) {
  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`OpenLibrary API errored with status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.docs && data.docs.length > 0) {
      if (limit === 1) {
        const doc = data.docs[0];
        return {
          id: doc.key,
          title: doc.title,
          author: doc.author_name ? doc.author_name.join(', ') : 'Desconhecido',
          edition: doc.edition_count ? `${doc.edition_count} edições disponíveis` : '',
          description: doc.first_publish_year ? `Publicado pela primeira vez em ${doc.first_publish_year}` : 'Sem detalhes',
          work_key: doc.key,
          cover_url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null
        };
      } else {
        return data.docs.map(doc => ({
          id: doc.key,
          title: doc.title,
          author: doc.author_name ? doc.author_name.join(', ') : 'Desconhecido',
          edition: doc.edition_count ? `${doc.edition_count} edições disponíveis` : '',
          description: doc.first_publish_year ? `Publicado pela primeira vez em ${doc.first_publish_year}` : 'Sem detalhes',
          work_key: doc.key,
          cover_url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null
        }));
      }
    }
    return limit === 1 ? null : [];
  } catch (err) {
    console.error(`Erro ao buscar livro "${query}":`, err.message);
    throw err;
  }
}

export async function searchBooksByDiscipline(disciplineName) {
  return searchBooks(`subject:${disciplineName} OR title:${disciplineName}`, 5);
}

export async function searchBooksByTopic(topicName) {
  return searchBooks(`title:${topicName}`, 3);
}

export async function fetchAllBooks() {
  return searchBooks('Biomedicina OR Anatomia OR Fisiologia OR Farmacologia', 15);
}
