import { motion } from 'framer-motion';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"
        >
          <div>
            <p className="font-medium text-foreground">Aayush Angal</p>
            <p className="text-sm text-muted-foreground">AI/ML Intern at Prorigo · PICT ’27</p>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-sm text-muted-foreground">
            <a className="hover:text-primary transition-colors" href="mailto:angalaayush646@gmail.com">Email</a>
            <a className="hover:text-primary transition-colors" href="https://linkedin.com/in/aayushangal" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="hover:text-primary transition-colors" href="/resume.pdf" download="Aayush_Angal_Resume.pdf">Resume</a>
          </div>
          <p className="text-sm text-muted-foreground">© {currentYear} Aayush Angal</p>
        </motion.div>
      </div>
    </footer>
  );
};
