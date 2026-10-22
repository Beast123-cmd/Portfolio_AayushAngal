import { motion } from 'framer-motion';
import { BrainCircuit, Blocks, ShieldCheck } from 'lucide-react';

const focusAreas = [
  {
    icon: BrainCircuit,
    title: 'Applied AI',
    description: 'Agent workflows, LLM applications, retrieval-augmented generation, and citation-backed answers.',
  },
  {
    icon: Blocks,
    title: 'Backend & integrations',
    description: 'APIs, OData, MCP integrations, application context, and data validation.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliable software',
    description: 'Human confirmation for sensitive operations, automated tests, and clear failure handling.',
  },
];

export const FocusAreas = () => (
  <div className="space-y-4">
    <h3 className="text-2xl font-bold text-center lg:text-left">
      My <span className="text-gradient">Focus Areas</span>
    </h3>
    {focusAreas.map((area, index) => {
      const Icon = area.icon;
      return (
        <motion.div
          key={area.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
          viewport={{ once: true }}
          className="glass-card flex items-start gap-4 rounded-xl border border-border/50 p-4"
        >
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{area.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{area.description}</p>
          </div>
        </motion.div>
      );
    })}
  </div>
);
