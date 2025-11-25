import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const getImageSrc = (imageName: string) => {
    const images: Record<string, string> = {
      'project-seekr': new URL('@/assets/project-seekr.jpg', import.meta.url).href,
      'project-arduino': new URL('@/assets/project-arduino.jpg', import.meta.url).href,
      'project-spotify': new URL('@/assets/project-spotify.jpg', import.meta.url).href,
      'project-kaggle': new URL('@/assets/project-kaggle.jpg', import.meta.url).href,
    };
    return images[imageName] || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="glass-card overflow-hidden hover-lift group">
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
          {project.featured && (
            <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">
              Featured
            </Badge>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
