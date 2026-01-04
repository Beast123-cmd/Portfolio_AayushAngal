import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/data/projects';
import ElectricBorder from './ElectricBorder';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const getImageSrc = (imageName: string) => {
    const images: Record<string, string> = {
      'project-seekr': new URL('@/assets/project-seekr.jpg', import.meta.url).href,
      'project-meds-ai': new URL('@/assets/project-meds-ai.jpg', import.meta.url).href,
      'project-chatpdf': new URL('@/assets/project-chatpdf.jpg', import.meta.url).href,
      'project-globetrotter': new URL('@/assets/project-globetrotter.jpg', import.meta.url).href,
      'project-arduino': new URL('@/assets/project-arduino.jpg', import.meta.url).href,
      'project-library': new URL('@/assets/project-library.jpg', import.meta.url).href,
      'project-housing': new URL('@/assets/project-housing.jpg', import.meta.url).href,
    };
    return images[imageName] || '';
  };

  // Use primary color from design system
  const electricColor = 'hsl(189, 94%, 43%)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <ElectricBorder
        color={electricColor}
        speed={0.8}
        chaos={0.15}
        thickness={1.5}
        borderRadius={16}
        className="project-electric-card"
      >
        <div className="bg-card rounded-2xl overflow-hidden group">
          <div className="relative overflow-hidden h-48">
            <motion.img
              src={getImageSrc(project.image)}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="flex gap-2">
                {project.github && (
                  <Button size="sm" variant="secondary" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {project.demo && (
                  <Button size="sm" variant="secondary" asChild>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-2 text-foreground">{project.title}</h3>
            <p className="text-muted-foreground mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-primary/30 text-primary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </ElectricBorder>
    </motion.div>
  );
};
