import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AnimatedSkillsChart } from './AnimatedSkillsChart';
import { skillCategories } from '@/data/skills';
import avatar from '@/assets/avatar.jpg';
import LogoLoop from './LogoLoop';
import { 
  SiReact, 
  SiTypescript, 
  SiPython, 
  SiTensorflow, 
  SiPytorch, 
  SiNextdotjs, 
  SiTailwindcss, 
  SiMongodb, 
  SiNodedotjs, 
  SiGit, 
  SiDocker, 
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiMysql,
  SiPostgresql,
  SiAmazon,
  SiFigma,
  SiOpenai,
  SiArduino
} from 'react-icons/si';

const techLogos = [
  { node: <SiPython />, title: "Python", href: "https://python.org" },
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTensorflow />, title: "TensorFlow", href: "https://tensorflow.org" },
  { node: <SiPytorch />, title: "PyTorch", href: "https://pytorch.org" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiMongodb />, title: "MongoDB", href: "https://mongodb.com" },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiGit />, title: "Git", href: "https://git-scm.com" },
  { node: <SiDocker />, title: "Docker", href: "https://docker.com" },
  { node: <SiJavascript />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { node: <SiHtml5 />, title: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { node: <SiCss3 />, title: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { node: <SiMysql />, title: "MySQL", href: "https://mysql.com" },
  { node: <SiPostgresql />, title: "PostgreSQL", href: "https://postgresql.org" },
  { node: <SiAmazon />, title: "AWS", href: "https://aws.amazon.com" },
  { node: <SiFigma />, title: "Figma", href: "https://figma.com" },
  { node: <SiOpenai />, title: "OpenAI", href: "https://openai.com" },
  { node: <SiArduino />, title: "Arduino", href: "https://arduino.cc" },
];

export const About = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate about building intelligent systems and elegant web experiences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center lg:justify-start mb-8">
              <motion.img
                src={avatar}
                alt="Aayush Angal"
                className="w-48 h-48 rounded-full object-cover border-4 border-primary shadow-glow"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              I'm a Machine Learning Engineer and Frontend Developer with a passion for creating innovative solutions 
              that bridge the gap between artificial intelligence and user-friendly applications.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              With expertise in Python, React, and hardware prototyping, I bring a multidisciplinary approach to 
              problem-solving. From building AI-powered e-commerce agents to developing safety-critical hardware systems, 
              I thrive on challenges that push the boundaries of technology.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <AnimatedSkillsChart />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Technologies I <span className="text-gradient">Work With</span>
          </h3>
          <div className="relative overflow-hidden py-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30">
            <LogoLoop
              logos={techLogos}
              speed={60}
              direction="left"
              logoHeight={36}
              gap={56}
              hoverSpeed={15}
              scaleOnHover
              fadeOut
              ariaLabel="Technologies and tools I use"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card p-6 hover-lift">
                <h3 className="text-xl font-semibold mb-4 text-gradient">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item} className="text-muted-foreground flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
