import { FrameworkConfig } from './types';

export const FRAMEWORK_NAMES = ["Sublayer", "React", "Docker", "Ansible"];
export const DOMAIN_CONTEXTS = ["web development", "automation", "data processing", "API development", "testing", "machine learning", "content management", "real-time systems", "mobile development", "DevOps"];
export const FRAMEWORK_PARADIGMS = ["component-based UI", "agent-based automation", "MVC web framework", "middleware-based API", "decorator-based routing", "reactive programming", "event-driven architecture", "microservices", "test-driven development", "data pipeline orchestration", "Infrastructure as Code", "Configuration Management"];
export const PROGRAMMING_LANGUAGES = ["TypeScript", "JavaScript", "Python", "Java", "Ruby", "C#", "Go", "Rust", "Swift", "Kotlin", "YAML"];

export const FRAMEWORK_MAPPINGS: { [key: string]: Omit<FrameworkConfig, 'name'> } = {
  'Sublayer': {
    domainContext: 'automation',
    paradigm: 'agent-based automation',
    language: 'Ruby',
    componentTypes: 'triggers, actions, agents, generators',
    baseClasses: 'Sublayer::Triggers::Base',
    frameworkDsl: 'trigger, goal_condition, check_status, step',
    integrationPatterns: 'trigger-agent-action coordination',
  },
  'React': {
    domainContext: 'web development',
    paradigm: 'component-based UI',
    language: 'TypeScript',
    componentTypes: 'components, hooks, contexts, services',
    baseClasses: 'React.Component, React.FC',
    frameworkDsl: 'props, state, useEffect, JSX',
    integrationPatterns: 'prop-drilling, Context API, custom hooks, Redux/Zustand',
  },
  'Docker': {
    domainContext: 'DevOps',
    paradigm: 'Infrastructure as Code',
    language: 'YAML',
    componentTypes: 'Dockerfile, image, container, service, volume, network',
    baseClasses: 'N/A',
    frameworkDsl: 'FROM, RUN, COPY, CMD, ENTRYPOINT, ENV',
    integrationPatterns: 'Docker Compose, Kubernetes orchestration, multi-stage builds',
  },
  'Ansible': {
    domainContext: 'DevOps',
    paradigm: 'Configuration Management',
    language: 'YAML',
    componentTypes: 'playbook, role, task, handler, inventory, module',
    baseClasses: 'N/A',
    frameworkDsl: 'hosts, tasks, name, ansible.builtin, become, vars',
    integrationPatterns: 'Roles, collections, dynamic inventory, Ansible Vault',
  }
};

export const WORKFLOW_EXAMPLES: { [key: string]: string } = {
  'Sublayer': "As a DevOps engineer, I want to automate the process of creating a new user in our system whenever a new employee is added to the HR platform, so that manual user creation is eliminated.",
  'React': "As a user, I want to be able to filter a list of products by category and price range, so that I can find what I'm looking for more easily.",
  'Docker': "As a developer, I want to create a multi-container Docker environment for a web application with a frontend, a backend API, and a database, so that I can ensure consistent development and testing environments.",
  'Ansible': "As a system administrator, I want to write a playbook that installs and configures Nginx on a group of web servers, so that I can apply a consistent configuration across my fleet."
};
