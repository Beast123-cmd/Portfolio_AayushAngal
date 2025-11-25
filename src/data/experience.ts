export interface TimelineItem {
  id: string;
  type: 'education' | 'experience';
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string[];
  icon?: string;
}

export const timeline: TimelineItem[] = [
  {
    id: 'edu-1',
    type: 'education',
    title: 'Bachelor of Technology in Computer Science',
    organization: 'University Name',
    location: 'City, Country',
    period: '2020 - 2024',
    description: [
      'Specialized in Machine Learning and Data Science',
      'Completed coursework in Deep Learning, NLP, and Computer Vision',
      'Final year project on AI-powered recommendation systems',
    ],
  },
  {
    id: 'exp-1',
    type: 'experience',
    title: 'ML Engineer Intern',
    organization: 'Tech Company',
    location: 'Remote',
    period: '2023 - Present',
    description: [
      'Developed machine learning models for e-commerce applications',
      'Implemented data pipelines and feature engineering workflows',
      'Collaborated with cross-functional teams on AI integration',
    ],
  },
  {
    id: 'exp-2',
    type: 'experience',
    title: 'Full-Stack Developer',
    organization: 'Startup',
    location: 'City, Country',
    period: '2022 - 2023',
    description: [
      'Built responsive web applications using React and Node.js',
      'Designed and implemented RESTful APIs',
      'Optimized application performance and user experience',
    ],
  },
];
