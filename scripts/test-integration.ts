#!/usr/bin/env ts-node

/**
 * Integration Test for Story 15
 * Tests that the division module loads and uses pirate-themed content
 */

import { divisionModule } from '../learningisfun-app/lib/math/modules/division';

console.log('🧪 Story 15 Integration Test\n');

// Generate 50 word problems and check for pirate keywords
console.log('Generating 50 division questions...\n');

const pirateKeywords = ['קפטן', 'מטבעות', 'זהב', 'שודד', 'ספינ', 'תותח', 'אוצר', 'פנינ'];
let pirateQuestions = 0;
let totalWordProblems = 0;

for (let i = 0; i < 50; i++) {
  const question = divisionModule.generateQuestion('בינוני');

  // Check if it's a word problem (contains Hebrew text beyond just numbers and symbols)
  const hasHebrewWords = /[א-ת]{3,}/.test(question.question);
  const isWordProblem = hasHebrewWords && !question.question.includes('___');

  if (isWordProblem) {
    totalWordProblems++;

    // Check if it contains pirate keywords
    const hasPirateKeywords = pirateKeywords.some(keyword =>
      question.question.includes(keyword)
    );

    if (hasPirateKeywords) {
      pirateQuestions++;
      if (pirateQuestions <= 3) {
        console.log(`✅ Pirate Question ${pirateQuestions}:`);
        console.log(`   ${question.question}\n`);
      }
    }
  }
}

console.log(`\n📊 Results:`);
console.log(`   Total word problems generated: ${totalWordProblems}`);
console.log(`   Pirate-themed questions: ${pirateQuestions}`);
const successRate = totalWordProblems === 0 ? 0 : Math.round((pirateQuestions / totalWordProblems) * 100);
console.log(`   Success rate: ${successRate}%\n`);

if (pirateQuestions > 0) {
  console.log('✅ TEST PASSED: API is serving pirate-themed content!');
  console.log('🏴‍☠️ The content injection system is working!\n');
  process.exit(0);
} else {
  console.log('❌ TEST FAILED: No pirate content detected');
  console.log('The module may not be loading templates correctly.\n');
  process.exit(1);
}
