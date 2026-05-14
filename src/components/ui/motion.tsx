'use client';

import { Children, cloneElement, isValidElement, type CSSProperties, type ReactNode, useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';

type MotionVariant = 'fade-up' | 'fade';

interface MotionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  reducedMotion?: boolean;
  threshold?: number;
  rootMargin?: string;
  variant?: MotionVariant;
}

interface MotionStaggerProps {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  delayStep?: number;
  once?: boolean;
  reducedMotion?: boolean;
  startDelay?: number;
  threshold?: number;
  rootMargin?: string;
  variant?: MotionVariant;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return prefersReducedMotion;
}

export function MotionReveal({
  children,
  className,
  delay = 0,
  once = true,
  reducedMotion,
  threshold = 0.12,
  rootMargin = '0px 0px -72px 0px',
  variant = 'fade-up',
}: MotionRevealProps) {
  const { ref, inView } = useInView({ threshold, rootMargin, once });
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldReduceMotion = reducedMotion ?? prefersReducedMotion;

  return (
    <div
      ref={ref}
      data-in-view={inView}
      data-reduced-motion={shouldReduceMotion}
      data-variant={shouldReduceMotion ? 'fade' : variant}
      className={cn('motion-reveal', className)}
      style={{ '--motion-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function MotionStagger({
  children,
  className,
  itemClassName,
  delayStep = 72,
  once = true,
  reducedMotion,
  startDelay = 0,
  threshold = 0.12,
  rootMargin = '0px 0px -72px 0px',
  variant = 'fade-up',
}: MotionStaggerProps) {
  return (
    <div className={className}>
      {Children.map(children, (child, index) => {
        if (!child) return child;

        const wrapped = (
          <MotionReveal
            className={itemClassName}
            delay={startDelay + index * delayStep}
            once={once}
            reducedMotion={reducedMotion}
            threshold={threshold}
            rootMargin={rootMargin}
            variant={variant}
          >
            {child}
          </MotionReveal>
        );

        if (!isValidElement(child)) return wrapped;

        const key = child.key ?? `motion-stagger-${index}`;
        return cloneElement(wrapped, { key });
      })}
    </div>
  );
}
