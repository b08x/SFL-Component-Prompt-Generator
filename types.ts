
export interface FrameworkConfig {
  name: string;
  domainContext: string;
  paradigm: string;
  language: string;
  componentTypes: string;
  baseClasses: string;
  frameworkDsl: string;
  integrationPatterns: string;
}

export interface GeneratedComponentPrompt {
  componentName: string;
  prompt: string;
  usageExample: string;
  integrationExample: string;
}

export interface GeneratedContent {
  componentPrompts: GeneratedComponentPrompt[];
  integrationGuidance: {
    overview: string;
    diagram: { 
      nodes: { id: string; label: string }[];
      edges: { from: string; to: string; label?: string }[];
    } | null;
  };
  sflSpecification: {
    field: string;
    tenor: string;
    mode: string;
  };
}
