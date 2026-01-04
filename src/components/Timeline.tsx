import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, Download } from 'lucide-react';
import { TimelineItem as TimelineItemType } from '@/data/experience';

interface TimelineProps {
  items: TimelineItemType[];
}

export const Timeline = ({ items }: TimelineProps) => {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-border" />

      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className={`relative mb-12 ${
            index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
          }`}
        >
          <div className={`flex items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            <Card className={`glass-card p-6 hover-lift ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'} w-full md:w-5/12`}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  {item.type === 'education' ? (
                    <GraduationCap className="h-6 w-6 text-primary" />
                  ) : (
                    <Briefcase className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-primary font-semibold mb-1">{item.organization}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.location} • {item.period}
                  </p>
                  <ul className="space-y-2">
                    {item.description.map((desc, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-primary mr-2">▪</span>
                        {desc}
                      </li>
                    ))}
                  </ul>
                  {item.certificateUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = item.certificateUrl!;
                        link.download = `${item.organization}_Certificate.pdf`;
                        link.click();
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Timeline Dot */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
