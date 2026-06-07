# JumpPlan

JumpPlan is an Expo Router app for a 14-day basketball vertical-jump routine. It combines a fixed training plan, exercise detail pages, manual readiness check-ins, and conservative readiness-based plan previews.

The app is intentionally local-first for this iteration. Readiness entries are held in memory during the current app session, Oura data is entered manually or mocked, and generated plan previews do not mutate the source plan data.

## Project Structure

```text
app/
  _layout.tsx              App shell and shared providers.
  index.tsx                Today screen. Shows today's plan and readiness summary.
  today.tsx                Route alias/entry for the Today experience.
  checkin.tsx              Manual readiness input screen.
  adaptive-plan.tsx        Local mock adaptive-plan generation screen.
  plan/
    index.tsx              14-day plan overview.
    [day].tsx              Single-day plan route.
  exercise/
    [id].tsx               Exercise detail route.

src/
  components/              Reusable UI blocks.
  context/                 In-memory session state providers.
  data/                    Static exercise and 14-day plan data.
  logic/                   Pure rules for schedule, readiness, and adjustments.
  services/                Mock/API service boundaries.
  types/                   Shared TypeScript domain types.

.tools/                    Local portable tooling used on this machine.
.github/                   GitHub configuration, if enabled.
dist/                      Generated web export output.
```

## Main App Flow

`app/index.tsx` is the main Today screen. It loads today's training day with `getTodayTrainingDay()`, reads any saved readiness entry from `ReadinessContext`, and can preview an adjusted version of the day through `applyAdjustmentToDay()`.

`app/checkin.tsx` collects manual Oura-style fields and subjective tendon inputs. It calls `evaluateDailyReadiness()` and saves the result into the in-memory readiness provider so Today can show a summary during the same session.

`app/adaptive-plan.tsx` collects training feedback and uses `mockPlanGenerationService` to preview a generated adaptive plan. This is still local mock behavior. The prompt builder and backend service boundary are already separated so a future backend can be connected without placing API keys in the client app.

## Important Directories

### `src/data`

- `exercises.ts` is the exercise library. Each exercise has an id, Chinese and optional English names, instructions, cues, mistakes, regressions, progressions, and pain rules.
- `plan.ts` is the 14-day training plan. Plan items reference exercises by `exerciseId`.
- `readinessExamples.ts` contains example readiness scenarios and evaluated outputs for validation.

When adding a plan item, add or reuse a matching exercise in `exercises.ts`. Missing exercise ids should not crash rendering, but the plan is easier to maintain when all ids resolve.

### `src/types`

- `training.ts` defines the core training model: days, blocks, items, exercises, readiness inputs, and daily adjustment outputs.
- `adaptivePlan.ts` defines the shape of generated/adaptive plans and feedback requests.

Update these files first when introducing new domain fields so UI, logic, and services stay aligned.

### `src/logic`

- `schedule.ts` chooses the active training day.
- `readinessScore.ts` evaluates wearable-style inputs and tendon symptoms into a `DailyTrainingAdjustment`.
- `trainingAdjustment.ts` previews a modified copy of a training day without mutating the original plan.
- `feedbackAnalysis.ts` supports adaptive-plan feedback interpretation.
- `readiness.ts` contains older/simple readiness helpers kept for compatibility.

The readiness rules are intentionally conservative: tendon pain overrides wearable readiness, recovery/rest days do not upgrade into hard sessions, and high-impact work is reduced when signals are yellow or red.

### `src/components`

- `DaySection.tsx` renders training blocks and exercise rows.
- `ExerciseRow.tsx` renders an individual exercise reference.
- `ExerciseDetailView.tsx` renders full exercise details.
- `ReadinessIntelligenceCard.tsx` displays the full readiness evaluation.
- `ReadinessCard.tsx` is the older/simple readiness card.
- `AdaptivePlanPreview.tsx` renders generated adaptive-plan previews.

### `src/services`

- `ouraMock.ts` returns mock Oura-style readiness input.
- `ouraApi.ts` is TODO-only scaffolding for future OAuth/token/API mapping work. It intentionally contains no secrets or fake OAuth.
- `planGeneration.ts` defines the service interface.
- `mockPlanGenerationService.ts` provides local deterministic plan generation.
- `buildPlanGenerationPrompt.ts` builds the structured JSON-only prompt for a future backend.
- `backendPlanGenerationService.ts` is the future backend integration boundary.

## Development Commands

```powershell
npm run start
npm run web
npm run tsc
npm run export:web
npm run deploy
```

On this machine, portable Node and Git are stored under `.tools/`. If normal `npm` or `git` is unavailable, use the bundled executables from `.tools`.

## Web Export And Deployment

The web export uses Expo's static web output:

```powershell
npm run export:web
```

The GitHub Pages deployment script publishes `dist/` to the `gh-pages` branch:

```powershell
npm run deploy
```

The app is configured with a `/jumpplan` base path for GitHub Pages. If the GitHub repository is private, GitHub Pages may be disabled or inaccessible depending on the account and repository settings.

## Design Notes

- The source plan in `src/data/plan.ts` should stay immutable at runtime.
- Readiness adjustments should return copied training-day objects.
- Recovery and rest days should not become hard training days because of a high wearable score.
- Pain and tendon symptoms have higher priority than Oura-style readiness signals.
- Every training day should keep warmup and active recovery content.
- Generated adaptive plans should remain structured JSON and follow the safety rules in `buildPlanGenerationPrompt.ts`.
