import { useState } from "react";
import { ContactForm } from "@/components/ContactForm";
import { timeline } from "@/data/experience";
import { projects } from "@/data/projects";
import { recognition } from "@/data/recognition";

const destinations = ["Engineering Lab", "The Journey", "Art Studio", "Connect"];

interface GraphiteFallbackProps {
  message?: string;
  details?: string;
  onReturn?: () => void;
}

export default function GraphiteFallback({ message, details, onReturn }: GraphiteFallbackProps) {
  const [selected, setSelected] = useState(0);
  const [color, setColor] = useState(false);

  return (
    <main className="graphite-fallback">
      <header className="graphite-fallback__header">
        <a href="/" className="graphite-fallback__mark">AAYUSH ANGAL <span>· GRAPHITE WORKSHOP</span></a>
        <a className="graphite-fallback__resume" href="/resume.pdf" download="Aayush_Angal_Resume.pdf">Résumé ↗</a>
      </header>

      <section className="graphite-fallback__scene" aria-label="Hand-drawn graphite corridor">
        <div className="graphite-fallback__heading">
          <p>FIELD NOTE / 01</p>
          <h1>A workshop drawn between code and art.</h1>
          <p className="graphite-fallback__intro">A graphite study of an engineer’s imagined workspace. Choose a doorway to explore the sketch.</p>
        </div>
        <svg className={color ? "graphite-fallback__drawing is-color" : "graphite-fallback__drawing"} viewBox="0 0 1000 560" role="img" aria-labelledby="world-title world-description">
          <title id="world-title">Graphite corridor with four workshop doorways</title>
          <desc id="world-description">A hand-drawn perspective corridor with floorboard lines, ceiling beams, four labeled doors, and a signal-path drawing at its end.</desc>
          <defs>
            <pattern id="paper-grain" width="70" height="70" patternUnits="userSpaceOnUse">
              <path d="M4 10l18-2m21 11l15-1M11 45l23 2m14 12l16-3" stroke="#77736d" strokeWidth=".7" opacity=".2" />
              <circle cx="36" cy="31" r=".9" fill="#77736d" opacity=".15" />
            </pattern>
            <pattern id="color-wash" width="90" height="90" patternUnits="userSpaceOnUse">
              <path d="M4 44Q32 15 75 35T94 61" fill="none" stroke="#64806b" strokeWidth="12" opacity=".28" />
              <path d="M8 12Q34 29 82 5" fill="none" stroke="#4169a8" strokeWidth="7" opacity=".22" />
            </pattern>
            <clipPath id="drawing-frame"><rect x="0" y="0" width="1000" height="560" /></clipPath>
          </defs>
          <g clipPath="url(#drawing-frame)" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect width="1000" height="560" fill="#f2eee5" />
            <rect width="1000" height="560" fill="url(#paper-grain)" stroke="none" />
            <g className="graphite-fallback__color-layer" stroke="none"><path d="M0 0h1000v560H0z" fill="url(#color-wash)" /></g>
            <g stroke="#252525" strokeWidth="2.1" opacity=".82">
              <path d="M15 26L388 184 500 206 612 184 985 26" />
              <path d="M20 506L388 358 500 340 612 358 980 506" />
              <path d="M24 31v472m952-472v472M388 185v174m224-174v174" />
              <path d="M80 55L408 195M920 55L592 195M40 468l390-115m530 115L570 353" opacity=".48" />
              <path d="M412 212h176v120H412zM421 220h158v104H421z" />
              <path d="M500 208v126M390 199h-50v156h50m220-156h50v156h-50" />
            </g>
            <g stroke="#78746e" strokeWidth="1.15" opacity=".65">
              <path d="M62 85l332 119M939 84L606 204M31 478l383-118m555 118L586 360" />
              <path d="M130 73v397m70-366v340m70-308v279m70-246v219M870 73v397m-70-366v340m-70-308v279m-70-246v219" />
              <path d="M432 30l6 164m54-163l2 166m60-168l-3 167m-110 166l-9 145m105-145l-2 145m60-145l9 145" />
              <path d="M48 124L369 230M952 124L631 230M35 434l360-93m570 93l-360-93M100 100l307 111m486-111L593 211" />
              <path d="M20 531l960-5M69 492l860 7M128 467l744 17M196 442l608 26M272 419l456 29M350 392l300 37" />
              <path d="M12 454l374-97m602 97l-374-97" />
            </g>
            <g stroke="#252525" strokeWidth="2.4">
              <path d="M123 226l103 43v112l-103-35zM131 236l87 37v94l-87-30z" />
              <path d="M774 269l103-43v120l-103 35zM782 273l87-37v94l-87 30z" />
              <path d="M142 251l65 28m-65-14l65 28m-65-14l65 28m557-56l65-28m-65 42l65-28m-65 42l65-28" strokeWidth="1.2" />
            </g>
            <g className="graphite-fallback__doors" stroke="#252525" strokeWidth="2" fill="#f2eee5">
              <path d="M286 210l72 25v134l-72-22zM293 220l58 20v116l-58-18z" />
              <path d="M642 235l72-25v137l-72 22zM649 240l58-20v116l-58 18z" />
              <path d="M216 239l54 20v122l-54-18zM730 259l54-20v124l-54 18z" />
              <path d="M301 253l41 14m-41 16l41 14m-41 16l41 14m316-74l41-14m-41 44l41-14m-41 44l41-14m-461-63v110m515-110v110" strokeWidth="1.1" />
              <circle cx="345" cy="318" r="3" fill="#e97855" /><circle cx="657" cy="318" r="3" fill="#e97855" />
            </g>
            <g className="graphite-fallback__labels" fill="#252525" stroke="none" fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="2">
              <text x="260" y="203">01 · ENGINEERING LAB</text><text x="625" y="203">02 · THE JOURNEY</text>
              <text x="188" y="233">03 · ART STUDIO</text><text x="738" y="233">04 · CONNECT</text>
              <text x="432" y="355" fontSize="10">DRAFT 07 / SIGNAL PATH</text>
            </g>
            <g stroke="#4169a8" strokeWidth="3" opacity=".76">
              <path d="M438 278h31l15-23 22 46 20-35 18 12h19" />
              <circle cx="438" cy="278" r="4" fill="#e97855" /><circle cx="563" cy="278" r="4" fill="#64806b" />
            </g>
            <path d="M48 35L387 184m-342-140L395 190m560-150L613 185m342-138L605 190M38 493l371-141m551 145L592 352" stroke="#252525" strokeWidth=".7" opacity=".4" />
          </g>
        </svg>
        <div className="graphite-fallback__caption"><span>FIG. 01 — A PERSPECTIVE STUDY</span><span>Graphite / warm paper / selected color</span></div>
      </section>

      <section className="graphite-fallback__controls" aria-label="Graphite world controls">
        <div>
          <p className="graphite-fallback__eyebrow">Choose a doorway</p>
          <nav className="graphite-fallback__doors" aria-label="Workshop destinations">
            {destinations.map((destination, index) => (
              <button key={destination} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>
                <span>0{index + 1}</span>{destination}<span aria-hidden="true">↗</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="graphite-fallback__actions">
          <p aria-live="polite">Selected · 0{selected + 1} / {destinations[selected]}</p>
          <button type="button" className="graphite-fallback__color" aria-pressed={color} onClick={() => setColor((value) => !value)}>
            {color ? "Return to graphite" : "Reveal sketch in color"}
          </button>
          {onReturn && <button type="button" className="graphite-fallback__return" onClick={onReturn}>Return to 3D entrance</button>}
          {message && <p className="graphite-fallback__notice" role="status">{message}</p>}
          {details && import.meta.env.DEV && <details className="graphite-fallback__details"><summary>Development diagnostic details</summary><pre>{details}</pre></details>}
        </div>
      </section>
      <section className="graphite-fallback__portfolio-index" aria-label="Readable portfolio information">
        <details>
          <summary>Projects</summary>
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <p>{project.tags.join(" · ")}</p>
                <div className="graphite-fallback__links">
                  {project.github && project.githubVisibility !== "private" && <a href={project.github} target="_blank" rel="noreferrer">Source code</a>}
                  {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live demo</a>}
                </div>
              </li>
            ))}
          </ul>
        </details>
        <details>
          <summary>Experience and education</summary>
          <ol>
            {timeline.map((item) => (
              <li key={item.id}>
                <h2>{item.title}</h2>
                <p>{item.organization} · {item.location} · {item.period}</p>
                <ul>{item.description.map((line) => <li key={line}>{line}</li>)}</ul>
                {item.certificateUrl && <a href={item.certificateUrl} target="_blank" rel="noreferrer">View certificate</a>}
              </li>
            ))}
          </ol>
        </details>
        <details>
          <summary>Certificates and achievements</summary>
          <ul>
            {recognition.map((item) => (
              <li key={item.id}>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                {item.link && <a href={item.link} target="_blank" rel="noreferrer">View certificate</a>}
              </li>
            ))}
          </ul>
        </details>
        <details>
          <summary>Contact</summary>
          <p><a href="mailto:angalaayush646@gmail.com">angalaayush646@gmail.com</a> · <a href="tel:+917387890392">+91 73878 90392</a></p>
          <p><a href="https://github.com/Beast123-cmd" target="_blank" rel="noreferrer">GitHub</a> · <a href="https://linkedin.com/in/aayushangal" target="_blank" rel="noreferrer">LinkedIn</a></p>
          <ContactForm />
        </details>
      </section>
      <footer className="graphite-fallback__footer"><span>Keyboard: tab to choose · enter to activate</span><span>Illustrated view remains available without WebGL</span></footer>
    </main>
  );
}
