# Habit App Prototype Instructions

## Purpose

This repo contains multiple prototypes for mobile habit tracking apps for usability testing.

These apps are high-fidelity prototypes, not production-level apps. Prioritize Figma fidelity, believable prototype interactions, and clean structure for easy future edits.

## Source of Truth

When Figma screens are provided, treat them as the source of truth.

Match the build to the provided designs as closely as possible including:

- Layout
- Spacing
- Typography
- Colors
- Icons
- Component shapes
- Overlays and screen states
- Navigation behavior shown in the designs

Use the actual SVG icons or assets from Figma whenever possible. Do not substitute similar icon-library icons unless explicitly approved. If you cannot use an SVG or asset from Figma stop and ask the user how to proceed.

If a screen, interaction, or asset is unclear, stop and ask for clarification instead of guessing.

## Scope

Only build the screens and flows explicitly requested.

Do not add unrequested:

- Auth
- Onboarding
- Backend services
- APIs
- Analytics
- Databases
- Payment systems
- Notification systems
- Settings/profile flows
- Extra tabs/pages/features

If a visible tab or section is outside the requested scope, decide whether the interaction is essential or not. If essential but outside of requested scope stop and ask for clarification, if non-essential and outside of requested scope leave it as a no-op or lightweight placeholder.

## State and Data

Keep prototype data consistent across related screens and states.

When user actions change data, update the visible UI accordingly.

Examples:

- Creating a habit should add it to the relevant home state
- Deleting the seeded habit should reveal the empty state if one exists
- Editing a habit should update visible habit details
- Changing progress values should update related progress visuals
- Selecting a date should update the date-specific view

When designs show arcs, progress indicators, calendar marks, or completion states, match the design closely. Do not turn arcs into full circles if the design shows arcs.

## Prototype Implementation

Favor simple, lightweight implementations that fit the existing codebase.

Prefer:

- Existing project patterns
- Reusing components where practical
- Local state and mock data when sufficient
- Small, targeted changes

Avoid:

- Unnecessary complexity
- Large rewrites
- New dependencies unless clearly needed
- Production-level architecture for prototype-only features

Do not change implementation approaches solely to match these guidelines if the existing solution is already reasonable.

## Work Process

Before changing files:

1. Inspect the relevant app folder and existing structure.
2. Identify existing components and patterns.
3. Confirm access to referenced Figma screens/assets.
4. Ask about unclear instructions before coding.

When changing files:

- Reuse existing components where possible.
- Keep changes localized.
- Patch the smallest affected screen/component/state.
- Do not rewrite unrelated screens or restyle the whole app.

After changes:

- Verify the relevant prototype flow.
- Run available build/lint/typecheck/test commands when practical.
- Report what changed, files touched, what was verified, and any known limitations.
