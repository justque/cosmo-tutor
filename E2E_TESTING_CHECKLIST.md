# End-to-End Testing Checklist: Cosmo Guided Learning System

**Date:** 2026-05-31  
**Tester:** ___________________  
**Environment:** Local Development  
**Status:** [ ] Pass [ ] Fail  

---

## Pre-Testing Setup

### Prerequisites Checklist
- [ ] Node.js 18+ is installed
- [ ] Dependencies installed with `npm install`
- [ ] `.env.local` file exists with required keys:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Supabase project is running and migrated:
  - [ ] `001_initial_schema.sql` applied
  - [ ] `002_add_lesson_progress.sql` applied
- [ ] Database has test parent account and child profile ready
- [ ] Unsplash API key configured (optional, for images)

### Expected Files Exist
- [ ] `/lib/lessons.ts` - Lesson definitions with 5 topics (Space, Animals, Weather, Human Body, Plants)
- [ ] `/lib/lessonEngine.ts` - Lesson logic functions
- [ ] `/app/learn/page.tsx` - Main learning page
- [ ] `/components/ChatPanel.tsx` - Chat/lesson UI
- [ ] `/components/LessonStep.tsx` - Checkpoint rendering
- [ ] `/components/Sidebar.tsx` - Topic navigation

---

## SECTION 1: Dev Server Startup

### Test 1.1: Server Starts Without Errors
1. Open terminal in project root: `/Users/jietian/Desktop/LearnClaudeCode/chatbot`
2. Run: `npm run dev`
3. **Expected Result:**
   - [ ] No errors in console
   - [ ] Console shows: `> next dev` with port info
   - [ ] Message appears: `Local: http://localhost:3000`
   - [ ] Server is ready to handle requests within 10 seconds

**Notes:** _______________________________________________

### Test 1.2: Dev Server Stays Running
1. Wait for 15 seconds after startup
2. **Expected Result:**
   - [ ] No crashes or restarts
   - [ ] Console remains stable (no error spikes)
   - [ ] Can access http://localhost:3000 in browser

**Notes:** _______________________________________________

### Test 1.3: Hot Module Reload Works
1. Open `/lib/lessons.ts`
2. Change a lesson title (e.g., "Space" → "Space Adventures")
3. Save the file
4. Return to browser running the app
5. **Expected Result:**
   - [ ] No full page reload (HMR applies changes)
   - [ ] Page reloads automatically
   - [ ] Changes appear within 3 seconds

**Notes:** _______________________________________________

---

## SECTION 2: Navigation to Lesson Page

### Test 2.1: Landing Page Loads
1. Navigate to: `http://localhost:3000`
2. **Expected Result:**
   - [ ] Landing page displays
   - [ ] "Cosmo" mascot (robot emoji 🤖) visible
   - [ ] "Sign Up as Parent" button appears
   - [ ] No console errors

**Notes:** _______________________________________________

### Test 2.2: Authentication Flow (Signup)
1. Click "Sign Up as Parent"
2. Enter test credentials:
   - Email: `test-parent@example.com`
   - Password: `SecureTest123!`
3. Click "Sign Up"
4. **Expected Result:**
   - [ ] Page redirects to signup confirmation or login
   - [ ] No authentication errors in console
   - [ ] User can then login with same credentials

**Notes:** _______________________________________________

### Test 2.3: Login and Dashboard Access
1. Click "Login"
2. Enter the credentials from Test 2.2
3. Click "Login"
4. **Expected Result:**
   - [ ] Redirects to parent dashboard
   - [ ] Dashboard loads without errors
   - [ ] Can see child profiles (or "Create Child" option)

**Notes:** _______________________________________________

### Test 2.4: Select Child Profile
1. From dashboard, click on a child profile (or create one first)
2. **Expected Result:**
   - [ ] Child profile is selected
   - [ ] Navigation shows: "Learning" or similar button
   - [ ] Can click to enter learning screen

**Notes:** _______________________________________________

### Test 2.5: Navigate to Learn Page
1. Click on "Start Learning" or equivalent button
2. **Expected Result:**
   - [ ] URL changes to: `/learn?childId=...`
   - [ ] Page loads within 3 seconds
   - [ ] No 404 or authorization errors
   - [ ] Sidebar and chat panel visible

**Notes:** _______________________________________________

---

## SECTION 3: First Lesson Step Display

### Test 3.1: Lesson Page Initializes Correctly
1. On `/learn` page with a child selected
2. **Expected Result:**
   - [ ] Sidebar displays all 5 topics with emojis:
     - [ ] 🚀 Exploring Space
     - [ ] 🦁 Amazing Animals
     - [ ] ⛈️ Wild Weather
     - [ ] 🫀 Your Amazing Body
     - [ ] 🌿 Growing Plants
   - [ ] No topic is selected yet (no blue highlight)
   - [ ] Chat area shows: "Hi! I'm Cosmo!" greeting

**Notes:** _______________________________________________

### Test 3.2: Select First Topic (Space)
1. Click on "🚀 Exploring Space" in sidebar
2. **Expected Result:**
   - [ ] Topic is highlighted in blue
   - [ ] URL changes to include `?topicId=space` (or similar)
   - [ ] Chat panel switches to "lesson mode"
   - [ ] Page shows "Step 1 of 4" indicator

**Notes:** _______________________________________________

### Test 3.3: First Lesson Step Renders
1. From Test 3.2, observe the lesson display
2. **Expected Result:**
   - [ ] Progress indicator shows: "Step 1 of 4"
   - [ ] Cosmo's explanation appears in blue box:
     - [ ] Text starts: "Did you know that our planet Earth is floating in space?"
     - [ ] 🤖 emoji visible beside text
   - [ ] Animation placeholder or visual loads below explanation
   - [ ] Question displays: "What keeps us from floating away from Earth?"
   - [ ] Four answer options appear (A, B, C, D):
     - [ ] A. Magic spells
     - [ ] B. Gravity pulls us down
     - [ ] C. Invisible ropes
     - [ ] D. Cosmo's robot powers

**Notes:** _______________________________________________

### Test 3.4: Visual Panel Displays
1. Observe the lesson step display
2. **Expected Result:**
   - [ ] Visual area shows between explanation and question
   - [ ] If animation type: placeholder or Lottie animation loads
   - [ ] If image type: Unsplash image loads (or placeholder)
   - [ ] No broken images or console errors
   - [ ] Visual is relevant to lesson topic

**Notes:** _______________________________________________

### Test 3.5: Typing Animation Works
1. Reload the page or navigate away and back to lesson
2. Observe Cosmo's explanation text
3. **Expected Result:**
   - [ ] First 50 characters appear immediately
   - [ ] Rest of text appears smoothly after 1 second
   - [ ] Blinking cursor (▋) visible during typing
   - [ ] Animation is smooth and readable

**Notes:** _______________________________________________

---

## SECTION 4: Correct Answer Evaluation and Progression

### Test 4.1: Submit Correct Answer (Gravity)
1. From Test 3.3, click on option "B. Gravity pulls us down"
2. **Expected Result:**
   - [ ] Option B turns green immediately
   - [ ] Button becomes disabled (can't click other options)
   - [ ] "Checking your answer..." message appears briefly
   - [ ] Success feedback displays in green banner:
     - [ ] Message: "Wow! That's exactly right! You're doing amazing! Let's move to the next step."

**Notes:** _______________________________________________

### Test 4.2: Progress to Next Step
1. After Test 4.1 success feedback appears
2. Wait 2 seconds
3. **Expected Result:**
   - [ ] UI automatically transitions to Step 2
   - [ ] Progress indicator updates: "Step 2 of 4"
   - [ ] New lesson prompt displays: "The Sun is SO big..."
   - [ ] New checkpoint question appears: "Why is the Sun important to Earth?"
   - [ ] Step 1 buttons are disabled/hidden
   - [ ] New answer options for Step 2 display

**Notes:** _______________________________________________

### Test 4.3: Database Persistence Check
1. After completing Step 1, check browser developer tools
2. Open Network tab in DevTools
3. Look for POST request to `/api/chat` or database update
4. **Expected Result:**
   - [ ] Request shows successful status (200-201)
   - [ ] Response contains expected data
   - [ ] No 5xx errors in console

**Notes:** _______________________________________________

### Test 4.4: Complete All Steps in Sequence
1. From Step 2, click correct answer: "B. It gives us light and heat"
2. From Step 3, click correct answer: "B. They orbit (go around) the Sun"
3. From Step 4, click correct answer: "B. Giant balls of burning gas"
4. **Expected Result:**
   - [ ] Each step progresses smoothly
   - [ ] Progress indicator updates correctly after each answer
   - [ ] No errors between steps
   - [ ] After Step 4, lesson switches to chat mode

**Notes:** _______________________________________________

### Test 4.5: Lesson Completion Triggers Chat Mode Switch
1. After completing all 4 steps (from Test 4.4)
2. **Expected Result:**
   - [ ] Chat panel switches from lesson mode to free chat mode
   - [ ] LessonStep component disappears
   - [ ] Chat message area shows empty state: "Hi! I'm Cosmo!"
   - [ ] Text input field becomes active
   - [ ] Microphone button and Send button visible
   - [ ] Sidebar still shows topic as completed with ✓ checkmark

**Notes:** _______________________________________________

---

## SECTION 5: Incorrect Answer Retry Mechanism

### Test 5.1: Start New Topic (Animals)
1. Click on "🦁 Amazing Animals" in sidebar
2. **Expected Result:**
   - [ ] Topic switches to Animals
   - [ ] Progress resets to "Step 1 of 4"
   - [ ] New prompt appears: "There are MILLIONS of different animals..."
   - [ ] New question: "How many different types of animals are on Earth?"
   - [ ] New answer options appear (Hundreds, Thousands, etc.)

**Notes:** _______________________________________________

### Test 5.2: Submit Incorrect Answer
1. From Test 5.1, click "A. Just a few" (wrong answer)
2. **Expected Result:**
   - [ ] Option A highlights briefly (visual feedback)
   - [ ] "Checking your answer..." appears
   - [ ] Incorrect feedback displays in yellow/orange banner:
     - [ ] Message: "Not quite! 'Just a few' isn't the right answer. Let's try again! You've got this!"
   - [ ] Hint appears below: "It is a LOT! More than you can count!"

**Notes:** _______________________________________________

### Test 5.3: Retry Same Question
1. After incorrect feedback from Test 5.2
2. Click on a different option: "D. Millions"
3. **Expected Result:**
   - [ ] Previous selection (A) clears
   - [ ] New selection (D) highlights green
   - [ ] "Checking your answer..." appears again
   - [ ] Success feedback displays:
     - [ ] "Wow! That's exactly right!"
   - [ ] Automatically progresses to Step 2

**Notes:** _______________________________________________

### Test 5.4: Hint Display for Wrong Answer
1. From Test 5.1 or another checkpoint, submit a wrong answer
2. Observe the yellow/orange feedback banner
3. **Expected Result:**
   - [ ] Hint text appears below feedback message
   - [ ] Hint is relevant and helpful (not just repeated feedback)
   - [ ] Example: "Hint: Think about why things fall down when you drop them!"
   - [ ] Hint text is readable (good contrast, appropriate size)

**Notes:** _______________________________________________

---

## SECTION 6: Lesson Completion and Chat Mode Switch

### Test 6.1: Complete Second Topic (Animals)
1. Click correct answers for all 4 Animal lesson steps
2. After Step 4 is completed
3. **Expected Result:**
   - [ ] After last answer accepted, chat mode activates
   - [ ] Lesson mode UI disappears
   - [ ] Chat area shows: "Hi! I'm Cosmo!" greeting again
   - [ ] Text input field active
   - [ ] No errors in console
   - [ ] Sidebar shows Animals topic with ✓ checkmark

**Notes:** _______________________________________________

### Test 6.2: Free Chat in Lesson Topic Context
1. In chat mode (after completing a topic)
2. Type: "Tell me more about animals"
3. Click Send or press Enter
4. **Expected Result:**
   - [ ] Message appears in chat as user input
   - [ ] Loading indicator appears
   - [ ] Cosmo responds with a kid-friendly answer
   - [ ] Response includes relevant content about animals
   - [ ] No API errors (no 401, 500 errors)
   - [ ] Response text is appropriate for age 5-8

**Notes:** _______________________________________________

### Test 6.3: Chat Response Quality
1. From Test 6.2, observe Cosmo's response
2. **Expected Result:**
   - [ ] Response is 2-3 sentences (not too long)
   - [ ] Language is simple (no complex words)
   - [ ] Includes emojis for engagement
   - [ ] Tone is warm and encouraging
   - [ ] Follows kid-friendly guidelines
   - [ ] No profanity or scary content

**Notes:** _______________________________________________

### Test 6.4: Multiple Free Chat Messages
1. Ask 2-3 follow-up questions in chat mode
2. Examples:
   - "What's a bat?"
   - "Can bats fly?"
   - "Are bats scary?"
3. **Expected Result:**
   - [ ] Each message is sent and processed
   - [ ] Cosmo responds to each
   - [ ] Conversation feels natural
   - [ ] No repeated responses
   - [ ] Chat history is maintained (all messages visible)

**Notes:** _______________________________________________

---

## SECTION 7: Resume Capability

### Test 7.1: Start New Topic and Complete Partial Progress
1. Click on "⛈️ Wild Weather" topic
2. Complete Step 1 and Step 2 only (don't complete the topic)
3. Verify you see: "Step 2 of 4" completed
4. **Expected Result:**
   - [ ] Steps 1 and 2 are completed successfully
   - [ ] Page shows checkpoint feedback for Step 2
   - [ ] Current UI is ready for Step 3

**Notes:** _______________________________________________

### Test 7.2: Leave Page and Return
1. Navigate away from learn page
   - Option A: Click browser back button
   - Option B: Go to dashboard and select different child
   - Option C: Close browser tab and reopen localhost:3000
2. Log in again if necessary
3. Return to /learn page with same child
4. **Expected Result:**
   - [ ] Page loads successfully
   - [ ] No errors about missing session
   - [ ] Sidebar loads with all topics

**Notes:** _______________________________________________

### Test 7.3: Resume from Last Step
1. From Test 7.2, after returning to learn page
2. Click on "⛈️ Wild Weather" again
3. **Expected Result:**
   - [ ] Progress resumes at Step 3 (not Step 1)
   - [ ] "Step 3 of 4" indicator shows correctly
   - [ ] Question: "What do you need to make a rainbow?"
   - [ ] Previous steps are NOT repeated
   - [ ] Current step is the expected one from Test 7.1

**Notes:** _______________________________________________

### Test 7.4: Resume Progress Persists After Refresh
1. On Step 3 of Weather topic (from Test 7.3)
2. Press F5 to refresh the page
3. **Expected Result:**
   - [ ] Page reloads without errors
   - [ ] Still on Step 3 of Weather
   - [ ] Lesson prompt and checkpoint visible
   - [ ] Can continue with correct answer
   - [ ] Progress is not lost

**Notes:** _______________________________________________

### Test 7.5: Complete Partially Done Topic
1. From Weather Step 3, submit correct answer for Step 3
2. Submit correct answer for Step 4
3. **Expected Result:**
   - [ ] Weather topic now shows ✓ checkmark in sidebar
   - [ ] Chat mode is activated
   - [ ] Progress is saved (can verify by leaving and returning)

**Notes:** _______________________________________________

---

## SECTION 8: Multiple Topics Independence

### Test 8.1: Progress Isolation Between Topics
1. Verify completed topics in sidebar:
   - [ ] Space: ✓
   - [ ] Animals: ✓
   - [ ] Weather: ✓
2. Verify remaining topics show progress count:
   - [ ] Human Body: 0/4
   - [ ] Plants: 0/4
3. **Expected Result:**
   - [ ] Each topic has independent progress tracking
   - [ ] Completing one topic doesn't affect others
   - [ ] Progress indicators are accurate

**Notes:** _______________________________________________

### Test 8.2: Start Different Topic (Human Body)
1. Click on "🫀 Your Amazing Body" in sidebar
2. **Expected Result:**
   - [ ] Topic switches immediately
   - [ ] Progress resets to: "Step 1 of 4"
   - [ ] New lesson prompt: "Your heart is a super strong muscle..."
   - [ ] Previous progress (Space, Animals, Weather) not displayed
   - [ ] New checkpoint question: "What does your heart do?"

**Notes:** _______________________________________________

### Test 8.3: Switching Between Topics
1. Complete Step 1 of Human Body topic
2. Click on "Space" in sidebar
3. **Expected Result:**
   - [ ] Immediately switches to Space topic
   - [ ] Shows: "Step 1 of 4" (if not previously completed)
     OR shows completed state with ✓ if Space was finished
   - [ ] No data corruption or mixing
   - [ ] Each topic maintains its own state

**Notes:** _______________________________________________

### Test 8.4: Return to Partially Completed Topic
1. From Test 8.3, click back to "Human Body"
2. **Expected Result:**
   - [ ] Returns to Step 2 (not Step 1)
   - [ ] Progress from Test 8.1 is preserved
   - [ ] Can continue with next checkpoint
   - [ ] No duplicate messages or corrupted state

**Notes:** _______________________________________________

### Test 8.5: Complete All Topics
1. Complete remaining topics:
   - [ ] Finish Human Body (Steps 2, 3, 4)
   - [ ] Finish Plants (All 4 steps)
2. **Expected Result:**
   - [ ] All 5 topics show ✓ in sidebar when completed
   - [ ] Can freely chat about any topic
   - [ ] Sidebar shows all topics as completed
   - [ ] No errors or performance issues

**Notes:** _______________________________________________

---

## SECTION 9: Voice Input Testing (Optional but Recommended)

### Test 9.1: Microphone Button Availability
1. In chat mode (after lesson completion)
2. Observe the input area
3. **Expected Result:**
   - [ ] Microphone button visible (🎤 icon)
   - [ ] Button is clickable/enabled
   - [ ] No console errors related to audio

**Notes:** _______________________________________________

### Test 9.2: Voice Recording
1. Click the microphone button
2. Speak clearly: "What is the sun?"
3. Wait for speech recognition to finish
4. **Expected Result:**
   - [ ] Microphone button shows active/loading state
   - [ ] Browser may ask for microphone permission (allow it)
   - [ ] Voice input is transcribed to text
   - [ ] Transcribed text appears in input field

**Notes:** _______________________________________________

### Test 9.3: Voice Message Submission
1. From Test 9.2, after voice is transcribed
2. Observe automatic message submission
3. **Expected Result:**
   - [ ] Message is automatically sent (or allow click Send)
   - [ ] Cosmo responds to voice input
   - [ ] Response quality is same as text input
   - [ ] No audio/permission errors

**Notes:** _______________________________________________

---

## SECTION 10: Visual Output and Images

### Test 10.1: Animation Placeholder Display
1. On a lesson step with expectedVisual type: "animation"
   - Examples: Space Step 1 (Earth orbiting Sun), Weather Step 1 (water cycle)
2. **Expected Result:**
   - [ ] Visual area displays placeholder or animation
   - [ ] Image/animation loads without 404 errors
   - [ ] Visual is centered and appropriately sized
   - [ ] No stretched or distorted visuals

**Notes:** _______________________________________________

### Test 10.2: Image Placeholder Display
1. On a lesson step with expectedVisual type: "image"
   - Examples: Animals Step 1 (diverse animals), Plants Step 3 (flowers)
2. **Expected Result:**
   - [ ] Image loads from Unsplash or displays placeholder
   - [ ] Image is relevant to lesson topic
   - [ ] Image dimensions are appropriate (not too large)
   - [ ] No broken image icons

**Notes:** _______________________________________________

### Test 10.3: Chat Message Visual Rendering
1. In chat mode, ask Cosmo: "Show me a picture of space"
2. Observe if response includes visual tag
3. **Expected Result:**
   - [ ] If Cosmo's response includes VISUAL tag, image displays
   - [ ] Visual renders below or alongside text
   - [ ] No console errors related to image loading

**Notes:** _______________________________________________

---

## SECTION 11: Error Handling and Edge Cases

### Test 11.1: Network Error Simulation
1. Open DevTools Network tab
2. Set throttling to "Offline"
3. Try to send a chat message
4. **Expected Result:**
   - [ ] Error message displays: "Oops! I had a problem connecting. Try again!"
   - [ ] Input field remains available
   - [ ] Can retry after going back online
   - [ ] No crashes

**Notes:** _______________________________________________

### Test 11.2: Missing Environment Variables
1. Temporarily comment out `ANTHROPIC_API_KEY` in `.env.local`
2. Try to send chat message
3. **Expected Result:**
   - [ ] Error message displays (friendly message)
   - [ ] No authentication/API key exposed in error
   - [ ] App doesn't crash
   - [ ] Restore env var and test works again

**Notes:** _______________________________________________

### Test 11.3: Invalid Child ID
1. Manually change URL: `/learn?childId=invalid-uuid`
2. **Expected Result:**
   - [ ] Page loads gracefully
   - [ ] Error message displays or redirects to dashboard
   - [ ] No crashes or blank pages
   - [ ] Clear messaging about what went wrong

**Notes:** _______________________________________________

### Test 11.4: Lesson Not Found
1. In code, temporarily change `getLessonStep()` to return null
2. Try to view a lesson step
3. **Expected Result:**
   - [ ] Graceful error handling
   - [ ] User-friendly message displays
   - [ ] Option to retry or go back

**Notes:** _______________________________________________

---

## SECTION 12: Performance and Loading

### Test 12.1: Page Load Time
1. Open DevTools Performance tab
2. Reload /learn page
3. **Expected Result:**
   - [ ] Initial load < 3 seconds
   - [ ] First Contentful Paint (FCP) < 2 seconds
   - [ ] Largest Contentful Paint (LCP) < 3 seconds
   - [ ] No console warnings about performance

**Notes:** _______________________________________________

### Test 12.2: Lesson Step Transition Speed
1. On a lesson checkpoint, submit correct answer
2. Measure time to next step display
3. **Expected Result:**
   - [ ] Transition to next step < 500ms
   - [ ] Smooth animation (no jank)
   - [ ] No loading delays between steps
   - [ ] Progress saves to database without blocking UI

**Notes:** _______________________________________________

### Test 12.3: Chat Message Response Time
1. Send a chat message to Cosmo
2. Measure time to receive response
3. **Expected Result:**
   - [ ] First response chunk within 2-3 seconds
   - [ ] Full response within 5 seconds max
   - [ ] Loading indicator shows while waiting
   - [ ] No timeout errors for valid messages

**Notes:** _______________________________________________

---

## SECTION 13: Responsive Design

### Test 13.1: Desktop Layout (1920x1080)
1. Open /learn page on desktop resolution
2. **Expected Result:**
   - [ ] Sidebar visible on left (200px width)
   - [ ] Chat/lesson panel takes remaining space
   - [ ] All buttons and text clearly visible
   - [ ] No overflow or horizontal scrolling

**Notes:** _______________________________________________

### Test 13.2: Tablet Layout (iPad, 768x1024)
1. Open /learn page on tablet or browser zoom to 768px width
2. **Expected Result:**
   - [ ] Layout adjusts appropriately
   - [ ] Sidebar may stack or reduce width
   - [ ] Chat panel is readable and usable
   - [ ] Touch interactions work smoothly
   - [ ] Buttons are large enough to tap (minimum 44px)

**Notes:** _______________________________________________

### Test 13.3: Mobile Layout (iPhone, 375x667)
1. Open /learn page on mobile or browser width 375px
2. **Expected Result:**
   - [ ] Sidebar may be hidden (hamburger menu if implemented)
   - [ ] Chat panel is full width
   - [ ] Lesson content is readable
   - [ ] All buttons are tappable
   - [ ] No horizontal scrolling needed
   - [ ] Input field is accessible

**Notes:** _______________________________________________

---

## SECTION 14: Cross-Browser Compatibility

### Test 14.1: Chrome/Edge
1. Open http://localhost:3000 in Chrome or Edge
2. Complete a full lesson flow
3. **Expected Result:**
   - [ ] All features work smoothly
   - [ ] No console errors
   - [ ] Animations are smooth
   - [ ] Voice input works (if tested)

**Notes:** _______________________________________________

### Test 14.2: Firefox
1. Open http://localhost:3000 in Firefox
2. Complete a full lesson flow
3. **Expected Result:**
   - [ ] All features work smoothly
   - [ ] No console errors
   - [ ] Layout displays correctly
   - [ ] Responsive design works

**Notes:** _______________________________________________

### Test 14.3: Safari (macOS)
1. Open http://localhost:3000 in Safari
2. Complete a full lesson flow
3. **Expected Result:**
   - [ ] All features work smoothly
   - [ ] Framer Motion animations work
   - [ ] Tailwind styles render correctly
   - [ ] Voice input works (Safari may require permissions)

**Notes:** _______________________________________________

---

## SECTION 15: Data Persistence and Database

### Test 15.1: Progress Saved to Database
1. Complete a lesson topic
2. Open database client (Supabase dashboard or psql)
3. Query: `SELECT * FROM lesson_progress WHERE child_id = 'YOUR_CHILD_ID'`
4. **Expected Result:**
   - [ ] Record exists for completed topic
   - [ ] `current_step` = total number of steps
   - [ ] `completed_at` timestamp is recent (not null)
   - [ ] `child_id` matches the test child

**Notes:** _______________________________________________

### Test 15.2: Progress Survives Database Disconnect
1. Complete Step 1 of a topic
2. Temporarily stop Supabase service
3. Try to continue lesson (Step 2)
4. **Expected Result:**
   - [ ] Lesson continues in UI (optimistic UI)
   - [ ] Database error is caught gracefully
   - [ ] User sees friendly message if needed
   - [ ] Progress is cached locally if possible

**Notes:** _______________________________________________

### Test 15.3: Multiple Children Independence
1. Create 2 different child profiles under same parent
2. Login with Parent account
3. With Child 1: Complete Space topic
4. Switch to Child 2: Check Space is at 0/4 progress
5. **Expected Result:**
   - [ ] Each child has separate progress
   - [ ] Completing lesson for Child 1 doesn't affect Child 2
   - [ ] Database properly isolates records by `child_id`

**Notes:** _______________________________________________

---

## SECTION 16: Security and Auth

### Test 16.1: Unauthenticated Access Blocked
1. Clear cookies/session
2. Try to access `/learn` directly
3. **Expected Result:**
   - [ ] Redirects to `/auth/login`
   - [ ] Cannot view child data without auth
   - [ ] No error exposures

**Notes:** _______________________________________________

### Test 16.2: Cross-Parent Data Isolation
1. Login as Parent A
2. Note Parent A's Child 1 ID from URL
3. Logout and login as Parent B
4. Try to access Parent A's child: `/learn?childId=PARENT_A_CHILD_ID`
5. **Expected Result:**
   - [ ] Access denied
   - [ ] Redirected to Parent B's dashboard
   - [ ] No leakage of Parent A's data

**Notes:** _______________________________________________

### Test 16.3: API Key Security
1. Open DevTools Network tab
2. Send a chat message
3. Inspect the request to `/api/chat`
4. **Expected Result:**
   - [ ] API keys NOT visible in request headers
   - [ ] API keys NOT visible in request body
   - [ ] Keys only used server-side (hidden in `/app/api/chat/route.ts`)
   - [ ] No sensitive data in response headers

**Notes:** _______________________________________________

---

## SECTION 17: Accessibility (Basic)

### Test 17.1: Keyboard Navigation
1. Open /learn page
2. Press Tab multiple times
3. **Expected Result:**
   - [ ] Focus ring visible on all buttons
   - [ ] Can navigate through options with Tab
   - [ ] Enter key submits selections
   - [ ] Screen reader could follow navigation

**Notes:** _______________________________________________

### Test 17.2: Color Contrast
1. Observe all text in lesson and chat
2. Use WebAIM contrast checker on key elements
3. **Expected Result:**
   - [ ] Success feedback (green) has sufficient contrast
   - [ ] Error feedback (yellow) has sufficient contrast
   - [ ] Body text on dark backgrounds is readable
   - [ ] WCAG AA compliance (4.5:1 for text)

**Notes:** _______________________________________________

### Test 17.3: Focus on Checkpoint Options
1. Submit an answer to checkpoint
2. Verify visual feedback (green highlight)
3. **Expected Result:**
   - [ ] Correct answer is clearly highlighted
   - [ ] Feedback message is visible and readable
   - [ ] Not relying solely on color to convey info

**Notes:** _______________________________________________

---

## SECTION 18: Final Sanity Check

### Test 18.1: Complete Full User Flow
1. **Start fresh:**
   - [ ] Clear cache/cookies
   - [ ] Logout if logged in
   - [ ] Close all tabs

2. **Authentication (5 min):**
   - [ ] Navigate to localhost:3000
   - [ ] Sign up as new parent
   - [ ] Create a child profile
   - [ ] Login with parent credentials

3. **Lesson Flow (15 min):**
   - [ ] Select Space topic
   - [ ] Complete all 4 steps (answer correctly)
   - [ ] Switch to chat mode
   - [ ] Ask a question in chat
   - [ ] See Cosmo's response

4. **Resume and Persistence (5 min):**
   - [ ] Refresh page (F5)
   - [ ] Select new topic (Animals)
   - [ ] Complete 2 steps
   - [ ] Refresh page
   - [ ] Verify resume at correct step

5. **Multiple Topics (5 min):**
   - [ ] Complete Weather topic fully
   - [ ] Verify sidebar shows ✓ marks
   - [ ] Start Human Body (should be Step 1 of 4)
   - [ ] Complete at least 1 step

6. **Final Check:**
   - [ ] Console has no errors
   - [ ] All features work as expected
   - [ ] No crashes or hangs
   - [ ] Performance is acceptable

**Overall Status:** [ ] PASS [ ] FAIL

**Notes:** _______________________________________________

---

## SECTION 19: Known Limitations to Document

Document any limitations found during testing:

**Limitation 1:**
- Symptom: _______________________________________________
- Impact: [ ] High [ ] Medium [ ] Low
- Workaround: _______________________________________________

**Limitation 2:**
- Symptom: _______________________________________________
- Impact: [ ] High [ ] Medium [ ] Low
- Workaround: _______________________________________________

**Limitation 3:**
- Symptom: _______________________________________________
- Impact: [ ] High [ ] Medium [ ] Low
- Workaround: _______________________________________________

---

## SECTION 20: Sign-Off

### Testing Summary

**Total Tests:** 60+  
**Passed:** _____ / _____  
**Failed:** _____ / _____  
**Skipped:** _____ / _____  

**Overall Result:** [ ] READY FOR DEPLOYMENT [ ] NEEDS FIXES

### Issues Found

| Issue ID | Severity | Description | Status |
|----------|----------|-------------|--------|
| 1 | [ ] Critical [ ] High [ ] Medium [ ] Low | _________________ | [ ] Open [ ] Fixed |
| 2 | [ ] Critical [ ] High [ ] Medium [ ] Low | _________________ | [ ] Open [ ] Fixed |
| 3 | [ ] Critical [ ] High [ ] Medium [ ] Low | _________________ | [ ] Open [ ] Fixed |

### Sign-Off

**Tested By:** ___________________________  
**Date:** ___________________________  
**Time Spent:** ___________________________  
**Environment:** Local (localhost:3000)  
**Node Version:** ___________________________  
**Browser(s):** ___________________________  
**Approved By:** ___________________________  

### Notes for Deployment

___________________________________________________________________
___________________________________________________________________
___________________________________________________________________
___________________________________________________________________

---

## Quick Reference: URLs to Test

| Feature | URL | Expected Behavior |
|---------|-----|-------------------|
| Landing | `http://localhost:3000` | Sign up / Login page |
| Dashboard | `http://localhost:3000/dashboard` | Parent dashboard |
| Learn Page | `http://localhost:3000/learn` | Learning interface |
| Learn (Space) | `http://localhost:3000/learn?topicId=space` | Space lesson |
| Learn (Animals) | `http://localhost:3000/learn?topicId=animals` | Animals lesson |
| Learn (Weather) | `http://localhost:3000/learn?topicId=weather` | Weather lesson |
| Learn (Body) | `http://localhost:3000/learn?topicId=human_body` | Human Body lesson |
| Learn (Plants) | `http://localhost:3000/learn?topicId=plants` | Plants lesson |

---

## Quick Reference: Test Data

**Parent Account:**
- Email: `test-parent@example.com`
- Password: `SecureTest123!`

**Child Profiles:**
- Create at least 2-3 child profiles for testing multi-child isolation

**Topics & Step Counts:**
- Space: 4 steps
- Animals: 4 steps
- Weather: 4 steps
- Human Body: 4 steps
- Plants: 4 steps

---

**This checklist is a living document. Update it as you discover new test cases or issues during testing.**
