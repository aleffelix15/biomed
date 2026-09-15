const fs = require('fs');
let code = fs.readFileSync('src/services/supabaseService.js', 'utf8');

code = code.replace(/localCategoryMap\[d\.id\]/g, 'localCategoryMap[d.slug || d.id]');
code = code.replace(/localTopicCountMap\[d\.id\]/g, 'localTopicCountMap[d.slug || d.id]');
code = code.replace(/progressMap\[d\.id\]/g, 'progressMap[d.slug || d.id]');

code = code.replace(/select\('discipline_id, progress_percent'\)/, "select('discipline_slug, progress_percent')");
code = code.replace(/acc\[curr\.discipline_id\] = curr\.progress_percent;/, 'acc[curr.discipline_slug] = curr.progress_percent;');

// Insert the resolve helper at the top after imports, but only if not already present
if (!code.includes('export async function resolveId(table, slug)')) {
  code = code.replace(/import \* as content from '.\/contentService';\n/, `import * as content from './contentService';\n\n// ==========================================\n// UTILS: SLUG -> UUID RESOLVER (DUAL-KEY)\n// ==========================================\nconst uuidCache = new Map();\n\nexport async function resolveId(table, slug) {\n  if (!supabase || !slug) return null;\n  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) return slug;\n  \n  const cacheKey = \`\${table}:\${slug}\`;\n  if (uuidCache.has(cacheKey)) return uuidCache.get(cacheKey);\n\n  const { data, error } = await supabase.from(table).select('id').eq('slug', slug).single();\n  if (error || !data) {\n    console.error(\`[resolveId] Failed to resolve slug '\${slug}' in table '\${table}'\`, error);\n    return null;\n  }\n  \n  uuidCache.set(cacheKey, data.id);\n  return data.id;\n}\n\n`);
}

fs.writeFileSync('src/services/supabaseService.js', code);
console.log("Done.");

