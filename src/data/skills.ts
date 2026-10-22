export interface Skill {
  name: string;
  level: number;
  category: string;
}

export const skills: Skill[] = [
  { name: 'Python', level: 90, category: 'Programming' },
  { name: 'C++', level: 80, category: 'Programming' },
  { name: 'FastAPI', level: 85, category: 'Backend' },
  { name: 'PostgreSQL', level: 80, category: 'Database' },
  { name: 'AI Agents', level: 85, category: 'AI/ML' },
  { name: 'RAG', level: 85, category: 'AI/ML' },
  { name: 'LangGraph', level: 80, category: 'AI/ML' },
  { name: 'React', level: 75, category: 'Frontend' },
  { name: 'Git/GitHub', level: 85, category: 'Tools' },
];

export const skillCategories = [
  {
    title: 'AI & Machine Learning',
    items: ['Python', 'LLMs', 'RAG', 'AI Agents', 'LangChain', 'LangGraph', 'Qdrant'],
  },
  {
    title: 'Backend & APIs',
    items: ['FastAPI', 'REST APIs', 'OData', 'WebSockets'],
  },
  {
    title: 'Databases & Core CS',
    items: ['PostgreSQL', 'SQL', 'Data Structures & Algorithms', 'OOP', 'DBMS'],
  },
  {
    title: 'Tools & Practices',
    items: ['Git', 'GitHub', 'Azure DevOps', 'PyTest', 'Agile'],
  },
];
