import { LESSONS } from './lib/lessons.ts';

console.log('=== LESSONS CHECKPOINT VALIDATION ===\n');

let totalSteps = 0;
let allValid = true;

for (const [topicId, lesson] of Object.entries(LESSONS)) {
  console.log(`\n${topicId.toUpperCase()} (${lesson.steps.length} steps)`);
  console.log('-'.repeat(70));
  
  for (const step of lesson.steps) {
    totalSteps++;
    const cp = step.checkpoint;
    
    const valid = (
      typeof cp.question === 'string' && cp.question.length > 0 &&
      Array.isArray(cp.options) && cp.options.length === 4 &&
      typeof cp.correctIndex === 'number' && cp.correctIndex >= 0 && cp.correctIndex <= 3
    );
    
    const status = valid ? '✓' : '✗';
    const hintStr = cp.hint ? '[hint]' : '';
    console.log(`  ${status} ${step.id}: Opts=${cp.options.length} CorIdx=${cp.correctIndex} ${hintStr}`);
    
    if (!valid) {
      allValid = false;
    }
  }
}

console.log(`\n${'='.repeat(70)}`);
console.log(`Total steps: ${totalSteps}`);
console.log(`RESULT: ${allValid ? '✓ ALL VALID' : '✗ ISSUES FOUND'}`);
