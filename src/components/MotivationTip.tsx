import React, { useRef, useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';

export const MotivationTip: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3, 
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (tipRef.current) {
      observer.observe(tipRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={tipRef}
      className={`bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 border border-purple-200 transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white">💡 Motivation Boost</h3>
      </div>
      
      <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
        <p className="text-white text-base leading-relaxed">
          You're doing great! Stay hydrated and keep moving 💪
        </p>
      </div>
      
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-1 text-white/80 text-sm">
          <span>✨</span>
          <span>Keep up the amazing work!</span>
          <span>✨</span>
        </div>
      </div>
    </div>
  );
};