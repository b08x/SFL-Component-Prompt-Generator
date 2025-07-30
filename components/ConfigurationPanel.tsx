import React from 'react';
import { FrameworkConfig } from '../types';
import { FRAMEWORK_NAMES, DOMAIN_CONTEXTS, FRAMEWORK_PARADIGMS, PROGRAMMING_LANGUAGES, WORKFLOW_EXAMPLES } from '../constants';
import Dropdown from './ui/Dropdown';
import Button from './ui/Button';

interface ConfigurationPanelProps {
  config: FrameworkConfig;
  setConfig: React.Dispatch<React.SetStateAction<FrameworkConfig>>;
  workflowDescription: string;
  setWorkflowDescription: React.Dispatch<React.SetStateAction<string>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const ReadOnlyField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-[#95aac0] mb-1">{label}</label>
        <div className="w-full bg-[#212934] border border-[#5c6f7e] text-[#95aac0] rounded-md p-2 min-h-[42px]">{value}</div>
    </div>
);


const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ config, setConfig, workflowDescription, setWorkflowDescription, onGenerate, isLoading }) => {
  const handleConfigChange = <K extends keyof FrameworkConfig,>(key: K, value: FrameworkConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 bg-[#333e48] h-full overflow-y-auto flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-200">1. Configure Framework</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dropdown label="Framework" options={FRAMEWORK_NAMES} value={config.name} onChange={e => handleConfigChange('name', e.target.value)} />
        <Dropdown label="Domain Context" options={DOMAIN_CONTEXTS} value={config.domainContext} onChange={e => handleConfigChange('domainContext', e.target.value)} />
        <Dropdown label="Paradigm" options={FRAMEWORK_PARADIGMS} value={config.paradigm} onChange={e => handleConfigChange('paradigm', e.target.value)} />
        <Dropdown label="Language" options={PROGRAMMING_LANGUAGES} value={config.language} onChange={e => handleConfigChange('language', e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReadOnlyField label="Component Types" value={config.componentTypes} />
        <ReadOnlyField label="Base Classes" value={config.baseClasses} />
        <ReadOnlyField label="Framework DSL" value={config.frameworkDsl} />
        <ReadOnlyField label="Integration Patterns" value={config.integrationPatterns} />
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-200 mt-4 mb-2">2. Describe Workflow</h2>
         <p className="text-sm text-[#95aac0] mb-2">
            <i className="fas fa-lightbulb mr-1"></i> Tip: Structure your request as a user story (e.g., "As a [persona], I want to [action]...").
        </p>
        <textarea
          value={workflowDescription}
          onChange={e => setWorkflowDescription(e.target.value)}
          placeholder={WORKFLOW_EXAMPLES[config.name] || "Describe the desired behavior or automation..."}
          className="w-full h-40 bg-[#212934] border border-[#5c6f7e] text-gray-200 rounded-md p-3 focus:ring-[#e2a32d] focus:border-[#e2a32d] transition"
        />
      </div>

      <div className="mt-auto pt-6">
        <Button onClick={onGenerate} isLoading={isLoading} className="w-full text-lg">
          <i className="fas fa-cogs mr-2"></i> Generate Prompts
        </Button>
      </div>
    </div>
  );
};

export default ConfigurationPanel;