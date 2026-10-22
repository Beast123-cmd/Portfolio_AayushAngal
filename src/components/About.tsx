import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { FocusAreas } from './FocusAreas';
import { skillCategories } from '@/data/skills';
import avatar from '@/assets/avatar.jpg';
import LogoLoop from './LogoLoop';
import {
  SiCplusplus,
  SiFastapi,
  SiGithub,
  SiLangchain,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiReact,
} from 'react-icons/si';

const techLogos = [
  { node: <SiPython />, title: "Python", href: "https://python.org" },
  { node: <SiCplusplus />, title: "C++", href: "https://isocpp.org" },
  { node: <SiFastapi />, title: "FastAPI", href: "https://fastapi.tiangolo.com" },
  { node: <SiPostgresql />, title: "PostgreSQL", href: "https://postgresql.org" },
  { node: <span className="text-lg font-semibold">Qdrant</span>, title: "Qdrant", href: "https://qdrant.tech" },
  { node: <SiLangchain />, title: "LangChain", href: "https://langchain.com" },
  { node: <span className="text-lg font-semibold">LangGraph</span>, title: "LangGraph", href: "https://langchain-ai.github.io/langgraph/" },
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiGithub />, title: "GitHub", href: "https://github.com" },
  { node: <span className="text-lg font-semibold">Azure DevOps</span>, title: "Azure DevOps", href: "https://azure.microsoft.com/products/devops" },
  { node: <span className="text-lg font-semibold">PyTest</span>, title: "PyTest", href: "https://pytest.org" },
  { node: <span className="text-lg font-semibold">OData</span>, title: "OData", href: "https://www.odata.org" },
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
            I build context-aware AI tools and backend systems for real-world workflows.
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
              I'm an Electronics and Telecommunication undergraduate at PICT with industry experience in enterprise software,
              backend development, and AI-driven workflows.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At Prorigo, I work on AI agents and integrations for enterprise applications. My projects also explore clinical
              assessment, research publication workflows, and explainable student-success analytics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <FocusAreas />
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
