# Copilot Instructions – Agentic Coding Course Repository

## Project Overview
This repository contains educational material for a 4-hour GitHub Copilot
Agentic Coding course. It includes curriculum modules, example files,
and a starter Node.js/Express application used in Module 7.

The root `index.html` is a standalone slide-deck presentation covering all 7
modules. It requires **no build step** — pure HTML/CSS/JS in a single file.
It is deployed on Netlify at **https://llmbasicscopilot.netlify.app/** and
auto-deploys on every push to the default branch.

## Tech Stack
- Node.js 20 LTS with TypeScript (strict mode)
- Express 4 for the starter API
- Jest + Supertest for testing
- Zod for input validation
- Markdown for all documentation

## Conventions
- Use TypeScript strict mode throughout the starter app.
- Prefer `async`/`await` over raw Promises or callbacks.
- Use named exports — avoid default exports except for the Express `app`.
- File names: `kebab-case.ts`; class names: `PascalCase`; variables: `camelCase`.
- Add JSDoc comments to all exported functions and types.
- Maximum function length: 30 lines. Extract helpers if longer.

## Testing
- Every new exported function MUST have a Jest unit or integration test.
- Integration tests use Supertest and live in `tests/`.
- Run tests with `npm test` from the `starter-app` directory.

## Documentation
- Module documentation lives in `curriculum/module-XX-*/README.md`.
- Keep code examples in documentation runnable and copy-paste friendly.
- Each module README must include a checklist at the end.

## Presentation (`index.html`)
- `index.html` is a self-contained slide deck — do NOT extract CSS or JS into separate files.
- Each slide is a `<div class="slide">` inside `<div class="deck" id="deck">`.
- Module color badges use classes `m1`–`m7` (see `:root` CSS variables for the palette).
- Slide content must stay in sync with the corresponding `curriculum/module-XX-*/README.md`.
- The live site is at https://llmbasicscopilot.netlify.app/ — changes deploy automatically on push.

## Security
- Never log passwords, tokens, or personally identifiable information (PII).
- Always use parameterised queries — never concatenate user input into SQL.
- Validate all external input using Zod schemas.
- Do not commit `.env` files or any secrets.

## Output Format
- Respond with code only unless an explanation is specifically requested.
- When creating new files, state the file path clearly before the code block.
- Include `// TODO:` markers for intentional follow-up work.
