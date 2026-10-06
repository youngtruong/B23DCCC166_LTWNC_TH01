'use client';
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
const ThemeContext = createContext<{ theme: 'light' | 'dark'; toggleTheme: () => void } | null>(null);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const toggleTheme = useCallback(() => setTheme(value => value === 'light' ? 'dark' : 'light'), []);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function ThemeToggle() { const value = useContext(ThemeContext); if (!value) throw new Error('ThemeProvider required'); return <button onClick={value.toggleTheme}>Chủ đề: {value.theme === 'light' ? 'Sáng' : 'Tối'}</button>; }
