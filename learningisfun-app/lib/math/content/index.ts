import templates from './templates.json';

/**
 * Content template structure
 */
export interface ContentTemplate {
  text: string;
  vars: string[];
}

export interface ModuleContent {
  wordProblems: {
    he: ContentTemplate[];
    en: ContentTemplate[];
  };
}

export type Language = 'he' | 'en';

/**
 * Get word problem templates for a specific module and language
 */
export function getWordProblems(
  moduleName: string,
  language: Language = 'he'
): ContentTemplate[] {
  const moduleContent = templates[moduleName as keyof typeof templates] as ModuleContent | undefined;

  if (!moduleContent) {
    console.warn(`No content found for module: ${moduleName}`);
    return [];
  }

  const wordProblems = moduleContent.wordProblems[language];

  if (!wordProblems || wordProblems.length === 0) {
    console.warn(`No word problems found for module: ${moduleName}, language: ${language}`);
    return [];
  }

  return wordProblems;
}

/**
 * Get a random word problem template for a module
 */
export function getRandomWordProblem(
  moduleName: string,
  language: Language = 'he'
): ContentTemplate | null {
  const problems = getWordProblems(moduleName, language);

  if (problems.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * problems.length);
  return problems[randomIndex];
}

/**
 * Fill template variables in a text string
 * Example: fillTemplate("Emma has {total} cookies", { total: 10 })
 * Returns: "Emma has 10 cookies"
 */
export function fillTemplate(
  template: string,
  variables: Record<string, string | number>
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`;
    result = result.replace(new RegExp(placeholder, 'g'), String(value));
  }

  return result;
}

/**
 * Get a random word problem with variables filled in
 */
export function generateWordProblem(
  moduleName: string,
  variables: Record<string, string | number>,
  language: Language = 'he'
): string | null {
  const template = getRandomWordProblem(moduleName, language);

  if (!template) {
    return null;
  }

  return fillTemplate(template.text, variables);
}

/**
 * Export all templates (useful for AI generation scripts)
 */
export function getAllTemplates() {
  return templates;
}

/**
 * Validate that all required variables are provided for a template
 */
export function validateVariables(
  template: ContentTemplate,
  variables: Record<string, string | number>
): { valid: boolean; missing: string[] } {
  const missing = template.vars.filter(varName => !(varName in variables));

  return {
    valid: missing.length === 0,
    missing
  };
}
