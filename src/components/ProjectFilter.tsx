import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/projects';

interface ProjectFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const ProjectFilter = ({ activeFilter, onFilterChange }: ProjectFilterProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex flex-wrap justify-center gap-3 mb-12"
    >
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeFilter === category.id ? 'default' : 'outline'}
          onClick={() => onFilterChange(category.id)}
          className={
            activeFilter === category.id
              ? 'bg-gradient-primary text-primary-foreground'
              : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
          }
        >
          {category.label}
        </Button>
      ))}
    </motion.div>
  );
};
