import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { FrameworkConfig, GeneratedContent } from '../types';

const SFL_TEMPLATE = `
You are an expert system designed to execute the "SFL-Framework Domain-Agnostic Component Meta-Prompt Template". Your task is to analyze a user's workflow description and generate targeted prompts for creating software components.

Here is the fully configured SFL Framework specification you MUST adhere to:

--- SFL FRAMEWORK CONFIGURATION START ---

### OBJECTIVE
Analyze user workflow descriptions and generate targeted prompts for creating appropriate {FRAMEWORK_NAME} components that implement the described {DOMAIN_CONTEXT} efficiently and correctly using {FRAMEWORK_PARADIGM} patterns.

### INPUT SPECIFICATIONS
**User Provides:**
- Workflow description outlining desired automation or system behavior
- Context about the domain and technical requirements

**System Generates:**
- 1-4 component-specific prompts based on workflow complexity
- Each prompt immediately actionable for creating working {FRAMEWORK_NAME} components
- Integration guidance showing how components work together

### OUTPUT REQUIREMENTS
**Deliverable Format:**
- Component-specific prompts using proper {FRAMEWORK_NAME} patterns and terminology
- Concrete {PROGRAMMING_LANGUAGE} code examples and implementation patterns
- Integration specifications for component coordination
- Framework-specific best practices and conventions

### FRAMEWORK CONFIGURATION VARIABLES (SELECTED)
- **FRAMEWORK_NAME**: {FRAMEWORK_NAME}
- **DOMAIN_CONTEXT**: {DOMAIN_CONTEXT}
- **FRAMEWORK_PARADIGM**: {FRAMEWORK_PARADIGM}
- **PROGRAMMING_LANGUAGE**: {PROGRAMMING_LANGUAGE}
- **COMPONENT_TYPES**: {COMPONENT_TYPES}
- **BASE_CLASSES**: {BASE_CLASSES}
- **FRAMEWORK_DSL**: {FRAMEWORK_DSL}
- **INTEGRATION_PATTERNS**: {INTEGRATION_PATTERNS}

--- SFL FRAMEWORK CONFIGURATION END ---

Now, analyze the following user-provided workflow description based on the configured framework above.

--- USER WORKFLOW DESCRIPTION START ---
{WORKFLOW_DESCRIPTION}
--- USER WORKFLOW DESCRIPTION END ---

Based on your analysis, perform the following actions:
1. Decompose the workflow into 1-4 distinct component requirements.
2. For each component, generate a specific, actionable prompt for its creation. Follow the "Generic Prompt Generation Structure" from the SFL template.
3. Provide clear integration guidance, including an overview and a simple visual diagram structure, explaining how the components work together.
4. Summarize the adapted SFL (Field, Tenor, Mode) specifications for this context.

Your final output MUST be a single JSON object. Do not include any text outside of the JSON object, including markdown fences. The JSON object must strictly follow this TypeScript interface:

\`\`\`typescript
interface GeneratedComponentPrompt {
  componentName: string; // A descriptive name for the component, e.g., 'UserAuthenticationForm'
  prompt: string; // The detailed, generated prompt for this component.
  usageExample: string; // A concrete code example showing how to use the generated component.
  integrationExample: string; // A concrete code example showing how this component integrates with others.
}

interface GeneratedContent {
  componentPrompts: GeneratedComponentPrompt[];
  integrationGuidance: {
    overview: string; // A textual explanation of how the components connect.
    diagram: { 
      nodes: { id: string; label: string }[]; // Nodes for a simple flowchart.
      edges: { from: string; to: string; label?: string }[]; // Edges connecting the nodes.
    } | null;
  };
  sflSpecification: {
    field: string; // The adapted 'Field' section summary.
    tenor: string; // The adapted 'Tenor' section summary.
    mode: string; // The adapted 'Mode' section summary.
  };
}
\`\`\`

Ensure the JSON is well-formed.
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        componentPrompts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    componentName: { type: Type.STRING },
                    prompt: { type: Type.STRING },
                    usageExample: { type: Type.STRING },
                    integrationExample: { type: Type.STRING },
                },
                required: ['componentName', 'prompt', 'usageExample', 'integrationExample']
            }
        },
        integrationGuidance: {
            type: Type.OBJECT,
            properties: {
                overview: { type: Type.STRING },
                diagram: {
                    type: Type.OBJECT,
                    properties: {
                        nodes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    label: { type: Type.STRING }
                                },
                                required: ['id', 'label']
                            }
                        },
                        edges: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    from: { type: Type.STRING },
                                    to: { type: Type.STRING },
                                    label: { type: Type.STRING }
                                },
                                required: ['from', 'to']
                            }
                        }
                    },
                    required: ['nodes', 'edges']
                }
            },
            required: ['overview']
        },
        sflSpecification: {
            type: Type.OBJECT,
            properties: {
                field: { type: Type.STRING },
                tenor: { type: Type.STRING },
                mode: { type: Type.STRING }
            },
            required: ['field', 'tenor', 'mode']
        }
    },
    required: ['componentPrompts', 'integrationGuidance', 'sflSpecification']
};


export const generatePrompts = async (config: FrameworkConfig, workflowDescription: string): Promise<GeneratedContent> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let filledTemplate = SFL_TEMPLATE
    .replace(/{FRAMEWORK_NAME}/g, config.name)
    .replace(/{DOMAIN_CONTEXT}/g, config.domainContext)
    .replace(/{FRAMEWORK_PARADIGM}/g, config.paradigm)
    .replace(/{PROGRAMMING_LANGUAGE}/g, config.language)
    .replace(/{COMPONENT_TYPES}/g, config.componentTypes)
    .replace(/{BASE_CLASSES}/g, config.baseClasses)
    .replace(/{FRAMEWORK_DSL}/g, config.frameworkDsl)
    .replace(/{INTEGRATION_PATTERNS}/g, config.integrationPatterns)
    .replace('{WORKFLOW_DESCRIPTION}', workflowDescription);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: filledTemplate,
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema
        }
    });
    
    let jsonStr = response.text.trim();
    // In case the model still wraps the output in markdown fences despite instructions
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);
    return parsedData as GeneratedContent;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate prompts: ${error.message}`);
    }
    throw new Error("An unknown error occurred during prompt generation.");
  }
};