# SFL Component Prompt Generator

A React-based tool that uses Systemic Functional Linguistics (SFL) principles to generate framework-specific component prompts from user workflow descriptions, powered by Google's Gemini AI.

## Features

- **Framework-Agnostic Design**: Supports multiple frameworks including Sublayer, React, Docker, and Ansible
- **AI-Powered Generation**: Uses Gemini API to create tailored component prompts based on SFL meta-templates
- **Real-time Preview**: Split-panel interface with configuration on the left and live preview on the right
- **Export Options**: Export generated prompts as JSON or Markdown files
- **Comprehensive Documentation**: Built-in help modal with examples and guidance

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SFL-Component-Prompt-Generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
```

## Usage

### Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

### Basic Workflow

1. **Select Framework**: Choose from predefined frameworks (Sublayer, React, Docker, Ansible)
2. **Configure Settings**: Framework selection auto-populates configuration fields
3. **Describe Workflow**: Enter a detailed workflow description
4. **Generate Prompts**: Click "Generate Component Prompts" to create AI-powered prompts
5. **Export Results**: Download generated content as JSON or Markdown

## Architecture

### Core Components

- **App.tsx**: Main application state management and coordination
- **ConfigurationPanel**: Framework selection and workflow input
- **PreviewPanel**: Generated content display and export functionality
- **HelpModal**: User guidance and examples

### Framework Configuration System

The application uses a sophisticated mapping system in `constants.ts`:

```typescript
const FRAMEWORK_MAPPINGS = {
  'Sublayer': {
    domainContext: 'automation',
    paradigm: 'agent-based automation',
    language: 'Ruby',
    // ... additional configuration
  },
  // ... other frameworks
}
```

### API Integration

**Gemini Service** (`services/geminiService.ts`):
- Implements comprehensive SFL meta-prompt template
- Uses structured JSON responses with schema validation
- Handles error cases with user-friendly messages

### Data Models

**Core Interfaces** (`types.ts`):
```typescript
interface FrameworkConfig {
  name: string;
  domainContext: string;
  paradigm: string;
  language: string;
  componentTypes: string;
  baseClasses: string;
  frameworkDsl: string;
  integrationPatterns: string;
}

interface GeneratedContent {
  componentPrompts: GeneratedComponentPrompt[];
  integrationGuidance: {
    overview: string;
    diagram: { nodes: any[]; edges: any[]; } | null;
  };
  sflSpecification: {
    field: string;
    tenor: string;
    mode: string;
  };
}
```

## Example Workflows

### Sublayer (Ruby Automation)
```
As a DevOps engineer, I want to automate the process of creating a new user in our system whenever a new employee is added to the HR platform, so that manual user creation is eliminated.
```

### React (TypeScript UI)
```
As a user, I want to be able to filter a list of products by category and price range, so that I can find what I'm looking for more easily.
```

### Docker (Infrastructure)
```
As a developer, I want to create a multi-container Docker environment for a web application with a frontend, a backend API, and a database, so that I can ensure consistent development and testing environments.
```

## SFL Meta-Template System

The application uses a sophisticated SFL (Systemic Functional Linguistics) template that adapts to any framework configuration. The template includes:

- **Field**: Domain-specific terminology and concepts
- **Tenor**: Relationship between user requirements and technical implementation
- **Mode**: Communication patterns and integration approaches

## Export Formats

### JSON Export
Complete configuration and generated content in structured format suitable for programmatic use.

### Markdown Export
Formatted documentation with:
- Configuration details
- Component prompts with usage examples
- Integration guidance
- SFL specifications

## Development

### Project Structure
```
src/
├── components/
│   ├── ConfigurationPanel.tsx
│   ├── HelpModal.tsx
│   ├── PreviewPanel.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── CodeBlock.tsx
│       └── Dropdown.tsx
├── services/
│   └── geminiService.ts
├── App.tsx
├── constants.ts
├── types.ts
└── index.tsx
```

### Key Implementation Details

- **State Management**: React hooks for local state management
- **API Integration**: Environment-based Gemini API configuration
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Styling**: Dark theme with `#212934` background and consistent UI components

### Environment Configuration

The Vite configuration maps environment variables:
```typescript
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

## Troubleshooting

### Common Issues

1. **API Key Not Set**: Ensure `GEMINI_API_KEY` is properly configured in `.env.local`
2. **Generation Failures**: Check API key validity and network connectivity
3. **Export Issues**: Verify browser permissions for file downloads

### Error Messages

- `"API_KEY environment variable not set"`: Configure your Gemini API key
- `"Failed to generate prompts"`: API call failed, check key and connectivity
- `"Please provide a workflow description"`: Enter a workflow before generating

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the SFL-Toolbox suite. Please refer to the main repository for licensing information.

## Related Projects

- [SFL-Toolbox](https://github.com/your-org/SFL-Toolbox) - Main toolbox repository
- [Sublayer Framework](https://github.com/sublayerapp/sublayer) - Ruby automation framework

## Support

For issues and questions:
1. Check the built-in help modal
2. Review this README
3. Open an issue in the repository
4. Consult the SFL-Toolbox documentation