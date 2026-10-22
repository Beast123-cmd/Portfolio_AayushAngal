import { FormEvent, KeyboardEvent, useRef, useState } from 'react';
import { ArrowUpRight, ChevronRight, Minus, Square, X } from 'lucide-react';
import { projects } from '@/data/projects';

type Output = {
  command: string;
  directory: string;
  text: string;
  section?: string;
  href?: string;
};

const folders: Record<string, { section: string; files: string[] }> = {
  about: { section: 'about', files: ['README.md', 'skills.txt'] },
  projects: { section: 'projects', files: projects.map((project) => `${project.id}.md`) },
  experience: { section: 'experience', files: ['README.md', 'resume.pdf'] },
  education: { section: 'education', files: ['README.md', 'transcript.txt'] },
  awards: { section: 'certificates', files: ['certificates.txt', 'achievements.txt'] },
  contact: { section: 'contact', files: ['README.md', 'links.txt'] },
};

const commandSuggestions = [
  'help', 'ls', 'pwd', 'whoami', 'skills', 'projects', 'experience', 'education', 'awards', 'contact',
  'resume', 'clear', 'history', 'cd ..', ...Object.keys(folders).map((folder) => `cd ${folder}`),
];

const formatPath = (directory: string) => directory ? `~/${directory}` : '~';

const findProject = (value: string) => {
  const query = value.toLowerCase().replace(/\.md$/, '').replace(/[-_]/g, ' ').trim();
  return projects.find((project) => project.id === query.replace(/\s+/g, '-') || project.title.toLowerCase().includes(query));
};

export const TerminalExplorer = () => {
  const [input, setInput] = useState('');
  const [directory, setDirectory] = useState('');
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyPosition, setHistoryPosition] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const execute = (rawCommand: string) => {
    const command = rawCommand.trim().replace(/\s+/g, ' ');
    const normalized = command.toLowerCase();
    const currentDirectory = directory;
    const entry: Output = { command, directory: currentDirectory, text: '' };

    if (!command) return;
    if (['clear', 'cls'].includes(normalized)) {
      setOutputs([]);
      return;
    }

    if (['help', '?'].includes(normalized)) {
      entry.text = 'ls · cd <folder> · cd .. · pwd · cat <file> · open <project> · whoami · skills · resume · history\nFolders: about/ projects/ experience/ education/ awards/ contact/';
    } else if (normalized === 'pwd') {
      entry.text = `/home/aayush${currentDirectory ? `/${currentDirectory}` : ''}`;
    } else if (['ls', 'dir'].includes(normalized)) {
      entry.text = currentDirectory
        ? folders[currentDirectory]?.files.join('   ') ?? 'No files here.'
        : 'about/   projects/   experience/   education/   awards/   contact/   resume.pdf';
    } else if (normalized === 'history') {
      entry.text = history.length ? history.map((item, index) => `${index + 1}  ${item}`).join('\n') : 'No commands yet.';
    } else if (normalized === 'cd' || normalized.startsWith('cd ')) {
      const destination = normalized.replace(/^cd\s*/, '').replace(/^~\/?/, '').replace(/^\//, '');
      const nextDirectory = ['', '.', '..'].includes(destination) ? '' : destination.replace(/\/$/, '');
      if (nextDirectory && !folders[nextDirectory]) {
        entry.text = `No such folder: ${destination}. Use ls to see available folders.`;
      } else {
        setDirectory(nextDirectory);
        entry.text = nextDirectory
          ? `Changed directory to ${formatPath(nextDirectory)}\n${folders[nextDirectory].files.join('   ')}`
          : 'Returned to home. Folders: about/   projects/   experience/   education/   awards/   contact/';
        entry.section = nextDirectory ? folders[nextDirectory].section : 'terminal';
      }
    } else if (['whoami', 'about'].includes(normalized)) {
      entry.text = 'Aayush Angal — AI/ML intern at Prorigo, building enterprise AI workflows, backend systems, and data-driven products.';
      entry.section = 'about';
    } else if (['skills', 'stack', 'cat skills.txt'].includes(normalized)) {
      entry.text = 'Python · TypeScript · React · FastAPI · Node.js · LangGraph · PostgreSQL · C++';
      entry.section = 'about';
    } else if (['projects', 'experience', 'education', 'awards', 'contact'].includes(normalized)) {
      return execute(`cd ${normalized}`);
    } else if (['resume', 'cv', 'download resume'].includes(normalized) || normalized === 'cat resume.pdf') {
      entry.text = 'Current resume — download PDF';
      entry.href = '/resume.pdf';
    } else if (normalized.startsWith('cat ')) {
      const file = normalized.slice(4).split('/').pop() ?? '';
      const project = findProject(file);
      if (project) {
        entry.text = `${project.title}\n${project.description}\nStack: ${project.tags.join(', ')}`;
        entry.section = 'projects';
      } else if (file === 'readme.md' && currentDirectory === 'experience') {
        entry.text = 'AI/ML Intern at Prorigo · Pune, India · Mar 2026 – Present\nBuilding enterprise agent workflows, application context tools, MCP integrations, and document RAG systems.';
        entry.section = 'experience';
      } else if (file === 'transcript.txt' || (file === 'readme.md' && currentDirectory === 'education')) {
        entry.text = 'B.E. Electronics & Telecommunication · PICT · CGPA 9.58 · Aug 2023 – May 2027';
        entry.section = 'education';
      } else if (file === 'certificates.txt' || file === 'achievements.txt') {
        entry.text = 'Machine Learning · Advanced Python · HacXLerate AI/Tech runner-up · Odoo Hackathon finalist · Ignisia AI Hackathon finalist';
        entry.section = 'certificates';
      } else if (file === 'links.txt' || (file === 'readme.md' && currentDirectory === 'contact')) {
        entry.text = 'Email: angalaayush646@gmail.com\nGitHub: github.com/Beast123-cmd\nLinkedIn: linkedin.com/in/aayushangal';
        entry.section = 'contact';
      } else if (file === 'readme.md' || file === 'about.md') {
        entry.text = 'Electronics and Telecommunication undergraduate at PICT. I build context-aware AI tools and backend systems for real-world workflows.';
        entry.section = 'about';
      } else {
        entry.text = `File not found: ${file}. Use ls to see available files.`;
      }
    } else if (normalized.startsWith('open ')) {
      const project = findProject(normalized.slice(5).replace(/^projects\//, ''));
      if (!project) {
        entry.text = 'Project not found. Use cd projects, then ls to browse projects.';
      } else {
        entry.text = `Opening ${project.title}${project.githubVisibility === 'private' ? ' (source is private)' : ''}.`;
        entry.section = 'projects';
        entry.href = project.demo ?? (project.githubVisibility !== 'private' ? project.github : undefined);
      }
    } else {
      entry.text = `Command not found: ${command}. Type help to see available commands.`;
    }

    setOutputs((current) => [...current, entry].slice(-8));
    if (entry.section) {
      window.setTimeout(() => document.getElementById(entry.section!)?.scrollIntoView({ behavior: 'smooth' }), 180);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    execute(value);
    setHistory((current) => [...current, value].slice(-30));
    setHistoryPosition(-1);
    setInput('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' && history.length) {
      event.preventDefault();
      const position = historyPosition < 0 ? history.length - 1 : Math.max(0, historyPosition - 1);
      setHistoryPosition(position);
      setInput(history[position]);
    } else if (event.key === 'ArrowDown' && historyPosition >= 0) {
      event.preventDefault();
      const position = historyPosition + 1;
      setHistoryPosition(position >= history.length ? -1 : position);
      setInput(position >= history.length ? '' : history[position]);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const partial = input.toLowerCase();
      const choices = partial.startsWith('cd ')
        ? Object.keys(folders).map((folder) => `cd ${folder}`).filter((item) => item.startsWith(partial))
        : commandSuggestions.filter((item) => item.startsWith(partial));
      if (choices.length === 1) setInput(choices[0]);
    }
  };

  const path = formatPath(directory);

  return (
    <section id="terminal" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-primary">Interactive portfolio shell</p>
          <h2 className="mb-4 text-4xl font-bold sm:text-5xl">Explore with <span className="text-gradient">commands</span></h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Browse portfolio folders, inspect project files, and jump to sections. Start with <code className="rounded bg-card px-2 py-1 font-mono text-primary">ls</code> or type <code className="rounded bg-card px-2 py-1 font-mono text-primary">help</code>.</p>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-primary/25 bg-[#0b1220]/95 text-left shadow-2xl shadow-primary/10">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#06d6a0]" />
            </div>
            <div className="font-mono text-xs text-slate-400 sm:text-sm">aayush@portfolio: {path}</div>
            <div className="flex items-center gap-2 text-slate-500" aria-hidden="true">
              <Minus className="h-3.5 w-3.5" /><Square className="h-3 w-3" /><X className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="px-4 py-5 font-mono text-xs leading-relaxed sm:px-7 sm:py-7 sm:text-sm">
            <div className="mb-5 space-y-1 text-slate-300">
              <p><span className="text-emerald-400">aayush@portfolio</span><span className="text-slate-500">:</span><span className="text-sky-300">~</span>$ <span className="text-white">./explore.sh</span></p>
              <p className="text-slate-400">Portfolio explorer ready <span className="text-emerald-400">[read-only]</span></p>
              <p className="text-slate-400">Navigate with <span className="text-primary">cd</span>, list files with <span className="text-primary">ls</span>, inspect with <span className="text-primary">cat</span>.</p>
            </div>

            <div className="mb-5 max-h-72 space-y-4 overflow-y-auto pr-1" aria-live="polite" aria-relevant="additions text">
              {outputs.map((output, index) => (
                <div key={`${output.command}-${index}`} className="space-y-1">
                  <p className="break-words"><span className="text-emerald-400">aayush@portfolio</span><span className="text-slate-500">:</span><span className="text-sky-300">{formatPath(output.directory)}</span>$ <span className="text-white">{output.command}</span></p>
                  <div className="flex items-start justify-between gap-3 whitespace-pre-wrap break-words text-slate-400">
                    <p>{output.text}</p>
                    {output.href && (
                      <a
                        href={output.href}
                        target={output.href.startsWith('/') ? undefined : '_blank'}
                        rel={output.href.startsWith('/') ? undefined : 'noopener noreferrer'}
                        download={output.href === '/resume.pdf' ? 'Aayush_Angal_Resume.pdf' : undefined}
                        aria-label={output.href === '/resume.pdf' ? 'Download resume' : 'Open project link'}
                        className="shrink-0 text-primary transition-colors hover:text-primary/80"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/10 pt-4">
              <label htmlFor="terminal-explorer-input" className="shrink-0 text-emerald-400"><span className="sr-only">Enter command</span><span aria-hidden="true">$</span></label>
              <input
                ref={inputRef}
                id="terminal-explorer-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type a command..."
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-600 focus-visible:ring-0"
              />
              <button type="submit" aria-label="Run command" className="text-primary transition-transform hover:translate-x-0.5"><ChevronRight className="h-5 w-5" /></button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2" aria-label="Suggested terminal commands">
              {['ls', 'cd projects', 'cd experience', 'help'].map((quickCommand) => (
                <button
                  key={quickCommand}
                  type="button"
                  onClick={() => {
                    execute(quickCommand);
                    setHistory((current) => [...current, quickCommand].slice(-30));
                    inputRef.current?.focus();
                  }}
                  className="rounded-md border border-white/10 px-2.5 py-1.5 text-[10px] text-slate-400 transition-colors hover:border-primary/40 hover:text-primary sm:text-xs"
                >
                  {quickCommand}
                </button>
              ))}
              <span className="ml-auto self-center text-[10px] text-slate-600 sm:text-xs">↑↓ history · Tab completion</span>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-3 max-w-4xl text-right font-mono text-[10px] text-muted-foreground sm:text-xs">This portfolio shell does not run system commands.</p>
      </div>
    </section>
  );
};
