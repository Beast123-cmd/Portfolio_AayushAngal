import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import TerminalPage from "./pages/TerminalPage";
import NotFound from "./pages/NotFound";

const ExperienceShell = lazy(() => import("@/graphite/pages/ExperienceShell"));

const App = () => (
  <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Suspense fallback={<main className="graphite-fallback" role="status">Loading the graphite world…</main>}><ExperienceShell /></Suspense>} />
        <Route path="/experience" element={<Suspense fallback={<main className="graphite-fallback" role="status">Loading the graphite world…</main>}><ExperienceShell /></Suspense>} />
        <Route path="/terminal" element={<TerminalPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
