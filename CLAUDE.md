# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup
```bash
npm install
```

### Running the Application
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

### Environment Configuration
- Set `GEMINI_API_KEY` in `.env.local` to use the Gemini API for prompt generation
- The Vite config maps `GEMINI_API_KEY` to `process.env.API_KEY` in the application

## Architecture Overview

This is a React-based SFL (Systemic Functional Linguistics) Component Prompt Generator that uses the Gemini AI API to generate framework-specific component prompts based on user workflow descriptions.

### Core Architecture

**Main Application Flow:**
- `App.tsx` manages the overall state and coordinates between configuration and preview panels
- Split-panel interface: Configuration (left) and Preview (right)
- Real-time generation of component prompts based on framework configuration and workflow descriptions

**Key Data Flow:**
1. User selects framework from predefined mappings in `constants.ts`
2. Framework selection auto-populates configuration fields
3. User provides workflow description
4. Configuration + workflow sent to Gemini API via `geminiService.ts`
5. Generated prompts displayed in preview panel with export options

### Framework Configuration System

The application uses a sophisticated framework mapping system:

- **Framework Mappings** (`constants.ts:8-45`): Predefined configurations for Sublayer, React, Docker, and Ansible
- **Auto-configuration**: Selecting a framework automatically populates domain context, paradigm, language, component types, base classes, DSL, and integration patterns
- **SFL Template**: Uses a comprehensive meta-prompt template that adapts to any framework configuration

### Component Structure

**Main Components:**
- `ConfigurationPanel`: Framework selection, configuration editing, workflow input
- `PreviewPanel`: Generated content display, export functionality
- `HelpModal`: User guidance and examples

**UI Components** (`components/ui/`):
- Reusable Button, CodeBlock, and Dropdown components
- Consistent styling with dark theme (`#212934` background)

### API Integration

**Gemini Service** (`services/geminiService.ts`):
- Uses Google GenAI SDK with structured JSON responses
- Implements comprehensive SFL meta-prompt template (lines 4-83)
- Response schema validation for type safety
- Error handling with user-friendly messages

### Types and Data Models

**Core Interfaces** (`types.ts`):
- `FrameworkConfig`: Framework-specific configuration
- `GeneratedContent`: Complete generated output structure
- `GeneratedComponentPrompt`: Individual component prompt structure

### Export System

The application supports two export formats:
- **JSON**: Complete configuration and generated content
- **Markdown**: Formatted documentation with code examples and integration guidance

## Key Implementation Details

- **State Management**: Uses React hooks for local state, no external state library
- **API Key Handling**: Environment-based configuration with Vite build-time injection
- **Error Boundaries**: Comprehensive error handling in API calls and UI rendering
- **TypeScript**: Fully typed with strict type checking enabled