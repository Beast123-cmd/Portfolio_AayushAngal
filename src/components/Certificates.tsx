import { motion } from 'framer-motion';
import { Award, ExternalLink, Trophy, Medal, Star } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  category: 'certificate' | 'achievement';
  description: string;
  link?: string;
  icon: 'award' | 'trophy' | 'medal' | 'star';
  color: string;
}

const certificates: Certificate[] = [
  {
    id: 'machine-learning-2024',
    title: 'Machine Learning Course (2024)',
    category: 'certificate',
    description: 'Course certification in machine learning.',
    link: 'https://drive.google.com/file/d/140-iZm2aDWPmZZWMkoft3s3QsUxdqEli/view?usp=sharing',
    icon: 'star',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'python-advanced',
    title: 'Python: From Scratch to Advanced',
    category: 'certificate',
    description: 'Python programming certification, completed with a score of 95%.',
    link: 'https://drive.google.com/file/d/1TEqzq73g73rcmnliwmd7FSLze85Mmqbv/view?usp=sharing',
    icon: 'medal',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'hacxlerate-runner-up',
    title: 'HacXLerate AI/Tech Competition — 1st Runner-Up',
    category: 'achievement',
    description: '1st runner-up at the HacXLerate AI/Tech competition.',
    icon: 'trophy',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'odoo-finalist',
    title: 'Odoo Hackathon — Finalist',
    category: 'achievement',
    description: 'Finalist in the Odoo Hackathon.',
    icon: 'award',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'ignisia-finalist',
    title: 'Ignisia AI Hackathon — Finalist',
    category: 'achievement',
    description: 'Finalist in the Ignisia AI Hackathon.',
    icon: 'star',
    color: 'from-fuchsia-500 to-violet-500',
  },
];

const iconMap = {
  award: Award,
  trophy: Trophy,
  medal: Medal,
  star: Star,
};

const CertificateCard = ({ cert, index }: { cert: Certificate; index: number }) => {
  const IconComponent = iconMap[cert.icon];
  const cardContent = (
    <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 h-full transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10">
      <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      <div className={`relative z-10 flex items-start gap-4 ${cert.link ? 'pr-7' : ''}`}>
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${cert.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
          <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {cert.title}
          </h3>
          <p className="text-sm text-muted-foreground">{cert.description}</p>
        </div>
      </div>
      {cert.link && (
        <ExternalLink className="absolute top-6 right-6 w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );

  const motionProps = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: index * 0.1 },
    viewport: { once: true },
    className: 'group relative block h-full',
  };

  return cert.link ? (
    <motion.a href={cert.link} target="_blank" rel="noopener noreferrer" {...motionProps}>
      {cardContent}
    </motion.a>
  ) : (
    <motion.div {...motionProps}>{cardContent}</motion.div>
  );
};

export const Certificates = () => {
  const certsList = certificates.filter((certificate) => certificate.category === 'certificate');
  const achievementsList = certificates.filter((certificate) => certificate.category === 'achievement');

  return (
    <section id="certificates" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Certifications & <span className="text-gradient">Recognition</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Selected coursework and hackathon results
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Certifications</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
            </div>
            <div className="space-y-4">
              {certsList.map((certificate, index) => (
                <CertificateCard key={certificate.id} cert={certificate} index={index} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Achievements</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-amber-500/50 to-transparent" />
            </div>
            <div className="space-y-4">
              {achievementsList.map((certificate, index) => (
                <CertificateCard key={certificate.id} cert={certificate} index={index} />
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          Always learning, building, and taking on new challenges.
        </p>
      </div>
    </section>
  );
};
