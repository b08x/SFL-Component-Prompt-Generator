import React, { useState } from 'react';
import { GeneratedContent, FrameworkConfig } from '../types';
import CodeBlock from './ui/CodeBlock';
import Button from './ui/Button';

interface PreviewPanelProps {
  content: GeneratedContent | null;
  isLoading: boolean;
  error: string | null;
  onExport: (format: 'json' | 'md') => void;
  config: FrameworkConfig;
}

const Spinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-[#95aac0]">
        <svg className="animate-spin h-12 w-12 text-[#e2a32d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg">Generating prompts with Gemini...</p>
        <p className="text-sm">This may take a moment.</p>
    </div>
);

const WelcomeMessage: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-[#95aac0] p-8">
        <i className="fas fa-wand-magic-sparkles text-6xl text-[#e2a32d] mb-6"></i>
        <h2 className="text-2xl font-bold text-gray-200 mb-2">SFL-Component-Prompt-Generator</h2>
        <p>Configure your framework and describe your workflow on the left, then click "Generate Prompts" to see the magic happen!</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="p-6 m-4 bg-red-600/10 border border-red-600 rounded-lg text-red-300">
        <div className="flex items-center gap-3">
            <i className="fas fa-exclamation-triangle text-xl"></i>
            <h3 className="font-bold text-lg">An error occurred</h3>
        </div>
        <pre className="mt-4 p-3 bg-black/20 rounded-md text-sm whitespace-pre-wrap font-mono">
            {message}
        </pre>
    </div>
);


const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors focus:outline-none ${
            active ? 'bg-[#212934] text-[#e2a32d]' : 'text-[#95aac0] hover:bg-[#333e48]/80 hover:text-gray-200'
        }`}
    >
        {children}
    </button>
);

const PreviewPanel: React.FC<PreviewPanelProps> = ({ content, isLoading, error, onExport, config }) => {
    const [activeTab, setActiveTab] = useState('prompts');

    if (isLoading) return <Spinner />;
    if (error) return <ErrorDisplay message={error} />;
    if (!content) return <WelcomeMessage />;

    const renderContent = () => {
        switch (activeTab) {
            case 'prompts':
                return (
                    <div>
                        {content.componentPrompts.map((p, i) => (
                            <div key={i} className="mb-8 p-4 border border-[#5c6f7e] rounded-lg bg-[#333e48]/40">
                                <h3 className="text-lg font-semibold text-[#e2a32d] mb-2">{p.componentName}</h3>
                                <h4 className="font-bold text-gray-200 mt-4">Generated Prompt:</h4>
                                <CodeBlock content={p.prompt} language="markdown" wrapText={true} />
                                <h4 className="font-bold text-gray-200 mt-4">Usage Example:</h4>
                                <CodeBlock content={p.usageExample} language={config.language.toLowerCase()} />
                                <h4 className="font-bold text-gray-200 mt-4">Integration Example:</h4>
                                <CodeBlock content={p.integrationExample} language={config.language.toLowerCase()} />
                            </div>
                        ))}
                    </div>
                );
            case 'integration':
                return (
                    <div>
                        <h3 className="text-xl font-bold text-gray-200 mb-4">Integration Guidance</h3>
                        <p className="text-gray-200 mb-6 whitespace-pre-wrap">{content.integrationGuidance.overview}</p>
                        {content.integrationGuidance.diagram && (
                             <div className="p-4 bg-[#333e48]/40 rounded-lg border border-[#5c6f7e]">
                                <h4 className="font-semibold text-gray-200 mb-4">Component Flow</h4>
                                <div className="flex flex-wrap gap-8 items-center justify-center">
                                    {content.integrationGuidance.diagram.nodes.map((node, index) => (
                                        <React.Fragment key={node.id}>
                                            <div className="bg-[#212934] border border-[#5c6f7e] text-gray-200 p-4 rounded-lg shadow-lg text-center">
                                                <i className="fas fa-box-open mb-2"></i>
                                                <div>{node.label}</div>
                                            </div>
                                            {index < content.integrationGuidance.diagram.nodes.length - 1 && <i className="fas fa-arrow-right text-[#95aac0] text-2xl"></i>}
                                        </React.Fragment>
                                    ))}
                                </div>
                             </div>
                        )}
                    </div>
                );
            case 'sfl':
                 return (
                    <div>
                        <h3 className="text-xl font-bold text-gray-200 mb-4">SFL Specification</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-[#e2a32d] text-lg mb-2">Field</h4>
                                <p className="text-gray-200 whitespace-pre-wrap">{content.sflSpecification.field}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#e2a32d] text-lg mb-2">Tenor</h4>
                                <p className="text-gray-200 whitespace-pre-wrap">{content.sflSpecification.tenor}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#e2a32d] text-lg mb-2">Mode</h4>
                                <p className="text-gray-200 whitespace-pre-wrap">{content.sflSpecification.mode}</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-full flex flex-col">
           <div className="flex-shrink-0 px-6 pt-2 border-b border-[#5c6f7e] flex justify-between items-center bg-[#333e48]">
                <div>
                    <TabButton active={activeTab === 'prompts'} onClick={() => setActiveTab('prompts')}>Component Prompts</TabButton>
                    <TabButton active={activeTab === 'integration'} onClick={() => setActiveTab('integration')}>Integration</TabButton>
                    <TabButton active={activeTab === 'sfl'} onClick={() => setActiveTab('sfl')}>SFL Spec</TabButton>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => onExport('json')}><i className="fas fa-file-code mr-2"></i> JSON</Button>
                    <Button variant="secondary" onClick={() => onExport('md')}><i className="fab fa-markdown mr-2"></i> MD</Button>
                </div>
            </div>
            <div className="flex-grow p-6 overflow-y-auto bg-[#212934] text-gray-200">
                {renderContent()}
            </div>
        </div>
    );
};

export default PreviewPanel;