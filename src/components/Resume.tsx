import { motion } from 'framer-motion';
import { BriefcaseBusiness, CalendarDays, Download, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Timeline } from './Timeline';
import { timeline } from '@/data/experience';

const experienceItems = timeline.filter((item) => item.type === 'experience');

export const Resume = () => {
  return (
    <section id="experience" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Professional roles and the work I've contributed to
          </p>
          <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:shadow-glow" asChild>
            <a href="/resume.pdf" download="Aayush_Angal_Resume.pdf">
              <Download className="mr-2 h-4 w-4" />
              Download Full Resume
            </a>
          </Button>
        </motion.div>

        <div className="mx-auto max-w-5xl space-y-6">
          {experienceItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card overflow-hidden">
                <div className="grid lg:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.8fr)]">
                  <div className="border-b border-border/60 bg-primary/5 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <BriefcaseBusiness className="h-6 w-6" />
                    </div>
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1.5 text-sm font-medium text-primary">
                      <CalendarDays className="h-4 w-4" />
                      {item.period}
                    </p>
                    <h3 className="mb-2 text-2xl font-bold text-foreground">{item.title}</h3>
                    <p className="mb-3 text-lg font-semibold text-primary">{item.organization}</p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {item.location}
                    </p>
                  </div>
                  <div className="p-6 sm:p-8">
                    <h4 className="mb-5 text-lg font-semibold">Key contributions</h4>
                    <ul className="space-y-4">
                      {item.description.map((description) => (
                        <li key={description} className="flex items-start gap-3 text-muted-foreground">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          <span>{description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Education = () => (
  <section id="education" className="py-20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="text-gradient">Education</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Academic background and qualifications
        </p>
      </motion.div>
      <Timeline items={timeline.filter((item) => item.type === 'education')} />
    </div>
  </section>
);
