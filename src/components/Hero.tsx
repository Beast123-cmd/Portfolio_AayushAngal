import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import TextType from './TextType';
import { Suspense, lazy, useState, useEffect } from 'react';

// Lazy load Spline to reduce initial bundle size
const Spline = lazy(() => import('@splinetool/react-spline'));

export const Hero = () => {
  const [showSpline, setShowSpline] = useState(false);
  
  // Delay loading Spline until after initial render for faster first paint
  useEffect(() => {
    const timer = setTimeout(() => setShowSpline(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient with subtle pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-4"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Welcome to my portfolio
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4">
                <span className="text-foreground block">Hi, I'm</span>
                <TextType 
                  text={["Aayush Angal"]}
                  typingSpeed={150}
                  pauseDuration={3000}
                  deletingSpeed={80}
                  showCursor={true}
                  cursorCharacter="|"
                  loop={true}
                  className="text-gradient block"
                />
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-6"
            >
              <span className="font-medium">ML Engineer</span>
              <span className="text-primary mx-2">•</span>
              <span className="font-medium">Full-Stack Developer</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-base sm:text-lg text-muted-foreground/80 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Crafting intelligent solutions through machine learning, data science, and modern web technologies. 
              Passionate about turning complex problems into elegant, user-friendly experiences.
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <button
                onClick={scrollToAbout}
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <span className="text-sm font-medium">Explore my work</span>
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowDown className="h-4 w-4" />
                </motion.div>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Side - 3D Model */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative order-1 lg:order-2 h-[350px] sm:h-[400px] lg:h-[550px] xl:h-[600px] overflow-hidden"
          >
            {/* Glow effect behind the model */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-primary/10 rounded-3xl blur-3xl" />
            
            {showSpline ? (
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span className="text-muted-foreground text-sm">Loading 3D Model...</span>
                  </div>
                </div>
              }>
                <Spline
                  scene="https://prod.spline.design/j8QKnSumr15JHdFD/scene.splinecode"
                  className="w-full h-full"
                />
              </Suspense>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-muted-foreground text-sm">Loading 3D Model...</span>
                </div>
              </div>
            )}
            
            {/* Creative welcome overlay to cover watermark */}
            <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
              {/* Gradient fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent h-32" />
              
              {/* Welcome message - positioned to the right */}
              <div className="relative px-4 py-4 flex justify-end">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-md border border-primary/20 shadow-lg shadow-primary/10">
                  <span className="text-xl">👋</span>
                  <div className="text-sm flex items-center gap-1">
                    <span className="text-foreground font-medium">Hey there!</span>
                    <TextType
                      text={[
                        " Welcome to my portfolio",
                        " Feel free to explore!",
                        " Let's build something amazing!",
                        " Thanks for stopping by!"
                      ]}
                      typingSpeed={50}
                      pauseDuration={3000}
                      deletingSpeed={30}
                      showCursor={true}
                      cursorCharacter="_"
                      loop={true}
                      className="text-foreground font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  );
};
