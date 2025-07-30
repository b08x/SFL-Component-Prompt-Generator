
import React, { useEffect, useCallback, useState } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const helpContent = {
  "Configuration Settings": [
    {
        icon: "fa-solid fa-layer-group",
        title: "Framework Name",
        content: "Specifies the target technology stack (`T`). This acts as the primary context specifier, loading a pre-configured set of constraints and vocabulary (`{paradigm, language, componentTypes, ...}`). The generation model uses `T` to specialize the SFL template, ensuring all outputs are idiomatic to the chosen framework."
    },
    {
        icon: "fa-solid fa-compass",
        title: "Domain Context",
        content: "Defines the application's problem space (`D`). This parameter semantically grounds the generation process. The model correlates the `WORKFLOW_DESCRIPTION` with `D` to infer implicit requirements and select appropriate patterns. For example, a `D` of 'real-time systems' with a workflow for 'updating a dashboard' will prioritize solutions involving WebSockets or SSE over simple polling."
    },
    {
        icon: "fa-solid fa-sitemap",
        title: "Framework Paradigm",
        content: "A high-level architectural constraint (`P`) that dictates the fundamental design pattern for the generated components. The model maps `P` to a computational model (e.g., `component-based UI` -> `UI = f(state)`; `Infrastructure as Code` -> declarative state convergence). This choice fundamentally shapes the structure of the generated code and the nature of component interactions."
    },
    {
        icon: "fa-solid fa-code",
        title: "Programming Language",
        content: "Sets the target language (`L`) as a syntactic constraint. The model generates code examples (`usageExample`, `integrationExample`) and refers to language-specific features within the `prompt` text, ensuring the output is directly usable in an `L`-based environment."
    },
    {
        icon: "fa-solid fa-puzzle-piece",
        title: "Component Types",
        content: "A string-list of valid component archetypes (`C = {c1, c2, ...}`). The model is constrained to decompose the `WORKFLOW_DESCRIPTION` into operations that can be implemented by components from `C`. This prevents the model from inventing non-standard or anti-pattern component structures."
    },
    {
        icon: "fa-solid fa-book-atlas",
        title: "Base Classes",
        content: "A string-list of foundational classes or interfaces (`B = {b1, b2, ...}`). When provided, the model is instructed to generate components that inherit from or implement an element from `B`. This ensures adherence to framework extension points and promotes polymorphism."
    },
    {
        icon: "fa-solid fa-language",
        title: "Framework DSL",
        content: "Defines a domain-specific language or set of keywords (`K = {k1, k2, ...}`). The model is primed to heavily utilize terms from `K` when generating prompts and examples, which is critical for frameworks relying on a specific lexicon (e.g., Ansible's `tasks`, Docker's `RUN`)."
    },
    {
        icon: "fa-solid fa-network-wired",
        title: "Integration Patterns",
        content: "A string-list of prescribed methods for inter-component communication (`I = {i1, i2, ...}`). The model uses `I` to structure the `integrationGuidance` and `integrationExample` sections, guiding the user on how to connect components idiomatically (e.g., using `Context API` in React)."
    },
    {
        icon: "fa-solid fa-pen-ruler",
        title: "Workflow Description",
        content: "The primary user input (`W`). The core SFL process involves the model decomposing this natural language description into functional requirements (`{r1, r2, ...}`) and mapping each `r_n` to a component `c_n` from `COMPONENT_TYPES`, subject to all other constraints. The quality of `W` directly correlates to the accuracy of the generated prompts."
    },
  ],
  "Post-Generation Workflow": [
    {
      icon: "fa-solid fa-rocket",
      title: "Using the Generated Output",
      content: (
          <div>
              <p className="mb-6 text-[#95aac0] leading-relaxed">The generated prompts and code are designed to be a powerful starting point. Here's a typical workflow to integrate them into your project:</p>
              <ol className="space-y-6 list-decimal list-inside text-gray-200">
                  <li className="leading-relaxed">
                      <span className="font-bold text-gray-200">Review the Output</span>
                      <ul className="list-disc list-inside pl-6 mt-2 space-y-2 text-[#95aac0]">
                          <li><strong className="text-gray-300">Component Prompts:</strong> These are detailed instructions for a Large Language Model (LLM) to generate the actual component code.</li>
                          <li><strong className="text-gray-300">Usage & Integration Examples:</strong> These are concrete code snippets showing how a *hypothetical* generated component would be used and connected.</li>
                          <li><strong className="text-gray-300">Integration Guidance:</strong> This provides the high-level architectural overview for how all the pieces fit together.</li>
                      </ul>
                  </li>
                  <li className="leading-relaxed">
                      <span className="font-bold text-gray-200">Generate the Component Code</span>
                      <p className="mt-2 text-[#95aac0] pl-6">
                          Take the text from a <strong className="text-gray-300">"Generated Prompt"</strong> block and paste it into your preferred AI model (e.g., another Gemini session, Claude, ChatGPT). The model will then generate the full component source code based on these expert instructions.
                      </p>
                  </li>
                  <li className="leading-relaxed">
                      <span className="font-bold text-gray-200">Integrate into Your Project</span>
                       <p className="mt-2 text-[#95aac0] pl-6">
                          Create a new file in your codebase (e.g., `MyNewComponent.tsx`), place the AI-generated code from Step 2 into this file, and then use the <strong className="text-gray-300">"Usage Example"</strong> and <strong className="text-gray-300">"Integration Example"</strong> as a guide to import and implement your new component.
                      </p>
                  </li>
                   <li className="leading-relaxed">
                      <span className="font-bold text-gray-200">Test and Refine</span>
                       <p className="mt-2 text-[#95aac0] pl-6">
                         The generated code is a sophisticated first draft, not a final product. It's crucial to test it thoroughly, verify it meets all requirements, handles edge cases, and follows your project's coding standards. Refine and debug as needed.
                      </p>
                  </li>
              </ol>
          </div>
      )
    }
  ]
};

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    const [activeTopicTitle, setActiveTopicTitle] = useState("Framework Name");

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;
    
    const activeTopic = Object.values(helpContent).flat().find(topic => topic.title === activeTopicTitle);

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[#212934] rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] flex overflow-hidden relative border border-[#5c6f7e]"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-6 text-[#95aac0] hover:text-gray-200 transition-colors z-10"
                    aria-label="Close help modal"
                >
                    <i className="fas fa-times text-2xl"></i>
                </button>

                {/* Left Navigation Panel */}
                <div className="w-1/3 bg-[#333e48] p-6 overflow-y-auto">
                    <h2 className="text-xl font-bold text-[#e2a32d] mb-6">Help Menu</h2>
                    {Object.entries(helpContent).map(([category, topics]) => (
                      <div key={category} className="mb-6">
                        <h3 className="text-sm font-semibold text-[#95aac0] uppercase tracking-wider mb-3">{category}</h3>
                        <ul className="space-y-1">
                          {topics.map(topic => (
                            <li key={topic.title}>
                              <button
                                onClick={() => setActiveTopicTitle(topic.title)}
                                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 text-sm ${activeTopicTitle === topic.title ? 'bg-[#e2a32d] text-[#212934] font-bold' : 'text-gray-200 hover:bg-[#5c6f7e]/50'}`}
                              >
                                <i className={`${topic.icon} w-4 text-center`}></i>
                                <span>{topic.title}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>

                {/* Right Content Panel */}
                <div className="w-2/3 p-8 overflow-y-auto">
                    {activeTopic && (
                        <div>
                            <h3 className="text-2xl font-bold text-gray-200 mb-4">{activeTopic.title}</h3>
                            {typeof activeTopic.content === 'string' ? (
                              <p className="text-[#95aac0] text-base leading-relaxed">{activeTopic.content}</p>
                            ) : (
                              activeTopic.content
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
