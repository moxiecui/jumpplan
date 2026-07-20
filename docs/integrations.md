# JumpPlan Integrations

JumpPlan supports manual and mock wearable/body-composition inputs first. Production integrations should be added through backend or serverless endpoints.

## Security Rules

- Do not expose WHOOP, Oura, or Withings API tokens in frontend code.
- Do not call WHOOP, Oura, or Withings APIs directly from the browser.
- OAuth access tokens and refresh tokens must be stored server-side.
- The frontend should call only JumpPlan-owned backend endpoints.
- Manual input remains available even when integrations are not connected.

## Planned Backend Endpoints

- `GET /api/integrations/oura/daily?date=YYYY-MM-DD`
- `GET /api/integrations/whoop/daily?date=YYYY-MM-DD`
- `GET /api/integrations/withings/body?date=YYYY-MM-DD`

## Device Roles

- Oura: readiness, sleep score, HRV, resting HR, body temperature deviation, respiratory rate, sleep duration, activity summary.
- WHOOP: recovery, day strain, sleep performance, HRV, resting HR, respiratory rate, workout/basketball load when available.
- Withings BodyFit: weight, body fat, muscle mass, segmental body composition, hydration/body water, long-term trend review.

## Training Decision Priority

Pain, tendon symptoms, anterior-knee soreness, basketball load, and movement quality always override wearable readiness. Withings body-composition data is trend-only and should not change daily training intensity by itself.

## TODO

- Add authenticated backend/serverless endpoints.
- Add OAuth flows and encrypted server-side token storage.
- Add scheduled sync jobs for Oura, WHOOP, and Withings.
- Add longer-term trend charts after the MVP text reminders are stable.
