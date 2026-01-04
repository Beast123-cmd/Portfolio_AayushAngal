import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Timeline } from './Timeline';
import { timeline } from '@/data/experience';

export const Resume = () => {
  const handleDownloadResume = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/resume/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download resume');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Aayush_Angal_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Resume download error:', error);
      alert('Failed to download resume. Please try again later.');
    }
  };

  return (
    <section id="resume" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Experience & <span className="text-gradient">Education</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            My professional journey and academic background
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-primary text-primary-foreground hover:shadow-glow"
            onClick={handleDownloadResume}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Full Resume
          </Button>
        </motion.div>

        <Timeline items={timeline} />
      </div>
    </section>
  );
};
