import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const marksRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      clearMarks();
      setQuery('');
      setMatchCount(null);
    }
  }, [isOpen]);

  const clearMarks = () => {
    marksRef.current.forEach((m) => {
      const parent = m.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(m.textContent || ''), m);
        parent.normalize();
      }
    });
    marksRef.current = [];
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    clearMarks();

    const q = val.trim();
    if (q.length < 2) {
      setMatchCount(null);
      return;
    }

    const docRoot = document.querySelector('.document');
    if (!docRoot) return;

    const walker = document.createTreeWalker(docRoot, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        if (!n.parentElement) return NodeFilter.FILTER_REJECT;
        const tag = n.parentElement.tagName;
        if (['SCRIPT', 'STYLE', 'MARK', 'BUTTON', 'INPUT'].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (n.nodeValue && n.nodeValue.toLowerCase().includes(q.toLowerCase())) {
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
      const idx = lower.indexOf(q.toLowerCase());
      if (idx < 0 || !node.parentNode) return;

      const frag = document.createDocumentFragment();
      frag.append(document.createTextNode(text.slice(0, idx)));

      const mark = document.createElement('mark');
      mark.textContent = text.slice(idx, idx + q.length);
      frag.append(mark);

      frag.append(document.createTextNode(text.slice(idx + q.length)));
      node.parentNode.replaceChild(frag, node);
      createdMarks.push(mark);
    });

    marksRef.current = createdMarks;
    setMatchCount(createdMarks.length);

    if (createdMarks[0]) {
      createdMarks[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-panel" role="dialog" aria-label="Pretraga izvještaja">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="eyebrow">Pretraga dokumenta</span>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          aria-label="Zatvori pretragu"
        >
          <X className="w-4 h-4 text-[var(--muted)]" />
        </button>
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          placeholder="Pronađi pojam u izvještaju (npr. Buka, MF Banka, školarina)..."
          value={query}
          onChange={handleSearch}
          className="w-full text-xs"
        />
      </div>

      <div className="search-status">
        {matchCount === null ? (
          'Unesite najmanje 2 karaktera za trenutno označavanje teksta.'
        ) : matchCount > 0 ? (
          <span className="text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] font-bold">
            Pronađeno {matchCount} {matchCount === 1 ? 'podudaranje' : 'podudaranja'}.
          </span>
        ) : (
          <span className="text-[var(--idss-red)] font-bold">Nema pronađenih rezultata.</span>
        )}
      </div>
    </div>
  );
};
