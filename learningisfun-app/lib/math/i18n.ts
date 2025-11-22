/**
 * Internationalization for Math Modules
 * Provides localized strings for hints, explanations, and feedback
 */

import type { Language } from './types';

interface ModuleStrings {
  hints: {
    [key: string]: string;
  };
  feedback: {
    default: string;
    tip: string;
    nextSteps: string;
  };
}

const translations: Record<string, Record<Language, ModuleStrings>> = {
  multiplication: {
    he: {
      hints: {
        default: '💡 נסי להשתמש בטבלת הכפל',
      },
      feedback: {
        default: 'תרגלי עוד תרגילי כפל',
        tip: 'תרגול קבוע של טבלת הכפל עוזר מאוד',
        nextSteps: 'המשיכי לתרגל תרגילים דומים',
      },
    },
    en: {
      hints: {
        default: '💡 Try using the multiplication table',
      },
      feedback: {
        default: 'Practice more multiplication exercises',
        tip: 'Regular practice of multiplication tables helps a lot',
        nextSteps: 'Continue practicing similar exercises',
      },
    },
  },
  division: {
    he: {
      hints: {
        default: '💡 נסי לחשוב על טבלאות הכפל שאת מכירה',
      },
      feedback: {
        default: 'תרגלי עוד תרגילי חילוק',
        tip: 'חילוק הוא הפוך של כפל',
        nextSteps: 'המשיכי לתרגל תרגילים דומים',
      },
    },
    en: {
      hints: {
        default: '💡 Try thinking about the multiplication tables you know',
      },
      feedback: {
        default: 'Practice more division exercises',
        tip: 'Division is the inverse of multiplication',
        nextSteps: 'Continue practicing similar exercises',
      },
    },
  },
  decimal: {
    he: {
      hints: {
        default: '💡 חשבי על מקום הספרה במבנה העשרוני',
      },
      feedback: {
        default: 'תרגלי עוד תרגילי מבנה עשרוני',
        tip: 'כל ספרה מייצגת כמות שונה לפי מיקומה',
        nextSteps: 'המשיכי לתרגל תרגילים דומים',
      },
    },
    en: {
      hints: {
        default: '💡 Think about the place value in the decimal system',
      },
      feedback: {
        default: 'Practice more decimal exercises',
        tip: 'Each digit represents a different amount based on its position',
        nextSteps: 'Continue practicing similar exercises',
      },
    },
  },
  'number-line': {
    he: {
      hints: {
        default: '💡 השתמשי בסימנים על ישר המספרים',
      },
      feedback: {
        default: 'תרגלי עוד תרגילי ישר מספרים',
        tip: 'ישר המספרים עוזר לראות את המרחק בין מספרים',
        nextSteps: 'המשיכי לתרגל תרגילים דומים',
      },
    },
    en: {
      hints: {
        default: '💡 Use the marks on the number line',
      },
      feedback: {
        default: 'Practice more number line exercises',
        tip: 'The number line helps visualize the distance between numbers',
        nextSteps: 'Continue practicing similar exercises',
      },
    },
  },
  fraction: {
    he: {
      hints: {
        default: '💡 חשבי על המכנה המשותף',
      },
      feedback: {
        default: 'תרגלי עוד תרגילי שברים',
        tip: 'שברים מייצגים חלקים שווים של שלם',
        nextSteps: 'המשיכי לתרגל תרגילים דומים',
      },
    },
    en: {
      hints: {
        default: '💡 Think about the common denominator',
      },
      feedback: {
        default: 'Practice more fraction exercises',
        tip: 'Fractions represent equal parts of a whole',
        nextSteps: 'Continue practicing similar exercises',
      },
    },
  },
  distributive: {
    he: {
      hints: {
        default: '💡 השתמשי בתכונת הפילוג',
      },
      feedback: {
        default: 'תרגלי עוד תרגילי תכונת הפילוג',
        tip: 'תכונת הפילוג עוזרת לפרק מספרים גדולים',
        nextSteps: 'המשיכי לתרגל תרגילים דומים',
      },
    },
    en: {
      hints: {
        default: '💡 Use the distributive property',
      },
      feedback: {
        default: 'Practice more distributive property exercises',
        tip: 'The distributive property helps break down large numbers',
        nextSteps: 'Continue practicing similar exercises',
      },
    },
  },
  'order-operations': {
    he: {
      hints: {
        default: '💡 זכרי את סדר פעולות החשבון',
      },
      feedback: {
        default: 'תרגלי עוד תרגילי סדר פעולות',
        tip: 'תמיד בצעי קודם סוגריים, אחר כך כפל/חילוק, ולבסוף חיבור/חיסור',
        nextSteps: 'המשיכי לתרגל תרגילים דומים',
      },
    },
    en: {
      hints: {
        default: '💡 Remember the order of operations',
      },
      feedback: {
        default: 'Practice more order of operations exercises',
        tip: 'Always do parentheses first, then multiplication/division, and finally addition/subtraction',
        nextSteps: 'Continue practicing similar exercises',
      },
    },
  },
};

/**
 * Get a hint for a specific module in the given language
 */
export function getModuleHint(moduleName: string, lang: Language = 'he', hintKey: string = 'default'): string {
  const moduleTranslations = translations[moduleName];
  if (!moduleTranslations) {
    return lang === 'he' ? '💡 נסי שוב' : '💡 Try again';
  }

  const langTranslations = moduleTranslations[lang];
  return langTranslations.hints[hintKey] || langTranslations.hints.default;
}

/**
 * Get feedback for a specific module in the given language
 */
export function getModuleFeedback(moduleName: string, lang: Language = 'he'): {
  default: string;
  tip: string;
  nextSteps: string;
} {
  const moduleTranslations = translations[moduleName];
  if (!moduleTranslations) {
    return {
      default: lang === 'he' ? 'תרגלי עוד' : 'Practice more',
      tip: lang === 'he' ? 'תרגול עוזר' : 'Practice helps',
      nextSteps: lang === 'he' ? 'המשיכי לתרגל' : 'Keep practicing',
    };
  }

  return moduleTranslations[lang].feedback;
}

/**
 * Get a localized explanation string
 * Replaces Hebrew-only explanations with localized versions
 */
export function getLocalizedExplanation(
  defaultExplanation: string,
  moduleName: string,
  lang: Language = 'he'
): string {
  // If we have a specific explanation, use it
  // Otherwise, use the module's default feedback
  if (defaultExplanation) {
    return defaultExplanation;
  }

  const feedback = getModuleFeedback(moduleName, lang);
  return feedback.default;
}
