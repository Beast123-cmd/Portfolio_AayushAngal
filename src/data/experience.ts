export interface TimelineItem {
  id: string;
  type: 'education' | 'experience';
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string[];
  icon?: string;
  certificateUrl?: string;
}

export const timeline: TimelineItem[] = [
  {
    id: 'edu-1',
    type: 'education',
    title: 'Bachelor of Engineering (B.E.) in Electronics & Telecommunication',
    organization: 'Pune Institute of Computer Technology (PICT)',
    location: 'Pune, Maharashtra',
    period: '2023 - 2027 (Pursuing)',
    description: [
      'CGPA: 9.75 (Top 5% of the cohort)',
      'Coursework emphasizes computer science, AI, machine learning, data analysis, and communication systems',
      'Actively applying theoretical knowledge to real-world projects in AI, ML, and full-stack development',
      'Maintained exceptional academic record with consistent excellence and strong problem-solving abilities',
    ],
  },
  {
    id: 'edu-2',
    type: 'education',
    title: 'Higher Secondary Certificate (HSC) | Science',
    organization: 'St. Xavier\'s School and Junior College',
    location: 'Pune, Maharashtra',
    period: '2021 - 2023',
    description: [
      'Percentage: 85.67% (Top 10%)',
      'Specialized in Science with focus on mathematics, physics, and core scientific principles',
      'Developed solid foundation for advanced engineering and technical studies',
      'Demonstrated academic consistency and analytical thinking',
    ],
    certificateUrl: '/hsc_certificate.pdf',
  },
  {
    id: 'edu-3',
    type: 'education',
    title: 'Secondary School Certificate (SSC)',
    organization: 'Samarth Ramdas Vidyalaya',
    location: 'Pune, Maharashtra',
    period: '2021',
    description: [
      'Percentage: 89.80%',
      'Completed secondary education with distinction',
      'Developed disciplined study habits and problem-solving skills',
      'Built early interest in technology and engineering',
    ],
    certificateUrl: '/ssc_certificate.pdf',
  },
];
