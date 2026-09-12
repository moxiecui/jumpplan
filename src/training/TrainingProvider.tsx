import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { TrainingState } from './model';
import { freshState, importData, migrate, STORAGE_KEY, validateState } from './storage';

interface Context { state: TrainingState; ready: boolean; error: string; update: (fn: (s: TrainingState) => TrainingState) => boolean; restore: (raw: string) => void; }
const TrainingContext = createContext<Context | null>(null);
export function TrainingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(freshState), [ready, setReady] = useState(false), [error, setError] = useState('');
  const ref = useRef(state), writable = useRef(false);
  useEffect(() => {
    const hydration = setTimeout(() => {
    try {
      if (typeof localStorage === 'undefined') throw new Error('当前平台无法持久保存。请使用浏览器版本并允许本地存储。');
      const raw = localStorage.getItem(STORAGE_KEY), loaded = raw ? JSON.parse(raw) : migrate(localStorage);
      validateState(loaded); ref.current = loaded; setState(loaded);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded)); writable.current = true;
    } catch (e) { setError(`无法读取/保存训练数据，已保留原数据。${String(e)}`); }
    setReady(true);
    }, 0);
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try { const loaded = JSON.parse(event.newValue); validateState(loaded); ref.current = loaded; setState(loaded); } catch { setError('其他窗口的数据无效，未载入。'); }
    };
    if (typeof window !== 'undefined') window.addEventListener('storage', sync);
    return () => { clearTimeout(hydration); if (typeof window !== 'undefined') window.removeEventListener('storage', sync); };
  }, []);
  const update = useCallback((fn: (s: TrainingState) => TrainingState) => {
    try {
      if (!writable.current) throw new Error('本地保存不可用，未接受新记录。');
      const disk = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'); validateState(disk);
      if (disk.revision !== ref.current.revision) { ref.current = disk; setState(disk); throw new Error('另一窗口更新了记录，已同步，请重新操作。'); }
      const next = { ...fn(ref.current), revision: ref.current.revision + 1 }; validateState(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); ref.current = next; setState(next); setError('');
      return true;
    } catch (e) { setError(String(e)); return false; }
  }, []);
  const restore = (raw: string) => {
    const incoming = importData(raw);
    // Backup current data first. Imports merge by stable id; existing records win conflicts.
    localStorage.setItem(`${STORAGE_KEY}-backup-${Date.now()}`, JSON.stringify(ref.current));
    const saved = update(current => ({ ...current,
      assessments: { ...incoming.assessments, ...current.assessments },
      sessions: [...current.sessions, ...incoming.sessions.filter(x => !current.sessions.some(s => s.id === x.id) && (x.endedAt || !current.sessions.some(s => !s.endedAt)))],
      basketball: [...current.basketball, ...incoming.basketball.filter(x => !current.basketball.some(s => s.id === x.id))],
      tests: [...current.tests, ...incoming.tests.filter(x => !current.tests.some(s => s.id === x.id))],
      body: [...(current.body ?? []), ...(incoming.body ?? []).filter(x => !(current.body ?? []).some(s => s.date === x.date))],
      history: [...current.history, ...incoming.history.filter(x => !current.history.some(s => s.id === x.id))],
      archived: { ...incoming.archived, ...current.archived, 'import-settings': { startDate: incoming.startDate, overrides: incoming.overrides, rules: incoming.rules } },
      // Empty installation restores schedule; existing active schedules are never silently replaced.
      ...(current.sessions.length === 0 && Object.keys(current.assessments).length === 0 ? { startDate: incoming.startDate, overrides: incoming.overrides, rules: incoming.rules, skippedDates: incoming.skippedDates } : {})
    }));
    if (!saved) throw new Error('合并未保存，请查看页面中的存储错误；原记录未替换。');
  };
  return <TrainingContext.Provider value={{ state, ready, error, update, restore }}>{children}</TrainingContext.Provider>;
}
export function useTraining() { const c = useContext(TrainingContext); if (!c) throw new Error('TrainingProvider missing'); return c; }
