'use strict';
'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Detect mobile touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setDotPosition({ x: e.clientX, y: e.clientY });
      
      // Delay effect for the outer ring (lagging follow animation)
      setTimeout(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      }, 50);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('interactive-hover');
      
      if (isInteractive) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="custom-cursor" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          width: isHovered ? '40px' : '20px',
          height: isHovered ? '40px' : '20px',
          backgroundColor: isHovered ? 'rgba(17, 17, 17, 0.05)' : 'transparent',
          borderColor: isHovered ? '#111111' : 'rgba(17, 17, 17, 0.4)'
        }}
      />
      <div 
        className="custom-cursor-dot" 
        style={{ 
          left: `${dotPosition.x}px`, 
          top: `${dotPosition.y}px` 
        }}
      />
    </>
  );
}
