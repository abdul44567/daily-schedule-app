'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import Button from '../components/Button'; 

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button after scrolling down
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 150);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition cursor-pointer"
    >
      <ArrowUp size={20} />
    </Button>
  );
}
