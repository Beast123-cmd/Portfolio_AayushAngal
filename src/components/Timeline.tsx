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
      <div className="absolute left-3 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />

      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="relative mb-12 w-full"
        >
          <div>
            <Card className={`glass-card ml-9 w-[calc(100%-2.25rem)] p-6 hover-lift md:ml-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
              <div className="flex items-start gap-4 text-left">
                <div className="shrink-0 rounded-lg bg-primary/10 p-3">
                  {item.type === 'education' ? (
                    <GraduationCap className="h-6 w-6 text-primary" />
                  ) : (
                    <Briefcase className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-lg font-bold leading-snug sm:text-xl">{item.title}</h3>
                  <p className="mb-1 leading-snug text-primary font-semibold">{item.organization}</p>
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    {item.location} • {item.period}
                  </p>
                  <ul className="space-y-2 text-left">
                    {item.description.map((desc, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-0.5 shrink-0 text-primary" aria-hidden="true">▪</span>
                        <span>{desc}</span>
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
            <div className="absolute left-1 top-6 h-4 w-4 rounded-full border-4 border-background bg-primary md:left-1/2 md:-translate-x-1/2" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
