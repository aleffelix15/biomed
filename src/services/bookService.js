export async function searchBooks(query) {
  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`);
    if (!response.ok) {
      throw new Error(`OpenLibrary API errored with status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.docs && data.docs.length > 0) {
      const doc = data.docs[0];
      return {
        title: doc.title,
        author: doc.author_name ? doc.author_name.join(', ') : 'Desconhecido',
        edition: doc.edition_count ? `${doc.edition_count} edições disponíveis` : '',
        description: doc.first_publish_year ? `Publicado pela primeira vez em ${doc.first_publish_year}` : 'Sem detalhes',
        work_key: doc.key // e.g. "/works/OL123456W"
      };
    }
    return null;
  } catch (err) {
    console.error(`Erro ao buscar livro "${query}":`, err.message);
    throw err;
  }
}
