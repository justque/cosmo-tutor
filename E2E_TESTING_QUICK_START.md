# E2E Testing Quick Start Guide

**For:** Cosmo Guided Learning System  
**Location:** `/Users/jietian/Desktop/LearnClaudeCode/chatbot`  
**Full Checklist:** `E2E_TESTING_CHECKLIST.md`

---

## 5-Minute Setup

### 1. Verify Prerequisites
```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot

# Check Node version
node --version  # Should be 18+

# Check dependencies installed
npm list | grep -E "next|react|supabase|anthropic"

# Verify .env.local exists
ls -la .env.local
```

### 2. Verify Database
```bash
# Check Supabase migrations applied:
# - lesson_progress table exists
# - Row-level security (RLS) policies in place
# - Test parent account created
```

### 3. Start Dev Server
```bash
npm run dev
```

Expected output:
```
> next dev
> localhost:3000
```

---

## 15-Minute Happy Path Test

**Start:** Fresh login | **End:** Full topic completed | **Status:** Pass/Fail

### Phase 1: Auth (2 min)
1. Navigate to `http://localhost:3000`
2. Sign up: `test-user@example.com` / `Test123!`
3. Create child profile: "Test Kid"
4. Click "Start Learning"
5. **Expected:** Redirects to `/learn` page with sidebar visible

### Phase 2: First Lesson (8 min)
1. Click "🚀 Exploring Space"
2. Read explanation: "Did you know that our planet Earth..."
3. Answer Step 1: Click "B. Gravity pulls us down"
4. **Expected:** Green highlight, success message, auto-advance to Step 2
5. Repeat for Steps 2, 3, 4:
   - Step 2: "B. It gives us light and heat"
   - Step 3: "B. They orbit (go around) the Sun"
   - Step 4: "B. Giant balls of burning gas"
6. **Expected:** After Step 4, chat mode activates

### Phase 3: Chat Mode (3 min)
1. Type: "Tell me more about planets"
2. Click "Send"
3. **Expected:** Cosmo responds with kid-friendly text
4. Verify no console errors

### Phase 4: Resume Test (2 min)
1. Navigate to different topic: "🦁 Amazing Animals"
2. Complete Step 1: Answer "D. Millions"
3. Refresh page (F5)
4. **Expected:** Still on Animals, Step 2 of 4 (not reset to Step 1)

---

## Test Checklist: Core Features Only

Quick version - test these 8 features:

### Feature 1: Dev Server ✓
- [ ] `npm run dev` starts without errors
- [ ] Server listens on localhost:3000

### Feature 2: Authentication ✓
- [ ] Can sign up with email/password
- [ ] Can login
- [ ] Dashboard shows child profiles

### Feature 3: Navigation ✓
- [ ] Can select topic from sidebar
- [ ] URL changes to include topicId
- [ ] Correct lesson displays

### Feature 4: First Checkpoint ✓
- [ ] Lesson prompt displays
- [ ] 4 answer options show
- [ ] Can click option to submit

### Feature 5: Correct Answer ✓
- [ ] Correct answer turns green
- [ ] Success message displays
- [ ] Auto-advances to next step

### Feature 6: Incorrect Answer ✓
- [ ] Wrong answer triggers error message
- [ ] Hint displays below message
- [ ] Can retry with new answer
- [ ] Correct answer then advances

### Feature 7: Lesson Completion ✓
- [ ] After 4 steps, switches to chat mode
- [ ] Chat input becomes active
- [ ] Topic shows ✓ in sidebar

### Feature 8: Resume ✓
- [ ] Can navigate away from lesson
- [ ] Returning to topic resumes at correct step
- [ ] Page refresh maintains progress

---

## Common Issues & Solutions

### Issue: "npm run dev" fails with missing dependencies
```bash
# Solution:
npm install
npm run dev
```

### Issue: "Cannot connect to Supabase"
```bash
# Verify:
# - Supabase project is running
# - .env.local has correct NEXT_PUBLIC_SUPABASE_URL
# - Auth credentials are valid
```

### Issue: Lesson won't load / "Lesson step not found"
```bash
# Check:
# - Topic ID in URL matches lessons.ts (space, animals, weather, human_body, plants)
# - Database lesson_progress table exists
# - No RLS policy blocking access
```

### Issue: Progress not saving
```bash
# Verify:
# - SUPABASE_SERVICE_ROLE_KEY is in .env.local
# - lesson_progress table has correct schema
# - Child profile exists and has correct ID
```

### Issue: Chat response is slow (>5 sec)
```bash
# Check:
# - ANTHROPIC_API_KEY is valid
# - Network is stable
# - Claude API isn't rate-limited
# - No console errors
```

### Issue: Voice input not working
```bash
# Browser requirement:
# - Allow microphone permission
# - Use HTTPS (localhost:3000 is allowed)
# - Try Chrome/Firefox/Safari (not all browsers support Web Speech API)
```

---

## Performance Benchmarks

Expected performance on local machine:

| Metric | Target | Pass Criteria |
|--------|--------|---------------|
| Dev server startup | < 10s | Server ready for requests |
| Page load time | < 3s | First render visible |
| Lesson step display | < 500ms | Animation starts immediately |
| Chat response | 2-5s | Cosmo replies promptly |
| Step progression | < 1s | Next step UI appears |

---

## Database Verification

### Check Lesson Progress Saved

```sql
-- Login to Supabase SQL Editor and run:
SELECT * FROM lesson_progress WHERE child_id = 'YOUR_CHILD_ID';

-- Expected columns:
-- id, child_id, topic_id, current_step, completed_at, created_at, updated_at
```

### Verify RLS Policies

```sql
-- Parent should only see own children:
SELECT * FROM lesson_progress 
WHERE child_id IN (
  SELECT id FROM children WHERE parent_id = auth.uid()
);

-- Expected: Only records for current user's children
```

---

## Test Data Setup

### Create Test Parent Account

1. Navigate to `http://localhost:3000`
2. Click "Sign Up as Parent"
3. Use:
   - Email: `test-parent@example.com`
   - Password: `Test123!SecurePassword`
4. Create child:
   - Name: "Test Child"
   - Age: "6"
   - Interests: "Space, Animals"

### Create Multiple Children (for isolation testing)

In parent dashboard:
1. Create Child 1: "Alice" (for Space/Animals testing)
2. Create Child 2: "Bob" (for Weather/Human Body testing)
3. Create Child 3: "Charlie" (for Plants testing)

### Verify Child Isolation

1. With Child 1, complete Space topic
2. Switch to Child 2
3. Verify Space shows 0/4 (not completed)

---

## Reporting Issues

If tests fail, document:

1. **What failed?** (specific test section)
2. **Expected behavior?** (from checklist)
3. **Actual behavior?** (what happened instead)
4. **Steps to reproduce:**
   - Step 1
   - Step 2
   - Step 3
5. **Console errors?** (screenshot or copy error)
6. **Environment:**
   - Node version: `node --version`
   - npm version: `npm --version`
   - Browser: Chrome / Firefox / Safari
   - OS: macOS / Linux / Windows

### Example Bug Report

```markdown
## Issue: Lesson doesn't progress after correct answer

**Section:** 4.2 - Progress to Next Step  
**Expected:** Auto-advance to Step 2  
**Actual:** Stays on Step 1, "Step 1 of 4" indicator unchanged  

**Steps to Reproduce:**
1. Select Space topic
2. Answer Step 1 correctly: "B. Gravity"
3. Wait 2 seconds

**Console Error:**
```
TypeError: cannot read property 'steps' of undefined
at getLessonStep (lessonEngine.ts:12)
```

**Environment:**
- Node: v18.16.0
- Browser: Chrome 124.0.6367.60
- OS: macOS 14.4
```

---

## Test Completion Checklist

- [ ] Printed E2E_TESTING_CHECKLIST.md
- [ ] Setup environment (Node, .env.local, Database)
- [ ] Started dev server successfully
- [ ] Completed 15-minute happy path test
- [ ] Ran all 8 core feature tests
- [ ] Verified no console errors
- [ ] Documented any issues found
- [ ] Ready to approve for deployment

**Tester Name:** ___________________  
**Date:** ___________________  
**Overall Status:** [ ] PASS [ ] FAIL  

---

## Next Steps

1. **If all tests pass:**
   - Review documentation
   - Prepare deployment to Vercel
   - Set up environment variables on Vercel

2. **If tests fail:**
   - Document issues using format above
   - Fix high-priority bugs
   - Re-run failing tests
   - Repeat until all pass

3. **Before deployment:**
   - Run FULL checklist (not just quick start)
   - Test on real device (phone/tablet)
   - Verify production Supabase project
   - Check rate limiting (50 calls/day)

---

## Helpful Commands

```bash
# Check server logs
npm run dev 2>&1 | tee dev.log

# Check for TypeScript errors
npx tsc --noEmit

# Build for production (verify no errors)
npm run build

# Run ESLint
npm run lint

# View database schema (Supabase)
# Dashboard > SQL Editor > paste schema queries

# Test single topic
# Visit: http://localhost:3000/learn?topicId=space

# Test with specific child
# Visit: http://localhost:3000/learn?childId=UUID&topicId=space
```

---

**For detailed test descriptions, see:** `E2E_TESTING_CHECKLIST.md`
