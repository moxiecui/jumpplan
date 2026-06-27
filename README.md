# JumpPlan

JumpPlan is an Expo Router app for a 21-day basketball vertical-jump performance plan. It combines a fixed phased training plan, exercise detail pages, nutrition timing, manual readiness check-ins, glossary explanations, and conservative readiness-based plan previews.

The app is local-first for this iteration. Readiness entries are held in memory during the current session, Oura-style data is entered manually or mocked, and generated/adapted plan previews do not mutate the source plan.

## Repository Location

The active local repo is:

```powershell
E:\Repositories\jumplan
```

The old OneDrive location was moved out of use. Run commands from `E:\Repositories\jumplan`.

## Project Structure

```text
app/
  _layout.tsx              Expo Router stack and shared providers.
  index.tsx                Today screen: today's plan, readiness summary, nutrition, glossary link.
  today.tsx                Route alias for Today.
  checkin.tsx              Manual readiness/Oura-style input screen.
  adaptive-plan.tsx        Local mock adaptive-plan generation screen.
  nutrition.tsx            Daily nutrition schedule screen.
  nutrition/[id].tsx       Nutrition item detail route.
  exercise/[id].tsx        Exercise detail route.
  glossary/index.tsx       Searchable glossary list with category filters.
  glossary/[id].tsx        Glossary detail route.
  plan/index.tsx           21-day plan overview with phase/filter labels.
  plan/[day].tsx           Single-day plan route.

src/
  components/              Reusable UI blocks and detail cards.
  context/                 In-memory session state providers.
  data/                    Static plan, exercises, nutrition, glossary, and examples.
  logic/                   Pure rules for schedule, readiness, nutrition, glossary, and adjustments.
  services/                Mock/API service boundaries.
  types/                   Shared TypeScript domain types.

.tools/                    Portable Node, PortableGit, GitHub CLI, and helper scripts.
.github/                   GitHub workflow/config files.
dist/                      Generated static web export for GitHub Pages.
```

## Main App Flow

`app/index.tsx` is the main Today screen. It loads the active training day with `getTodayTrainingDay()`, reads any saved readiness entry from `ReadinessContext`, previews readiness-adjusted training through `applyAdjustmentToDay()`, and shows nutrition plus related terms.

`app/checkin.tsx` collects manual Oura-style fields and subjective tendon inputs. It calls `evaluateDailyReadiness()` and saves the result into the in-memory readiness provider.

`app/plan/index.tsx` lists the 21-day cycle. Each day can include phase metadata, performance focus, upper-body/core/isometric flags, readiness rules, nutrition, and optional French Contrast guidance.

`app/glossary/index.tsx` and `app/glossary/[id].tsx` explain training, readiness, wearable, recovery, and nutrition abbreviations in Chinese. Detail pages use reliable “相关术语” sections instead of fragile inline parsing.

`app/adaptive-plan.tsx` collects feedback and uses `mockPlanGenerationService` to preview a generated adaptive plan. Backend integration is intentionally separated so API keys are not placed in the client app.

Exercise detail and expanded exercise rows use `youtubeSearchQuery` to show video help. Without a YouTube API key, the app shows a safe search button. If `EXPO_PUBLIC_YOUTUBE_API_KEY` is configured, the app fetches the top YouTube search results client-side and shows thumbnails, titles, and channel names, then falls back to the search link if the API request fails.

## Important Data Files

- `src/data/plan.ts`: 21-day, 3-phase vertical jump plan.
- `src/data/exercises.ts`: Exercise library with full detail content and YouTube search queries.
- `src/data/nutrition.ts`: Nutrition item definitions and daily nutrition plans.
- `src/data/supplements.ts`: User supplement product references.
- `src/data/glossary.ts`: Glossary entries for CMJ, RPE, HRV, EPA/DHA, French Contrast, isometrics, and related terms.
- `src/data/frenchContrast.ts`: Conservative French Contrast / Complex Training guidance.
- `src/data/readinessExamples.ts`: Readiness validation scenarios.

When adding a plan item, add or reuse a matching exercise in `src/data/exercises.ts`. Missing exercise ids should not crash rendering, but validation should report no missing ids.

## Important Logic Files

- `src/logic/schedule.ts`: Chooses the active day by cycling through `trainingPlan.length`.
- `src/logic/readinessScore.ts`: Converts wearable-style inputs and tendon symptoms into a `DailyTrainingAdjustment`.
- `src/logic/trainingAdjustment.ts`: Returns adjusted copies of training days without mutating `plan.ts`.
- `src/logic/nutrition.ts`: Picks nutrition plans and hides training-only items when training is inactive.
- `src/logic/glossary.ts`: Glossary lookup, category labels, and term detection.
- `src/logic/feedbackAnalysis.ts`: Feedback severity and adaptive-plan length suggestions.

## Safety Rules

- Do not generate high-volume plyometrics.
- Do not add max jumps on recovery days.
- Do not override tendon pain with wearable readiness.
- If Achilles or patellar pain is `>= 4/10`, generate recovery-only or tendon-safety work.
- If Achilles stiffness or patellar tendon pain is `>= 3/10`, cancel French Contrast, PAP, and max jumping.
- No more than 2 hard high-impact days per week.
- Every training day keeps warmup, main, active recovery, and optional evening recovery blocks.
- Recovery/rest days do not upgrade into hard days because of high wearable scores.
- Foam rolling is optional, light to moderate, and never direct pressure on tendons, joints, bony areas, bruises, or sharp-pain spots.

## Development Commands

Run these from `E:\Repositories\jumplan`:

```powershell
npm run start
npm run web
npm run tsc
npm run export:web
npm run deploy
```

The npm scripts are configured to use the bundled Node executable in `.tools/` because this Windows environment can block package `.bin` shims with `Access is denied`.

If needed, direct equivalents are:

```powershell
.tools\node-v22.16.0-win-x64\node.exe node_modules\typescript\bin\tsc --noEmit
.tools\node-v22.16.0-win-x64\node.exe node_modules\expo\bin\cli export -p web
.tools\node-v22.16.0-win-x64\node.exe .tools\copy-gh-pages-404.js
```

Portable Git is stored at:

```powershell
.tools\PortableGit\bin\git.exe
```

## Web Export And Deployment

The web export uses Expo static output and the app is configured with the `/jumpplan` base path for GitHub Pages:

```powershell
npm run export:web
```

The export writes to `dist/` and creates `dist/404.html` for GitHub Pages SPA fallback.

Deploy to GitHub Pages:

```powershell
npm run deploy
```

The deploy script publishes `dist/` to the `gh-pages` branch using:

```text
https://github.com/moxiecui/jumpplan.git
```

Live app:

```text
https://moxiecui.github.io/jumpplan/
```

## Git Notes

Current branch:

```powershell
main
```

Remote:

```powershell
origin  https://github.com/moxiecui/jumpplan.git
```

Useful checks:

```powershell
.tools\PortableGit\bin\git.exe status --short --branch
.tools\PortableGit\bin\git.exe remote -v
```

## Validation Checklist

Before committing or deploying:

```powershell
npm run tsc
npm run export:web
```

Recommended data checks:

- Plan has 21 days.
- Every day includes warmup, main, activeRecovery, and eveningRecovery.
- Plan exercise ids all resolve in `src/data/exercises.ts`.
- New exercises include `youtubeSearchQuery`.
- YouTube thumbnails are optional and require `EXPO_PUBLIC_YOUTUBE_API_KEY`; do not commit API keys.
- Glossary uppercase abbreviation scan reports no uncovered app terms.
- Nutrition schedule references only ids defined in `src/data/nutrition.ts`.

## Design Notes

- Keep all training content practical, precise, coach-like, and in Chinese.
- Use related-term sections for glossary explanations; avoid brittle inline parsing.
- Keep upper-body and core work performance-supportive, not bodybuilding-oriented.
- Keep adaptive generation structured and conservative.
- Do not add OAuth, Oura token handling, AsyncStorage, or cloud storage in this local-first iteration.
