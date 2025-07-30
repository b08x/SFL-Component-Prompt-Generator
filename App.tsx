import React, { useState, useEffect, useCallback } from 'react';
import { FrameworkConfig, GeneratedContent } from './types';
import { FRAMEWORK_MAPPINGS } from './constants';
import { generatePrompts } from './services/geminiService';
import ConfigurationPanel from './components/ConfigurationPanel';
import PreviewPanel from './components/PreviewPanel';

const App: React.FC = () => {
  const [config, setConfig] = useState<FrameworkConfig>({
    name: 'Sublayer',
    domainContext: 'automation',
    paradigm: 'agent-based automation',
    language: 'Ruby',
    componentTypes: 'triggers, commands, actions, tools, agents, generators',
    baseClasses: 'Sublayer::Triggers::Base',
    frameworkDsl: 'trigger, goal_condition, check_status, step',
    integrationPatterns: 'trigger-agent-action coordination',
  });

  const [workflowDescription, setWorkflowDescription] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mapping = FRAMEWORK_MAPPINGS[config.name];
    if (mapping) {
      setConfig(prev => ({
        name: prev.name,
        ...mapping,
      }));
    }
  }, [config.name]);

  const handleGenerate = useCallback(async () => {
    if (!workflowDescription.trim()) {
      setError("Please provide a workflow description.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    try {
      const content = await generatePrompts(config, workflowDescription);
      setGeneratedContent(content);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [config, workflowDescription]);

  const handleExport = useCallback((format: 'json' | 'md') => {
    if (!generatedContent) return;

    let fileContent = '';
    let fileExtension = format;
    let mimeType = 'text/plain';
    const fileName = `sfl-prompt-output-${Date.now()}`;

    if (format === 'json') {
      fileContent = JSON.stringify({ config, generatedContent }, null, 2);
      mimeType = 'application/json';
    } else if (format === 'md') {
        const mdParts: string[] = [];
        mdParts.push(`# Generated Prompts for ${config.name}`);
        mdParts.push(`\n---\n`);
        mdParts.push(`## Configuration`);
        mdParts.push(`\`\`\`json`);
        mdParts.push(JSON.stringify(config, null, 2));
        mdParts.push(`\`\`\`\n`);
        mdParts.push(`## Component Prompts`);
        generatedContent.componentPrompts.forEach(p => {
            mdParts.push(`### ${p.componentName}`);
            mdParts.push('**Prompt:**');
            mdParts.push('```markdown');
            mdParts.push(p.prompt);
            mdParts.push('```');
            mdParts.push('**Usage Example:**');
            mdParts.push(`\`\`\`${config.language.toLowerCase()}`);
            mdParts.push(p.usageExample);
            mdParts.push('```');
             mdParts.push('**Integration Example:**');
            mdParts.push(`\`\`\`${config.language.toLowerCase()}`);
            mdParts.push(p.integrationExample);
            mdParts.push('```');
        });

        mdParts.push(`\n---\n`);
        mdParts.push(`## Integration Guidance`);
        mdParts.push(generatedContent.integrationGuidance.overview);
        
        mdParts.push(`\n---\n`);
        mdParts.push(`## SFL Specification`);
        mdParts.push(`### Field`);
        mdParts.push(generatedContent.sflSpecification.field);
        mdParts.push(`### Tenor`);
        mdParts.push(generatedContent.sflSpecification.tenor);
        mdParts.push(`### Mode`);
        mdParts.push(generatedContent.sflSpecification.mode);

        fileContent = mdParts.join('\n\n');
        mimeType = 'text/markdown';
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  }, [generatedContent, config]);

  return (
    <div className="flex h-screen bg-[#212934] text-gray-200 font-sans">
      <div className="w-1/2 lg:w-2/5 border-r border-[#5c6f7e] flex flex-col">
        <ConfigurationPanel
          config={config}
          setConfig={setConfig}
          workflowDescription={workflowDescription}
          setWorkflowDescription={setWorkflowDescription}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
      </div>
      <div className="w-1/2 lg:w-3/5">
        <PreviewPanel
          content={generatedContent}
          isLoading={isLoading}
          error={error}
          onExport={handleExport}
          config={config}
        />
      </div>
    </div>
  );
};

export default App;