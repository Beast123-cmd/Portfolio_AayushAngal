export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: 'ml' | 'web' | 'hardware' | 'data';
  github?: string;
  demo?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 'seekr-ai',
    title: 'SEEKR AI – Web Navigator Agent',
    description: 'An AI-powered e-commerce aggregation platform that compares products across major online marketplaces. Uses local LLMs for natural language query processing and an automated multi-stage data extraction pipeline with Playwright. Provides real-time product comparison via an interactive React dashboard while significantly reducing API cost and improving response speed.',
    image: 'project-seekr',
    tags: ['Python', 'LLM', 'Playwright', 'React', 'NLP', 'Web Scraping'],
    category: 'ml',
    github: 'https://github.com/beutkarshh/AI_WEB_NAV',
    featured: true,
  },
  {
    id: 'meds-ai',
    title: 'MEDS-AI: Multi-Agent Medical Diagnosis System',
    description: 'An intelligent healthcare decision-support system built using multiple specialized AI agents for symptom analysis, research retrieval, case evaluation, and treatment recommendations. Integrates major medical research APIs and delivers accurate, easy-to-understand diagnostic summaries, reducing diagnosis time and improving information clarity.',
    image: 'project-meds-ai',
    tags: ['Python', 'Multi-Agent AI', 'LangChain', 'Medical APIs', 'NLP'],
    category: 'ml',
    github: 'https://github.com/Beast123-cmd',
    featured: true,
  },
  {
    id: 'chatpdf',
    title: 'ChatPDF – AI Document Intelligence System',
    description: 'An AI-based document understanding platform that allows users to upload PDFs and interact with them through natural language queries. Implements text extraction, semantic search, and contextual response generation using NLP and LLMs, enabling fast document comprehension for research, study, and business use cases.',
    image: 'project-chatpdf',
    tags: ['Python', 'LLM', 'RAG', 'Vector Database', 'NLP', 'Streamlit'],
    category: 'ml',
    github: 'https://github.com/ruchir07/chatpdf',
    featured: true,
  },
  {
    id: 'globetrotter',
    title: 'GlobeTrotter — Personalized Travel Planning Platform',
    description: 'A full-stack travel planning system that enables users to plan, organize, and visualize multi-city trips with structured itineraries and realistic budgeting. Built for Odoo Hackathon with a clean professional UI and highly normalized MySQL database. Includes budget analytics, timeline views, community sharing, and admin insights for scalability.',
    image: 'project-globetrotter',
    tags: ['React', 'Node.js', 'MySQL', 'Full-Stack', 'Hackathon'],
    category: 'web',
    github: 'https://github.com/beutkarshh/Odoo-X-SIT-Coimbatore',
    featured: true,
  },
  {
    id: 'alcohol-brake',
    title: 'Alcohol-Based Driver Detection & Braking System',
    description: 'A hardware-based safety system using alcohol sensors and microcontrollers to detect driver intoxication and automatically restrict vehicle movement. The system integrates real-time sensor monitoring, decision logic, and motor control to prevent unsafe driving, demonstrating applied embedded systems and IoT engineering.',
    image: 'project-arduino',
    tags: ['Arduino', 'C++', 'MQ-3 Sensor', 'IoT', 'Embedded Systems'],
    category: 'hardware',
    github: 'https://github.com/Beast123-cmd',
    featured: false,
  },
  {
    id: 'library-management',
    title: 'Library Management System',
    description: 'A secure full-stack web application with role-based authentication for managing library operations. Supports real-time book availability tracking, transaction management, password-hashed login, and optimized database operations, designed for reliable multi-user performance.',
    image: 'project-library',
    tags: ['HTML', 'CSS', 'JavaScript', 'Flask', 'SQLite3', 'Authentication'],
    category: 'web',
    github: 'https://github.com/Beast123-cmd/Library-Management-System',
    featured: false,
  },
  {
    id: 'house-price-predictor',
    title: 'House Price Predictor',
    description: 'A machine learning model that predicts house prices based on various features using regression techniques. Implements data preprocessing, feature engineering, and model evaluation to provide accurate price estimates for real estate analysis.',
    image: 'project-housing',
    tags: ['Python', 'Scikit-learn', 'Pandas', 'Regression', 'Data Science'],
    category: 'data',
    github: 'https://github.com/Beast123-cmd/House-price-predictor',
    featured: false,
  },
];

export const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'ml', label: 'Machine Learning' },
  { id: 'web', label: 'Web Development' },
  { id: 'hardware', label: 'Hardware' },
  { id: 'data', label: 'Data Science' },
];
