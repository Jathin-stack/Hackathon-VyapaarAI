---
name: Vyapaar AI Architecture
description: Key decisions, structure, and known patterns for the Vyapaar AI Kirana Business OS project
---

## Project location
`artifacts/vyapaar-ai/` — React + Vite + TypeScript + Tailwind, runs on the `artifacts/vyapaar-ai: web` workflow.

## Auth / demo mode
- No Clerk or Supabase keys → app runs in full demo mode
- `src/auth/AuthContext.tsx` returns a hardcoded DEMO_USER (no Clerk imports at all)
- `src/lib/supabase.ts` uses placeholder fallback values so the client initialises without throwing
- To enable real auth: add `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` as secrets

## Routing
- Wouter with `base = import.meta.env.BASE_URL`
- `/` → LandingPage
- `/app` → OnboardingView → AppDashboard
- View switching inside AppDashboard is state-based (`ViewKey`), not URL-based

## Data layer
- All data is mock, exported from `src/data/businessData.ts`
- AI logic in `src/ai/agents.ts` (multi-language insight generators)
- No real API calls; React Query is installed but not used by views

## Services layer (added)
`src/services/` contains:
- `whatsappService.ts` — wa.me click-to-chat, all message templates, `sendWhatsApp()`. Swap `ACTIVE_PROVIDER` to switch to Twilio/Meta without changing call sites.
- `inventoryPrediction.ts` — buy recommendations from weather + festivals + trends
- `supplierRecommendation.ts` — AI supplier scoring + order generation
- `festivalEngine.ts` — festival campaign generation + countdown
- `customerSegmentation.ts` — per-segment WhatsApp message generation
- `notificationService.ts` — unified smart notification feed

## WhatsApp integration
Current: click-to-chat (`https://wa.me/NUMBER?text=MESSAGE`). All phone numbers normalized to 91XXXXXXXXXX. Future API swap is in `whatsappService.ts`.

## i18n
`src/i18n/` — 12 Indian languages, React Context. Use `useLang()` hook everywhere.

## Key design tokens
- Brand green: `#1f9e6a`
- CSS classes: `card`, `btn`, `nav-item`, `nav-item-active`, `animate-slideUp`

**Why:** Recording because the project has non-obvious auth bypass and service abstraction patterns that must be preserved across sessions.
