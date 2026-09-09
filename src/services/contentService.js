const markdownFiles = import.meta.glob('/src/data/content/**/*.md', { query: '?raw', import: 'default', eager: true });

export function fetchTopicContent(disciplineId, topicId) {
  const path = `/src/data/content/${disciplineId}/${topicId}.md`;
  return markdownFiles[path] || null;
}
