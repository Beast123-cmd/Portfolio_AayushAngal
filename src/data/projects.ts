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
    title: 'SEEKR AI',
    description: 'An intelligent e-commerce AI agent that provides personalized product recommendations using machine learning algorithms and natural language processing.',
    image: 'project-seekr',
    tags: ['Python', 'Machine Learning', 'NLP', 'FastAPI', 'TensorFlow'],
    category: 'ml',
    github: 'https://github.com/aayushangal',
    demo: 'https://seekr-ai.demo',
    featured: true,
  },
  {
    id: 'alcohol-brake',
    title: 'Alcohol-Based Braking System',
    description: 'Hardware prototype using Arduino and MQ-3 alcohol sensor to detect driver intoxication and automatically engage emergency braking system.',
    image: 'project-arduino',
    tags: ['Arduino', 'C++', 'MQ-3 Sensor', 'Hardware', 'IoT'],
    category: 'hardware',
    github: 'https://github.com/aayushangal',
    featured: true,
  },
  {
    id: 'spotify-clone',
    title: 'Spotify Web Clone',
    description: 'A fully responsive music streaming web application clone built with modern web technologies, featuring playlist management and audio playback.',
    image: 'project-spotify',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Web Audio API'],
    category: 'web',
    github: 'https://github.com/aayushangal',
    demo: 'https://spotify-clone.demo',
    featured: false,
  },
  {
    id: 'kaggle-ds',
    title: 'Kaggle Data Science Project',
    description: 'Comprehensive exploratory data analysis and machine learning pipeline for predictive modeling on structured datasets with feature engineering.',
    image: 'project-kaggle',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'Data Visualization', 'EDA'],
    category: 'data',
    github: 'https://github.com/aayushangal',
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
