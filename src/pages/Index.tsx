import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { TerminalExplorer } from '@/components/TerminalExplorer';
import { About } from '@/components/About';
import { Projects } from '@/components/Projects';
import { Education, Resume } from '@/components/Resume';
import { Certificates } from '@/components/Certificates';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TerminalExplorer />
      <About />
      <Projects />
      <Resume />
      <Education />
      <Certificates />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
