const fs = require('fs');
let code = fs.readFileSync('src/services/supabaseService.js', 'utf8');

// Helper to wrap function body
function addResolvers(funcName, args, resolversMap) {
  const regex = new RegExp(`export async function ${funcName}\\(${args}\\) \\{([\\s\\S]*?\\n\\})`);
  code = code.replace(regex, (match, body) => {
    let newBody = body;
    let prep = `\n  if (!supabase) return;\n`;
    for (const [arg, table] of Object.entries(resolversMap)) {
      prep += `  const real_${arg} = await resolveId('${table}', ${arg});\n`;
      // Replace usages in body (excluding the declaration if any, but since we match after {, it's fine)
      const varRegex = new RegExp(`\\b${arg}\\b`, 'g');
      newBody = newBody.replace(varRegex, `real_${arg}`);
    }
    // ensure early return if resolution fails
    prep += `  if (${Object.keys(resolversMap).map(arg => `!real_${arg}`).join(' || ')}) return;\n`;
    
    // Some functions check !supabase themselves, so we might duplicate it, but it's fine.
    // Also, we remove the original `if (!supabase) return null;` if it exists.
    newBody = newBody.replace(/if \(!supabase\) return[^;]*;/g, '');
    
    return `export async function ${funcName}(${args}) {${prep}${newBody}`;
  });
}

// toggleTopicCompletion
addResolvers('toggleTopicCompletion', 'userId, topicId, disciplineId', {
  topicId: 'topics',
  disciplineId: 'disciplines'
});

// fetchTopicProgress
addResolvers('fetchTopicProgress', 'userId, disciplineId', {
  disciplineId: 'disciplines'
});

// getOrCreateStudyPlan
addResolvers('getOrCreateStudyPlan', 'userId, topicId', {
  topicId: 'topics'
});

// fetchModulesAndLessons
addResolvers('fetchModulesAndLessons', 'topicId, userId', {
  topicId: 'topics'
});

// completeLesson
addResolvers('completeLesson', 'userId, lessonId, topicId', {
  lessonId: 'lessons',
  topicId: 'topics'
});

// fetchLessonQuiz
addResolvers('fetchLessonQuiz', 'lessonId', {
  lessonId: 'lessons'
});

// fetchTopicSimulado
addResolvers('fetchTopicSimulado', 'topicId', {
  topicId: 'topics'
});

// startStudySession
addResolvers('startStudySession', 'userId, disciplineId, topicId', {
  disciplineId: 'disciplines',
  topicId: 'topics'
});

// addWrongQuestionToReview
// This one receives questionObj, but uses disciplineId and topicId
addResolvers('addWrongQuestionToReview', 'disciplineId, topicId, questionObj', {
  disciplineId: 'disciplines',
  topicId: 'topics'
});

// fetchFlashcards
// Uses disciplineId, topicId
addResolvers('fetchFlashcards', 'disciplineId, topicId = null', {
  disciplineId: 'disciplines',
});
// Special fix for fetchFlashcards since topicId is optional
code = code.replace(/const real_topicId = await resolveId\('topics', topicId = null\);/, "const real_topicId = topicId ? await resolveId('topics', topicId) : null;");
// wait, the regex in addResolvers doesn't handle optional args well. I'll just rewrite fetchFlashcards manually if needed.

fs.writeFileSync('src/services/supabaseService.js', code);
console.log("Transformation complete.");
