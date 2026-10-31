export interface RecognitionItem {
  id: string;
  title: string;
  category: "certificate" | "achievement";
  description: string;
  link?: string;
}

export const recognition: RecognitionItem[] = [
  {
    id: "machine-learning-2024",
    title: "Machine Learning Course (2024)",
    category: "certificate",
    description: "Course certification in machine learning.",
    link: "https://drive.google.com/file/d/140-iZm2aDWPmZZWMkoft3s3QsUxdqEli/view?usp=sharing",
  },
  {
    id: "python-advanced",
    title: "Python: From Scratch to Advanced",
    category: "certificate",
    description: "Python programming certification, completed with a score of 95%.",
    link: "https://drive.google.com/file/d/1TEqzq73g73rcmnliwmd7FSLze85Mmqbv/view?usp=sharing",
  },
  {
    id: "hacxlerate-runner-up",
    title: "HacXLerate AI/Tech Competition — 1st Runner-Up",
    category: "achievement",
    description: "1st runner-up at the HacXLerate AI/Tech competition.",
  },
  {
    id: "odoo-finalist",
    title: "Odoo Hackathon — Finalist",
    category: "achievement",
    description: "Finalist in the Odoo Hackathon.",
  },
  {
    id: "ignisia-finalist",
    title: "Ignisia AI Hackathon — Finalist",
    category: "achievement",
    description: "Finalist in the Ignisia AI Hackathon.",
  },
];
