import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projects } from '@/data/projects';
import { timeline } from '@/data/experience';
import { skillCategories } from '@/data/skills';

type TerminalLink = { label: string; href: string; download?: boolean };
type Output = { command: string; directory: string; text: string; links?: TerminalLink[] };

const folders = ['about', 'projects', 'experience', 'education', 'awards', 'contact'];
const folderFiles: Record<string, string[]> = {
  about: ['README.md', 'skills.txt'],
  projects: projects.map((project) => `${project.id}.md`),
  experience: ['README.md', 'resume.pdf'],
  education: ['README.md', 'transcript.txt'],
  awards: ['certificates.txt', 'achievements.txt'],
  contact: ['README.md', 'links.txt'],
};
const completionCommands = ['help', 'ls', 'pwd', 'whoami', 'skills', 'resume', 'history', 'clear', 'exit', 'cd ..'];

const pathFor = (directory: string) => directory ? `~/${directory}` : '~';

const findProject = (raw: string) => {
  const query = raw.toLowerCase().replace(/\.md$/, '').replace(/[-_]/g, ' ').trim();
  return projects.find((project) => project.id === query.replace(/\s+/g, '-') || project.title.toLowerCase().includes(query));
};

const getProjectLinks = (project: (typeof projects)[number]): TerminalLink[] => {
  const links: TerminalLink[] = [];
  if (project.github && project.githubVisibility !== 'private') links.push({ label: 'Source code', href: project.github });
  if (project.demo) links.push({ label: 'Live demo', href: project.demo });
  return links;
};

export const TerminalExplorer = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [directory, setDirectory] = useState('');
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyPosition, setHistoryPosition] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [outputs]);

  const execute = (rawCommand: string) => {
    const command = rawCommand.trim().replace(/\s+/g, ' ');
    const normalized = command.toLowerCase();
    const commandDirectory = directory;
    const result: Output = { command, directory: commandDirectory, text: '' };

    if (!command) return;
    if (['clear', 'cls'].includes(normalized)) {
      setOutputs([]);
      return;
    }
    if (['exit', 'quit', 'back'].includes(normalized)) {
      navigate('/');
      return;
    }

    if (['help', '?'].includes(normalized)) {
      result.text = 'Portfolio commands (read-only):\n  ls                         list folders or files\n  cd <folder>                enter a folder\n  cd ..                      return to the home directory\n  cat <file>                 read a portfolio file\n  open <project>             view a project and its links\n  pwd · whoami · skills · resume · history · clear · exit\nFolders: about/ projects/ experience/ education/ awards/ contact/';
    } else if (normalized === 'pwd') {
      result.text = `/home/aayush${directory ? `/${directory}` : ''}`;
    } else if (['ls', 'dir'].includes(normalized)) {
      result.text = directory ? folderFiles[directory].join('   ') : `${folders.join('/   ')}/   resume.pdf`;
    } else if (normalized === 'history') {
      result.text = history.length ? history.map((item, index) => `${String(index + 1).padStart(2, ' ')}  ${item}`).join('\n') : 'No commands entered yet.';
    } else if (normalized === 'cd' || normalized.startsWith('cd ')) {
      const destination = normalized.replace(/^cd\s*/, '').replace(/^~\/?/, '').replace(/^\//, '');
      const nextDirectory = ['', '.', '..'].includes(destination) ? '' : destination.replace(/\/$/, '');
      if (nextDirectory && !folders.includes(nextDirectory)) {
        result.text = `cd: no such directory: ${destination}\nRun ls to list available folders.`;
      } else {
        setDirectory(nextDirectory);
        result.text = nextDirectory
          ? `Changed directory to ${pathFor(nextDirectory)}\n\n${folderFiles[nextDirectory].join('   ')}`
          : `Returned to home.\n\n${folders.join('/   ')}/   resume.pdf`;
      }
    } else if (['whoami', 'about'].includes(normalized)) {
      result.text = 'Aayush Angal\nAI/ML intern at Prorigo and Electronics & Telecommunication undergraduate at PICT. I build enterprise AI workflows, backend systems, and data-driven products.';
    } else if (['skills', 'stack', 'cat skills.txt'].includes(normalized)) {
      result.text = skillCategories.map((category) => `${category.title}: ${category.items.join(', ')}`).join('\n');
    } else if (['resume', 'cv', 'download resume', 'cat resume.pdf'].includes(normalized)) {
      result.text = 'Current resume —';
      result.links = [{ label: 'Download Aayush_Angal_Resume.pdf', href: '/resume.pdf', download: true }];
    } else if (normalized.startsWith('cat ')) {
      const file = normalized.slice(4).split('/').pop() ?? '';
      const project = findProject(file);
      if (project) {
        result.text = `${project.title}\n\n${project.description}\n\nStack: ${project.tags.join(' · ')}`;
        result.links = getProjectLinks(project);
      } else if (file === 'readme.md' && commandDirectory === 'experience') {
        const role = timeline.find((item) => item.type === 'experience');
        result.text = role
          ? `${role.title} · ${role.organization}\n${role.period} · ${role.location}\n\n${role.description.map((item) => `• ${item}`).join('\n')}`
          : 'Experience details are not available.';
      } else if (file === 'transcript.txt' || (file === 'readme.md' && commandDirectory === 'education')) {
        result.text = timeline.filter((item) => item.type === 'education').map((item) => `${item.title}\n${item.organization} · ${item.location}\n${item.period}\n${item.description.join(' · ')}`).join('\n\n');
      } else if (file === 'certificates.txt' || file === 'achievements.txt') {
        result.text = 'Certificates: Machine Learning Course (2024), Python: From Scratch to Advanced (95%).\nAchievements: HacXLerate AI/Tech Competition — 1st Runner-Up; Odoo Hackathon — Finalist; Ignisia AI Hackathon — Finalist.';
      } else if (file === 'links.txt' || (file === 'readme.md' && commandDirectory === 'contact')) {
        result.text = 'Contact and profiles:';
        result.links = [
          { label: 'Email · angalaayush646@gmail.com', href: 'mailto:angalaayush646@gmail.com' },
          { label: 'GitHub · Beast123-cmd', href: 'https://github.com/Beast123-cmd' },
          { label: 'LinkedIn · aayushangal', href: 'https://linkedin.com/in/aayushangal' },
        ];
      } else if (file === 'readme.md' || file === 'about.md') {
        result.text = 'Aayush Angal\nElectronics and Telecommunication undergraduate at PICT. I build context-aware AI tools and backend systems for real-world workflows.';
      } else {
        result.text = `cat: ${file}: file not found\nUse ls to list the current folder.`;
      }
    } else if (normalized.startsWith('open ')) {
      const project = findProject(normalized.slice(5).replace(/^projects\//, ''));
      if (!project) {
        result.text = 'Project not found. Use cd projects, then ls to browse project files.';
      } else {
        result.text = `${project.title}\n\n${project.description}\n\nStack: ${project.tags.join(' · ')}${project.githubVisibility === 'private' ? '\n\nSource repository is private.' : ''}`;
        result.links = getProjectLinks(project);
      }
    } else if (['projects', 'experience', 'education', 'awards', 'contact', 'about'].includes(normalized)) {
      return execute(`cd ${normalized}`);
    } else {
      result.text = `Command not found: ${command}\nType help to see available commands.`;
    }

    setOutputs((current) => [...current, result].slice(-30));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    execute(value);
    if (!['clear', 'cls', 'exit', 'quit', 'back'].includes(value.toLowerCase())) {
      setHistory((current) => [...current, value].slice(-50));
    }
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
        ? folders.map((folder) => `cd ${folder}`).filter((item) => item.startsWith(partial))
        : completionCommands.filter((item) => item.startsWith(partial));
      if (choices.length === 1) setInput(choices[0]);
    }
  };

  const path = pathFor(directory);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1220] px-3 py-6 text-slate-100 sm:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <section aria-label="Interactive portfolio terminal" className="relative flex h-[min(760px,calc(100svh-3rem))] min-h-[500px] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-primary/25 bg-[#0b1220]/95 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} aria-label="Return to portfolio" title="Return to portfolio" className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b] transition-opacity hover:opacity-70" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#06d6a0]" />
          </div>
          <div className="font-mono text-xs text-slate-400 sm:text-sm">aayush@portfolio: {path}</div>
          <button onClick={() => navigate('/')} aria-label="Exit terminal and return to portfolio" title="Return to portfolio" className="text-slate-500 transition-colors hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div ref={outputRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 font-mono text-xs leading-relaxed sm:px-7 sm:py-7 sm:text-sm">
          <div className="mb-6 space-y-1 text-slate-300">
            <p><span className="text-emerald-400">aayush@portfolio</span><span className="text-slate-500">:</span><span className="text-sky-300">~</span>$ <span className="text-white">./welcome.sh</span></p>
            <p className="text-slate-400">Interactive portfolio terminal <span className="text-emerald-400">[online]</span></p>
            <p className="text-slate-400">Browse folders and inspect files. Type <span className="text-primary">help</span> to get started.</p>
            <p className="pt-2 text-slate-500">This is a read-only portfolio shell; commands do not run on a real system.</p>
          </div>

          <div className="space-y-5">
            {outputs.map((output, index) => (
              <article key={`${output.command}-${index}`} className="space-y-1.5">
                <p className="break-words"><span className="text-emerald-400">aayush@portfolio</span><span className="text-slate-500">:</span><span className="text-sky-300">{pathFor(output.directory)}</span>$ <span className="text-white">{output.command}</span></p>
                <div className="whitespace-pre-wrap break-words text-slate-300">{output.text}</div>
                {output.links?.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith('/') || link.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={link.href.startsWith('/') || link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    download={link.download ? 'Aayush_Angal_Resume.pdf' : undefined}
                    className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
                  >
                    {link.label}<ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ))}
              </article>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-white/10 bg-white/[0.02] px-4 py-4 sm:px-7">
          <form onSubmit={submit} className="flex items-center gap-2 font-mono text-sm">
            <span className="shrink-0 text-emerald-400" aria-hidden="true">aayush@portfolio:<span className="text-sky-300">{path}</span>$</span>
            <label htmlFor="terminal-command-input" className="sr-only">Enter a terminal command</label>
            <input
              ref={inputRef}
              id="terminal-command-input"
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
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-slate-500 sm:text-xs">
            <span>↑↓ history · Tab autocomplete</span>
            <button onClick={() => navigate('/')} className="inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" /> return to portfolio</button>
          </div>
        </div>
      </section>
    </main>
  );
};
