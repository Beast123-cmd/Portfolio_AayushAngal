import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Boxes, Braces, Database, Download } from 'lucide-react';
import TextType from './TextType';
import { Button } from '@/components/ui/button';
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
        <div className="grid min-h-[80vh] items-center gap-10 lg:grid-cols-2 lg:gap-12">
          
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full text-center lg:text-left"
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
              className="text-base sm:text-lg text-muted-foreground/80 mb-10 max-w-xl mx-auto leading-relaxed lg:mx-0"
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

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="relative mx-auto w-full max-w-xl"
            aria-label="Illustration of an AI workflow connecting data, orchestration, and useful outputs"
          >
            <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/75 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:p-7">
              <div className="mb-8 flex items-center justify-between border-b border-border/70 pb-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">Systems in motion</p>
                  <p className="mt-1 text-sm text-muted-foreground">From raw input to reliable outcomes</p>
                </div>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">AI / DATA</span>
              </div>

              <div className="space-y-3">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center gap-4 rounded-2xl border border-border/70 bg-background/60 p-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Database className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1"><p className="font-semibold">Connected data</p><p className="text-sm text-muted-foreground">Documents · APIs · user context</p></div>
                  <span className="font-mono text-xs text-muted-foreground">01</span>
                </motion.div>

                <div className="flex justify-center text-primary/70" aria-hidden="true"><ArrowRight className="h-4 w-4 rotate-90" /></div>

                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  className="flex items-center gap-4 rounded-2xl border border-primary/35 bg-primary/[0.08] p-4 shadow-[0_0_32px_hsl(var(--primary)/0.08)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary"><Boxes className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1"><p className="font-semibold">AI orchestration</p><p className="text-sm text-muted-foreground">Agents · tools · validation</p></div>
                  <span className="font-mono text-xs text-primary">02</span>
                </motion.div>

                <div className="flex justify-center text-primary/70" aria-hidden="true"><ArrowRight className="h-4 w-4 rotate-90" /></div>

                <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-background/60 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Braces className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1"><p className="font-semibold">Useful outcomes</p><p className="text-sm text-muted-foreground">Structured answers · safer actions</p></div>
                  <span className="font-mono text-xs text-muted-foreground">03</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span>DESIGNED FOR REAL WORKFLOWS</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  );
};
