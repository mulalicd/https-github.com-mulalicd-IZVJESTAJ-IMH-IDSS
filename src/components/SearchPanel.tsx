import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [activeMatchIdx, setActiveMatchIdx] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const marksRef = useRef<HTMLElement[]>([]);

  const clearMarks = useCallback(() => {
    marksRef.current.forEach((m) => {
      const parent = m.parentNode;
      if (m.isConnected && parent) {
        parent.replaceChild(document.createTextNode(m.textContent || ''), m);
        parent.normalize();
      }
    });
    marksRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearMarks();
    };
  }, [clearMarks]);

  useEffect(() => {
    if (isOpen) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 50);
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => {
        window.clearTimeout(id);
        window.removeEventListener('keydown', onKeyDown);
      };
    } else {
      clearMarks();
      setQuery('');
      setMatchCount(null);
      setActiveMatchIdx(0);
    }
  }, [isOpen, onClose, clearMarks]);

  const highlightActiveMark = useCallback((idx: number) => {
    const marks = marksRef.current;
    if (!marks.length) return;
    marks.forEach((m, i) => {
      if (i === idx) {
        m.style.outline = '2px solid #035ea1';
        m.style.backgroundColor = '#fde047';
      } else {
        m.style.outline = '';
        m.style.backgroundColor = '';
      }
    });
    const target = marks[idx];
    if (target && target.isConnected) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const navigateMatch = useCallback(
    (delta: 1 | -1) => {
      const total = marksRef.current.length;
      if (!total) return;
      const next = (activeMatchIdx + delta + total) % total;
      setActiveMatchIdx(next);
      highlightActiveMark(next);
    },
    [activeMatchIdx, highlightActiveMark]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    clearMarks();
    setActiveMatchIdx(0);

    const q = val.trim();
    if (q.length < 2) {
      setMatchCount(null);
      return;
    }

    const docRoot = document.querySelector('.document');
    if (!docRoot) return;

    const qLower = q.toLowerCase();
    const walker = document.createTreeWalker(docRoot, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        if (!n.parentElement) return NodeFilter.FILTER_REJECT;
        const tag = n.parentElement.tagName;
        if (['SCRIPT', 'STYLE', 'MARK', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (n.nodeValue && n.nodeValue.toLowerCase().includes(qLower)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      },
    });

    const nodes: Node[] = [];
    let curr: Node | null;
    while ((curr = walker.nextNode())) {
      nodes.push(curr);
    }

    const createdMarks: HTMLElement[] = [];
    nodes.forEach((node) => {
      const text = node.nodeValue || '';
      const lower = text.toLowerCase();
      if (!node.parentNode) return;

      let cursor = 0;
      let idx = lower.indexOf(qLower, cursor);
      if (idx < 0) return;

      const frag = document.createDocumentFragment();
      while (idx >= 0) {
        if (idx > cursor) {
          frag.append(document.createTextNode(text.slice(cursor, idx)));
        }
        const mark = document.createElement('mark');
        mark.textContent = text.slice(idx, idx + q.length);
        frag.append(mark);
        createdMarks.push(mark);

        cursor = idx + q.length;
        idx = lower.indexOf(qLower, cursor);
      }
      if (cursor < text.length) {
        frag.append(document.createTextNode(text.slice(cursor)));
      }

      node.parentNode.replaceChild(frag, node);
    });

    marksRef.current = createdMarks;
    setMatchCount(createdMarks.length);

    if (createdMarks[0]) {
      setActiveMatchIdx(0);
      highlightActiveMark(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-panel" role="dialog" aria-label="Pretraga izvještaja">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="eyebrow">Pretraga dokumenta</span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          aria-label="Zatvori pretragu"
        >
          <X className="w-4 h-4 text-[var(--muted)]" />
        </button>
      </div>

      <div className="relative flex items-center gap-1.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Pronađi pojam u izvještaju (npr. Buka, MF Banka, školarina)..."
            value={query}
            onChange={handleSearch}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && marksRef.current.length > 0) {
                e.preventDefault();
                navigateMatch(e.shiftKey ? -1 : 1);
              }
            }}
            className="w-full text-xs pl-8"
          />
        </div>
        {matchCount !== null && matchCount > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => navigateMatch(-1)}
              className="p-1.5 rounded border border-[var(--line)] hover:bg-[var(--surface-alt)] cursor-pointer"
              aria-label="Prethodno podudaranje"
              title="Prethodno (Shift+Enter)"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigateMatch(1)}
              className="p-1.5 rounded border border-[var(--line)] hover:bg-[var(--surface-alt)] cursor-pointer"
              aria-label="Sljedeće podudaranje"
              title="Sljedeće (Enter)"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="search-status">
        {matchCount === null ? (
          'Unesite najmanje 2 karaktera za trenutno označavanje teksta.'
        ) : matchCount > 0 ? (
          <span className="text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] font-bold">
            Rezultat {activeMatchIdx + 1} / {matchCount} ({matchCount === 1 ? 'podudaranje' : 'podudaranja'}).
          </span>
        ) : (
          <span className="text-[var(--idss-red)] font-bold">Nema pronađenih rezultata.</span>
        )}
      </div>
    </div>
  );
};

