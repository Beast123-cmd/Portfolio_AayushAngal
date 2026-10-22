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
      'project-researchsync': new URL('@/assets/project-spotify.jpg', import.meta.url).href,
      'project-kaggle': new URL('@/assets/project-kaggle.jpg', import.meta.url).href,
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
      className="h-full"
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
        className="project-electric-card h-full"
      >
        <div className="bg-card rounded-2xl overflow-hidden group flex h-full flex-col">
          <div className="relative overflow-hidden h-48">
            <motion.img
              src={getImageSrc(project.image)}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="p-6 flex flex-1 flex-col">
            <h3 className="text-2xl font-bold mb-2 min-h-[3.5rem] text-foreground">{project.title}</h3>
            <p className="text-muted-foreground mb-4 min-h-[4.5rem] line-clamp-3">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-primary/30 text-primary">
                  {tag}
                </Badge>
              ))}
            </div>
            {(project.github || project.demo) && (
              <div className="flex flex-wrap gap-3 mt-auto pt-6">
                {project.github && (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={project.githubVisibility === 'private'
                        ? `Open private GitHub repository for ${project.title}; access is required`
                        : `View source code for ${project.title} on GitHub`}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      {project.githubVisibility === 'private' ? 'Private source' : 'Source code'}
                    </a>
                  </Button>
                )}
                {project.demo && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live demo
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </ElectricBorder>
    </motion.div>
  );
};
