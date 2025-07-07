import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components for better performance
const Hero = lazy(() => import('./components/Hero'));
const Features = lazy(() => import('./components/Features'));
const LiveDemo = lazy(() => import('./components/LiveDemo'));
const CodeExamples = lazy(() => import('./components/CodeExamples'));
const About = lazy(() => import('./components/About'));
const Footer = lazy(() => import('./components/Footer'));
const Learning = lazy(() => import('./components/Learning'));
const LearningPreview = lazy(() => import('./components/LearningPreview'));
const NotFound = lazy(() => import('./components/NotFound'));

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode from localStorage or default to true
    const savedPreference = localStorage.getItem('darkMode');
    if (savedPreference !== null) {
      return savedPreference === 'true';
    }
    // Default to dark mode if no preference is saved
    return true;
  });

  useEffect(() => {
    // Apply dark mode class on initial load
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    // Update document class and localStorage
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router basename="/deepoptimizer">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={
            <Suspense fallback={<LoadingSpinner />}>
              <main>
                <Hero />
                <Features />
                <LiveDemo />
                <CodeExamples />
                <LearningPreview />
                <About />
              </main>
            </Suspense>
          } />
          <Route path="/learning" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Learning />
            </Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={<LoadingSpinner />}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;