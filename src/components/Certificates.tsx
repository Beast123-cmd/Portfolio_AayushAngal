import { motion } from 'framer-motion';
import { Award, ExternalLink, Trophy, Medal, Star } from 'lucide-react';

interface Certificate {
  id: number;
  title: string;
  category: 'certificate' | 'achievement';
  description: string;
  link: string;
  icon: 'award' | 'trophy' | 'medal' | 'star';
  color: string;
}

const certificates: Certificate[] = [
  {
    id: 1,
    title: "Web Development",
    category: "certificate",
    description: "Comprehensive certification in modern web development technologies and best practices",
    link: "https://drive.google.com/file/d/1daKJmzOuaJTFXnP8TdNCLS8bVHQ0EC-j/view?usp=sharing",
    icon: "award",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Python from Scratch",
    category: "certificate",
    description: "Complete Python programming certification covering fundamentals to advanced concepts",
    link: "https://drive.google.com/file/d/1TEqzq73g73rcmnliwmd7FSLze85Mmqbv/view?usp=sharing",
    icon: "medal",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 3,
    title: "Machine Learning",
    category: "certificate",
    description: "Professional certification in machine learning algorithms and practical implementations",
    link: "https://drive.google.com/file/d/140-iZm2aDWPmZZWMkoft3s3QsUxdqEli/view?usp=sharing",
    icon: "star",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 4,
    title: "ByteXL Hackathon Runner-Up",
    category: "achievement",
    description: "Runner-up at ByteXL Hackathon, Hyderabad. Developed SEEKR AI — an AI-driven web navigator and e-commerce comparison platform using local LLMs for natural language processing and automated web extraction for real-time product insights.",
    link: "https://drive.google.com/file/d/1dygnIBOLfXWOuSZ7Au9m7SpJE97tBAzb/view?usp=sharing",
    icon: "trophy",
    color: "from-amber-500 to-orange-500"
  }
];

const iconMap = {
  award: Award,
  trophy: Trophy,
  medal: Medal,
  star: Star
};

const CertificateCard = ({ cert, index }: { cert: Certificate; index: number }) => {
  const IconComponent = iconMap[cert.icon];
  
  return (
    <motion.a
      href={cert.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative block"
    >
      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 h-full transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        {/* Gradient background on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {/* Floating particles effect */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r ${cert.color} animate-pulse`} />
          <div className={`absolute top-8 right-12 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${cert.color} animate-pulse delay-100`} />
          <div className={`absolute top-12 right-6 w-1 h-1 rounded-full bg-gradient-to-r ${cert.color} animate-pulse delay-200`} />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${cert.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
            <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          {/* Text content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
              {cert.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {cert.description}
            </p>
          </div>
          
          {/* External link icon */}
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <ExternalLink className="w-5 h-5 text-primary" />
          </div>
        </div>
        
        {/* Bottom shine effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.a>
  );
};

export const Certificates = () => {
  const certsList = certificates.filter(c => c.category === 'certificate');
  const achievementsList = certificates.filter(c => c.category === 'achievement');

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
            Certificates & <span className="text-gradient">Achievements</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Recognition of my skills and accomplishments
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left Column - Certificates */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Certificates</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
            </motion.div>
            
            <div className="space-y-4">
              {certsList.map((cert, index) => (
                <CertificateCard key={cert.id} cert={cert} index={index} />
              ))}
            </div>
          </div>

          {/* Right Column - Achievements */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Achievements</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-amber-500/50 to-transparent" />
            </motion.div>
            
            <div className="space-y-4">
              {achievementsList.map((cert, index) => (
                <CertificateCard key={cert.id} cert={cert} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="relative mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm">
              <div className="flex -space-x-1">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
              </div>
              <span className="text-sm text-muted-foreground">
                Continuously learning and growing
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
