export interface Skill {
  name: string;
  level: number;
  category: string;
}

export const skills: Skill[] = [
  { name: 'Python', level: 90, category: 'Programming' },
  { name: 'Machine Learning', level: 85, category: 'AI/ML' },
  { name: 'React', level: 80, category: 'Frontend' },
  { name: 'Node.js', level: 75, category: 'Backend' },
  { name: 'Data Science', level: 85, category: 'AI/ML' },
  { name: 'Arduino', level: 70, category: 'Hardware' },
  { name: 'Signal Processing', level: 75, category: 'AI/ML' },
  { name: 'Tailwind CSS', level: 85, category: 'Frontend' },
];

export const skillCategories = [
  {
    title: 'AI & Machine Learning',
    items: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision'],
  },
  {
    title: 'Web Development',
    items: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    title: 'Data Science',
    items: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'SQL', 'Data Analysis'],
  },
  {
    title: 'Hardware & IoT',
    items: ['Arduino', 'Raspberry Pi', 'Sensors', 'Circuit Design', 'Embedded Systems'],
  },
];
