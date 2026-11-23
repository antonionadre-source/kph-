import React from 'react';
import KaiAssistant from './KaiAssistant';

interface FloatingMascotProps {
  currentPage: string;
  cart?: unknown[];
  onNavigate?: (page: string) => void;
  seoCityId?: string;
}

/** One assistant and one draft across the homepage and the calculator. */
export default function FloatingMascot({ currentPage, onNavigate }: FloatingMascotProps) {
  return <KaiAssistant currentPage={currentPage} onNavigate={onNavigate || (() => {})} />;
}
