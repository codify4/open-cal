
# Contributing to Caly

Thank you for your interest in contributing to Caly! This document provides guidelines and instructions for contributing to our AI-powered calendar assistant.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [pnpm](https://pnpm.io/installation) (package manager)
- [Git](https://git-scm.com/)

### Setup

1. Fork the repository
2. Clone your fork locally
3. Copy `.env.example` to `.env.local`:

   ```bash
   # Unix/Linux/Mac
   cp .env.example .env.local

   # Windows Command Prompt
   copy .env.example .env.local

   # Windows PowerShell
   Copy-Item .env.example .env.local
   ```

4. Install dependencies: `pnpm install`
5. Start the development server: `pnpm dev`

## What to Focus On

**🎯 Good Areas to Contribute:**

- Calendar functionality and UI improvements
- AI chat interface enhancements
- Event management features
- Performance optimizations
- Bug fixes in existing functionality
- UI/UX improvements
- Documentation and testing
- Calendar integration improvements

**⚠️ Areas to Avoid:**

- Major architectural changes without discussion
- Breaking changes to the AI integration
- Changes to the authentication flow without coordination
- Payment processing changes

**Why?** We're currently in early beta and focusing on core functionality. Major architectural changes should be discussed with the maintainers first to ensure they align with our roadmap.

If you're unsure whether your idea fits our current focus, feel free to ask us by creating a GitHub issue!

## Development Setup

### Local Development

1. Navigate to the project directory:

   ```bash
   cd digit
   ```

2. Copy `.env.example` to `.env.local`:

   ```bash
   # Unix/Linux/Mac
   cp .env.example .env.local

   # Windows Command Prompt
   copy .env.example .env.local

   # Windows PowerShell
   Copy-Item .env.example .env.local
   ```

3. Configure required environment variables in `.env`:

   **Required Variables:**

   <!-- ```bash
   # Database (Convex)
   NEXT_PUBLIC_CONVEX_URL="your-convex-url"

   # Authentication (Better Auth)
   BETTER_AUTH_SECRET="your-generated-secret-here"
   NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000" -->

   # AI (Vercel AI SDK + Gemini)
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

   <!-- ```

   **Generate BETTER_AUTH_SECRET:**

   ```bash
   # Unix/Linux/Mac
   openssl rand -base64 32

   # Windows PowerShell (simple method)
   [System.Web.Security.Membership]::GeneratePassword(32, 0)

   # Cross-platform (using Node.js)
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

   # Or use an online generator: https://generate-secret.vercel.app/32
   ``` -->

4. Start the development server: `pnpm dev`

## How to Contribute

### Reporting Bugs

- Use the bug report template
- Include steps to reproduce
- Provide screenshots if applicable
- Mention your browser and OS

### Suggesting Features

- Use the feature request template
- Explain the use case
- Consider implementation details
- Check if it aligns with our current focus areas

### Code Contributions

1. Create a new branch: `git checkout -b feat/your-feature-name`
2. Make your changes
3. Run the linter: `npx ultracite lint`
4. Format your code: `npx ultracite format`
5. Commit your changes with a descriptive message
6. Push to your fork and create a pull request

## Code Style

- We use Ultracite (which includes Biome) for code formatting and linting
- Run `npx ultracite format` to format code
- Run `npx ultracite lint` to check for linting issues
- Follow the existing code patterns
- Follow our accessibility guidelines

## Pull Request Process

1. Fill out the pull request template completely
2. Link any related issues
3. Ensure CI passes
4. Request review from maintainers
5. Address any feedback

## Community

- Be respectful and inclusive
- Follow our Code of Conduct
- Help others in discussions and issues
- Remember we're in early beta - be patient with bugs and missing features

Thank you for contributing to Caly!
