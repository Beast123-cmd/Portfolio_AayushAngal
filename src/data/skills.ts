export interface Skill {
  name: string;
  level: number;
  category: string;
}

export const skills: Skill[] = [
  { name: 'Python', level: 90, category: 'Programming' },
  { name: 'Machine Learning', level: 85, category: 'AI/ML' },
  { name: 'React', level: 80, category: 'Frontend' },
  { name: 'C++', level: 75, category: 'Programming' },
  { name: 'Data Science', level: 85, category: 'AI/ML' },
  { name: 'SQL', level: 80, category: 'Database' },
  { name: 'HTML/CSS', level: 75, category: 'Frontend' },
  { name: 'Git/GitHub', level: 85, category: 'Tools' },
  { name: 'JavaScript', level: 80, category: 'Frontend' },
];

export const skillCategories = [
  {
    title: 'AI & Machine Learning',
    items: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision'],
  },
  {
    title: 'Web Development',
    items: ['React', 'TypeScript', 'HTML/CSS'],
  },
  {
    title: 'Data Science',
    items: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'SQL', 'Data Analysis'],
  },
  {
    title: 'Tools & Version Control',
    items: ['Git', 'GitHub', 'VS Code', 'Docker'],
  },
];
