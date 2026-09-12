import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('rescuelens_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('rescuelens_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('rescuelens_theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle light/dark mode theme"
      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-cyan-500 transition-all flex items-center gap-1.5 text-xs font-bold font-mono shadow-sm select-none"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>☀ Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-600" />
          <span>☾ Dark</span>
        </>
      )}
    </button>
  );
}
