import { FormEvent, useRef, useState } from 'react';
import { ArrowUpRight, ChevronRight, Minus, Square, X } from 'lucide-react';

type TerminalEntry = {
  command: string;
  response: string;
  target?: string;
  download?: boolean;
};

const quickCommands = ['help', 'whoami', 'projects', 'experience'];

const resolveCommand = (rawCommand: string): TerminalEntry => {
  const command = rawCommand.trim().toLowerCase().replace(/\s+/g, ' ');
  const normalized = command.replace(/^(sudo|\$)\s+/, '');

  if (!normalized || normalized === 'clear' || normalized === 'cls') {
    return { command: rawCommand, response: normalized ? 'Terminal cleared.' : 'Type `help` to see what you can explore.' };
  }

  if (['help', 'commands', '?'].includes(normalized)) {
    return { command: rawCommand, response: 'Try: whoami, skills, projects, experience, education, contact, resume, or clear.' };
  }
  if (['whoami', 'about', 'open about'].includes(normalized)) {
    return { command: rawCommand, response: 'Aayush Angal — AI/ML intern building backend systems, enterprise AI workflows, and data-driven products.', target: 'about' };
  }
  if (['skills', 'stack', 'tech'].includes(normalized)) {
    return { command: rawCommand, response: 'Python · TypeScript · React · FastAPI · Node.js · LangGraph · PostgreSQL · C++' };
  }
  if (['projects', 'ls', 'open projects'].includes(normalized)) {
    return { command: rawCommand, response: 'Loading selected projects: Medico.ai, ResearchSync, SEEKR, TaskForge, Library Management, and more.', target: 'projects' };
  }
  if (['experience', 'work', 'open experience'].includes(normalized)) {
    return { command: rawCommand, response: 'Opening current role and work history.', target: 'experience' };
  }
  if (['education', 'open education'].includes(normalized)) {
    return { command: rawCommand, response: 'Opening education details.', target: 'education' };
  }
  if (['contact', 'email', 'open contact'].includes(normalized)) {
    return { command: rawCommand, response: 'Let’s connect — opening the contact section.', target: 'contact' };
  }
  if (['resume', 'cv', 'download resume'].includes(normalized)) {
    return { command: rawCommand, response: 'Your current resume is ready to download.', target: '/resume.pdf', download: true };
  }

  return { command: rawCommand, response: `Command not found: ${rawCommand}. Type 'help' to see available commands.` };
};

export const HeroTerminal = () => {
  const [command, setCommand] = useState('');
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const runCommand = (rawCommand: string) => {
    const entry = resolveCommand(rawCommand);
    if (entry.command.trim().toLowerCase() === 'clear' || entry.command.trim().toLowerCase() === 'cls') {
      setEntries([]);
    } else {
      setEntries((current) => [...current, entry].slice(-4));
    }

    if (entry.target && !entry.download) {
      window.setTimeout(() => document.getElementById(entry.target!)?.scrollIntoView({ behavior: 'smooth' }), 180);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitted = command.trim();
    if (!submitted) return;
    runCommand(submitted);
    setCommand('');
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-primary/25 bg-[#0b1220]/95 text-left shadow-2xl shadow-primary/10 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#06d6a0]" />
        </div>
        <div className="font-mono text-xs text-slate-400 sm:text-sm">aayush@portfolio: ~</div>
        <div className="flex items-center gap-2 text-slate-500" aria-hidden="true">
          <Minus className="h-3.5 w-3.5" />
          <Square className="h-3 w-3" />
          <X className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="min-h-[300px] px-4 py-5 font-mono text-xs leading-relaxed sm:min-h-[360px] sm:px-6 sm:py-6 sm:text-sm">
        <div className="mb-5 space-y-1 text-slate-300">
          <p><span className="text-emerald-400">aayush@portfolio</span><span className="text-slate-500">:</span><span className="text-sky-300">~</span>$ <span className="text-white">./welcome.sh</span></p>
          <p className="text-slate-400">Interactive portfolio terminal <span className="text-emerald-400">[online]</span></p>
          <p className="text-slate-400">Explore my work by entering a command below.</p>
        </div>

        <div className="space-y-3" aria-live="polite" aria-relevant="additions text">
          {entries.map((entry, index) => (
            <div key={`${entry.command}-${index}`} className="space-y-1">
              <p className="break-words"><span className="text-emerald-400">aayush@portfolio</span><span className="text-slate-500">:</span><span className="text-sky-300">~</span>$ <span className="text-white">{entry.command}</span></p>
              <div className="flex items-start justify-between gap-3 text-slate-400">
                <p>{entry.response}</p>
                {entry.target && (
                  <a
                    href={entry.download ? entry.target : `#${entry.target}`}
                    download={entry.download ? 'Aayush_Angal_Resume.pdf' : undefined}
                    aria-label={entry.download ? 'Download resume' : `Go to ${entry.target} section`}
                    className="shrink-0 text-primary transition-colors hover:text-primary/80"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4">
          <label htmlFor="portfolio-command" className="shrink-0 text-emerald-400">
            <span className="sr-only">Enter a portfolio command</span>
            <span aria-hidden="true">$</span>
          </label>
          <input
            ref={inputRef}
            id="portfolio-command"
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            placeholder="type a command..."
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-600 focus-visible:ring-0"
          />
          <button type="submit" aria-label="Run command" className="text-primary transition-transform hover:translate-x-0.5">
            <ChevronRight className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2" aria-label="Suggested commands">
          {quickCommands.map((quickCommand) => (
            <button
              key={quickCommand}
              type="button"
              onClick={() => {
                runCommand(quickCommand);
                inputRef.current?.focus();
              }}
              className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-slate-400 transition-colors hover:border-primary/40 hover:text-primary sm:text-xs"
            >
              {quickCommand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
