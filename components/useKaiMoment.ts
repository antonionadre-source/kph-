import { useEffect, useState } from 'react';
import { selectKaiMoment, kaiMedia } from '../src/content/kaiCalendar';

export function useKaiMoment() {
  const choose = () => selectKaiMoment(new Date(), typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('kai'));
  const [moment, setMoment] = useState(choose);
  useEffect(() => {
    const update = () => { if (!document.hidden) setMoment(choose()); };
    const timer = setInterval(update, 60000);
    document.addEventListener('visibilitychange', update);
    window.addEventListener('popstate', update);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', update); window.removeEventListener('popstate', update); };
  }, []);
  return kaiMedia(moment);
}
