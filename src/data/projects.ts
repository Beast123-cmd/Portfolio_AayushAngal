export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: 'ai' | 'platform' | 'web';
  github?: string;
  githubVisibility?: 'public' | 'private';
  demo?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 'medico-ai',
    title: 'Medico.ai — AI Medical Intelligence System',
    description: 'An AI-assisted clinical assessment system that manages multi-step patient interactions, maintains context across follow-ups, and generates structured medical reports. Includes urgency classification, persistent assessment records, and automated tests for authentication, triage behavior, and AI failure scenarios.',
    image: 'project-meds-ai',
    tags: ['Python', 'LangGraph', 'FastAPI', 'Next.js', 'PyTest'],
    category: 'ai',
    github: 'https://github.com/Beast123-cmd/Medico.ai',
    githubVisibility: 'private',
    featured: true,
  },
  {
    id: 'researchsync',
    title: 'ResearchSync — Research Publication Management System',
    description: 'A centralized publication platform for PICT that streamlines faculty submissions, verification, and accreditation reporting. Its PDF-to-structured-data pipeline validates extracted metadata and routes incomplete or inconsistent records for coordinator review.',
    image: 'project-chatpdf',
    tags: ['FastAPI', 'PostgreSQL', 'React', 'PDF Processing', 'Data Validation'],
    category: 'platform',
    github: 'https://github.com/Beast123-cmd/ResearchSync',
    githubVisibility: 'private',
    featured: true,
  },
  {
    id: 'elevra-ai',
    title: 'Elevra.ai — Student Success Intelligence Platform',
    description: 'A student success platform that unifies seven academic, attendance, learning, and career data sources into consistent student profiles. Explainable success scores and academic and placement risk indicators show contributing factors, account for missing data, and help mentors identify students who may need early support.',
    image: 'project-kaggle',
    tags: ['AI/ML', 'Data Analytics', 'Risk Scoring', 'Full-Stack'],
    category: 'ai',
    github: 'https://github.com/Beast123-cmd/Elevra.ai',
    demo: 'https://elevra.engimind.cloud',
    featured: true,
  },
  {
    id: 'web-navigator',
    title: 'SEEKR AI — Web Navigator Agent',
    description: 'An AI-powered web navigator and e-commerce comparison platform. It interprets natural-language requests, automates multi-stage web data extraction, and presents product comparisons through an interactive dashboard.',
    image: 'project-seekr',
    tags: ['Python', 'LLMs', 'Playwright', 'React', 'NLP', 'Web Automation'],
    category: 'ai',
    github: 'https://github.com/Beast123-cmd/Web-navigator-agent',
    featured: true,
  },
  {
    id: 'library-management',
    title: 'Library Management System',
    description: 'A full-stack library application with role-based authentication, book availability tracking, and transaction management. Password hashing and database operations support secure, reliable use by multiple users.',
    image: 'project-library',
    tags: ['HTML', 'CSS', 'JavaScript', 'Flask', 'SQLite', 'Authentication'],
    category: 'web',
    github: 'https://github.com/Beast123-cmd/Library-Management-System',
    demo: 'https://library-management-system-3fu3.vercel.app/',
    featured: false,
  },
];

export const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'ai', label: 'AI & Machine Learning' },
  { id: 'platform', label: 'Data & Research Platforms' },
  { id: 'web', label: 'Web Applications' },
];
