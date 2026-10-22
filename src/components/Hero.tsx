import { motion } from 'framer-motion';
import { ArrowUpRight, Download } from 'lucide-react';
import TextType from './TextType';
import { Button } from '@/components/ui/button';
import { HeroTerminal } from './HeroTerminal';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient with subtle pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-4"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Welcome to my portfolio
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4">
                <span className="text-foreground block">Hi, I'm</span>
                <TextType 
                  text={["Aayush Angal"]}
                  typingSpeed={150}
                  pauseDuration={3000}
                  deletingSpeed={80}
                  showCursor={true}
                  cursorCharacter="|"
                  loop={true}
                  className="text-gradient block"
                />
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-6"
            >
              <span className="font-medium">AI/ML Intern</span>
              <span className="text-primary mx-2">•</span>
              <span className="font-medium">Backend & AI Systems</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-base sm:text-lg text-muted-foreground/80 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              PICT Electronics and Telecommunication undergraduate and AI/ML Intern at Prorigo. I build enterprise AI workflows,
              backend integrations, and data-driven products with a focus on reliable, explainable software.
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 lg:justify-start"
            >
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:shadow-glow" asChild>
                <a href="/resume.pdf" download="Aayush_Angal_Resume.pdf" aria-label="Download Aayush Angal's current resume">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </a>
              </Button>
              <button
                onClick={() => navigate('/terminal/')}
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <span className="text-sm font-medium">Open Terminal</span>
                <motion.div
                  animate={{ x: [0, 3, 0], y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </motion.div>
              </button>
            </motion.div>
          </motion.div>

          {/* Interactive command line portfolio explorer */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative order-1 lg:order-2 flex min-h-[350px] items-center sm:min-h-[400px] lg:min-h-[550px]"
          >
            <HeroTerminal />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  );
};
