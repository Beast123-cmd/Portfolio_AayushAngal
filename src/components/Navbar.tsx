import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PillNav from './PillNav';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('#');
  const lastActiveSectionRef = useRef('#');

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ['about', 'projects', 'experience', 'education', 'certificates', 'contact'];
          const scrollPosition = window.scrollY + 100;
          let newActiveSection = '#';

          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const offsetTop = element.offsetTop;
              const offsetHeight = element.offsetHeight;
              
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                newActiveSection = `#${section}`;
                break;
              }
            }
          }
          
          if (window.scrollY < 100) {
            newActiveSection = '#';
          }
          
          // Only update state if the section actually changed
          if (newActiveSection !== lastActiveSectionRef.current) {
            lastActiveSectionRef.current = newActiveSection;
            setActiveSection(newActiveSection);
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = useMemo(() => [
    { label: 'Terminal', href: '/terminal' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Awards', href: '#certificates' },
    { label: 'Contact', href: '#contact' },
  ], []);

  const scrollToSection = useCallback((href: string) => {
    if (href === '/terminal') {
      navigate('/terminal');
      return;
    }
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [navigate]);

  return (
    <PillNav
      logo="/favicon.svg"
      logoAlt="Aayush Angal"
      items={navItems}
      activeHref={activeSection}
      onItemClick={scrollToSection}
      ease="power2.easeOut"
      className="theme-aware"
    />
  );
};
