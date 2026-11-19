import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Briefcase,
  X,
  Send,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Minimize2,
} from 'lucide-react';
import { generateLocalCeoReply } from '../lib/ceoKnowledgeEngine';

export type AdvisorFocus = 'strategy' | 'cashflow' | 'legal' | 'growth';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  focus?: AdvisorFocus;
  timestamp: string;
}

interface WorldCeoAdvisorProps {
  harmonizedCash: number;
  harmonizedNetResult: number;
  currentStudents: number;
  resolvedRisksCount: number;
  totalRisksCount: number;
}

const STORAGE_KEY = 'idss_imh_ceo_advisor_history_v2';

const FOCUS_OPTIONS: Array<{ id: AdvisorFocus; label: string }> = [
  { id: 'strategy', label: 'CEO Strategija' },
  { id: 'cashflow', label: 'Cash-Flow & Dug' },
  { id: 'legal', label: 'Pravo & VDR' },
  { id: 'growth', label: 'Upis & Vertikala' },
];

const QUICK_PROMPTS: Array<{ label: string; focus: AdvisorFocus; prompt: string }> = [
  {
    label: 'OPU-IP-850/2023 (Čl. 9 & IDSS Buka 13)',
    focus: 'legal',
    prompt:
      'Analiziraj rizike notarskog ugovora o zakupu OPU-IP-850/2023 (rok 10. u mjesecu, Član 9 direktna izvršnost na imovini IMH i Lamie Kacile, te Član 6.5 zabrana podzakupa za IDSS na Buka 13) i daj akcioni plan za Općinu Centar.',
  },
  {
    label: 'KUIP 04.11.2026. & 4/4 Kartoni potpisa',
    focus: 'legal',
    prompt:
      'Koji su hitni pravni koraci nakon KUIP inspekcije IMH (v.d. Anes Memić, 04.11.2026.), za eliminaciju latentnog rizika IDSS Član 30 (njemački C1) i za usklađivanje sva 4 bankovna kartona potpisa s limitom 2.000 KM?',
  },
  {
    label: 'Prebijanje 93.485 KM & ljeto 2027.',
    focus: 'cashflow',
    prompt:
      'Objasni kako prebijanje obaveze prema osnivaču (93.484,84 KM) sa 184.692 KM potraživanja smanjuje mjesečni odliv sa ~14.460 KM na ~6.670 KM i kako da pripremimo likvidnosnu rezervu za ljeto 2027.',
  },
  {
    label: 'Dopis: Prolazne subvencije KS',
    focus: 'strategy',
    prompt:
      'Napiši kratak, autoritativan dopis roditeljima i upravi koji jasno pojašnjava da IMH naplaćuje punu cijenu cjenovnika i nema nikakve zavisnosti od kantonalnih subvencija, nego ih samo 100% prolazno prosljeđuje roditeljima po uplati Ministarstva KS.',
  },
];

const INITIAL_GREETING: ChatMessage = {
  id: 'ceo-welcome',
  role: 'model',
  focus: 'strategy',
  timestamp: '',
  text:
    'Spreman sam za direktnu izvršnu konsultaciju.\n' +
    'Imam kompletan uvid u **verifikovane bruto bilanse IDSS + IMH na 31.10.2026.** (normalizovani rezultat **+77.490 KM**, gotovina **89.712 KM**, depoziti **65.091 KM**) te svih **92 dokumenta iz USTAVNOG / Legal DD VDR repozitorija** (notarski zakup **OPU-IP-850/2023** do 31.08.2033., KUIP tranzicija **04.11.2026.**, 4/4 bankovni kartoni vs limit **2.000 KM**, Sparkasse zalog, MF mjenice i prolazno pravilo KS subvencija).\n\n' +
    '- Odaberite fokus ili postavite konkretno pitanje ispod za brzu stratešku odluku.',
};

function renderInlineBold(line: string): React.ReactNode[] {
  const segments = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return segments.map((seg, idx) => {
    if (seg.startsWith('**') && seg.endsWith('**') && seg.length > 4) {
      return (
        <strong key={idx} className="font-bold text-[var(--ink)]">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    if (seg.startsWith('`') && seg.endsWith('`') && seg.length > 2) {
      return (
        <code
          key={idx}
          className="px-1 py-0.5 rounded bg-[var(--surface-alt)] border border-[var(--line)] font-mono text-[11px] font-semibold text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]"
        >
          {seg.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{seg}</React.Fragment>;
  });
}

const FormattedMessageText: React.FC<{ text: string; isUser: boolean }> = ({ text, isUser }) => {
  if (isUser) {
    return <p className="m-0 whitespace-pre-wrap break-words leading-relaxed">{text}</p>;
  }

  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 text-[12.5px] leading-relaxed break-words tabular-nums">
      {lines.map((rawLine, idx) => {
        const trimmed = rawLine.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
          const content = trimmed.slice(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] font-bold mt-[1px] select-none">
                •
              </span>
              <span className="flex-1">{renderInlineBold(content)}</span>
            </div>
          );
        }
        return (
          <p key={idx} className="m-0">
            {renderInlineBold(rawLine)}
          </p>
        );
      })}
    </div>
  );
};

export const WorldCeoAdvisor: React.FC<WorldCeoAdvisorProps> = ({
  harmonizedCash,
  harmonizedNetResult,
  currentStudents,
  resolvedRisksCount,
  totalRisksCount,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [focus, setFocus] = useState<AdvisorFocus>('strategy');
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [INITIAL_GREETING];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return [INITIAL_GREETING];
      const valid = parsed.filter(
        (m): m is ChatMessage =>
          m &&
          typeof m === 'object' &&
          typeof m.id === 'string' &&
          (m.role === 'user' || m.role === 'model') &&
          typeof m.text === 'string'
      );
      return valid.length > 0 ? valid.slice(-30) : [INITIAL_GREETING];
    } catch {
      return [INITIAL_GREETING];
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      // Ignore storage quota / private mode failures
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [isOpen, messages.length, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isLoading) {
      setElapsedSec(0);
      return;
    }
    setElapsedSec(0);
    const intervalId = window.setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [isLoading]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (customText?: string, overrideFocus?: AdvisorFocus) => {
      const textToSend = (customText ?? input).trim();
      if (!textToSend || isLoading) return;

      const activeFocus = overrideFocus ?? focus;
      if (overrideFocus) setFocus(overrideFocus);

      setErrorMsg(null);
      if (!customText) setInput('');

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        text: textToSend,
        focus: activeFocus,
        timestamp: new Date().toLocaleTimeString('bs-BA', { hour: '2-digit', minute: '2-digit' }),
      };

      const historySnapshot = messages
        .filter((m) => m.id !== 'ceo-welcome')
        .slice(-12)
        .map((m) => ({ role: m.role, text: m.text }));

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const modelId = `m-${Date.now()}`;
      let modelInserted = false;
      let streamedText = '';

      try {
        const res = await fetch('/api/advisor/ceo-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            message: textToSend,
            focus: activeFocus,
            stream: false,
            history: historySnapshot,
            context: {
              harmonizedCash,
              harmonizedNetResult,
              currentStudents,
              resolvedRisksCount,
              totalRisksCount,
            },
          }),
        });

        const contentType = res.headers.get('content-type') || '';

        // Statički hosting (npr. GitHub Pages) vraća 404/405 na POST /api/* — prebaci na lokalni USTAVNI VDR savjetnički motor
        if (res.status === 404 || res.status === 405 || res.status === 501 || res.status === 502 || res.status === 503) {
          const localReply = generateLocalCeoReply(textToSend, activeFocus, {
            harmonizedCash,
            harmonizedNetResult,
            currentStudents,
            resolvedRisksCount,
            totalRisksCount,
          });
          setMessages((prev) => [
            ...prev,
            {
              id: modelId,
              role: 'model',
              text: localReply,
              focus: activeFocus,
              timestamp: new Date().toLocaleTimeString('bs-BA', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          ]);
          return;
        }

        if (!res.ok || contentType.includes('application/json') || !res.body) {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(
              typeof data?.error === 'string' && data.error
                ? data.error
                : `Server je vratio grešku (${res.status}).`
            );
          }
          const replyText = typeof data?.reply === 'string' ? data.reply.trim() : '';
          if (!replyText) {
            throw new Error('Prazan odgovor od CEO savjetnika.');
          }
          setMessages((prev) => [
            ...prev,
            {
              id: modelId,
              role: 'model',
              text: replyText,
              focus: activeFocus,
              timestamp: new Date().toLocaleTimeString('bs-BA', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          ]);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let sseBuffer = '';

        const processSseEvent = (rawEvent: string) => {
          const lines = rawEvent.split(/\r?\n/);
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const jsonStr = line.slice(5).trim();
            if (!jsonStr) continue;
            let payload: { chunk?: string; error?: string; done?: boolean } | null = null;
            try {
              payload = JSON.parse(jsonStr);
            } catch {
              continue;
            }
            if (!payload) continue;
            if (typeof payload.error === 'string' && payload.error) {
              throw new Error(payload.error);
            }
            if (typeof payload.chunk === 'string' && payload.chunk.length > 0) {
              streamedText += payload.chunk;
              const nowTime = new Date().toLocaleTimeString('bs-BA', {
                hour: '2-digit',
                minute: '2-digit',
              });
              if (!modelInserted) {
                modelInserted = true;
                setMessages((prev) => [
                  ...prev,
                  {
                    id: modelId,
                    role: 'model',
                    text: streamedText,
                    focus: activeFocus,
                    timestamp: nowTime,
                  },
                ]);
              } else {
                const updatedText = streamedText;
                setMessages((prev) =>
                  prev.map((m) => (m.id === modelId ? { ...m, text: updatedText } : m))
                );
              }
            }
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          sseBuffer += decoder.decode(value, { stream: true });
          const events = sseBuffer.split(/\r?\n\r?\n/);
          sseBuffer = events.pop() ?? '';
          for (const evt of events) {
            processSseEvent(evt);
          }
        }
        sseBuffer += decoder.decode();
        if (sseBuffer.trim()) {
          processSseEvent(sseBuffer);
        }

        if (!streamedText.trim()) {
          throw new Error('Prazan odgovor od CEO savjetnika.');
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        // Ako je backend nedostupan (mrežni prekid / statički hosting), posluži verifikovani lokalni odgovor
        const localReply = generateLocalCeoReply(textToSend, activeFocus, {
          harmonizedCash,
          harmonizedNetResult,
          currentStudents,
          resolvedRisksCount,
          totalRisksCount,
        });
        setMessages((prev) => [
          ...prev,
          {
            id: modelId,
            role: 'model',
            text: localReply,
            focus: activeFocus,
            timestamp: new Date().toLocaleTimeString('bs-BA', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      input,
      isLoading,
      focus,
      messages,
      harmonizedCash,
      harmonizedNetResult,
      currentStudents,
      resolvedRisksCount,
      totalRisksCount,
    ]
  );

  const handleReset = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    setErrorMsg(null);
    setMessages([INITIAL_GREETING]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => {
        setCopiedId(null);
        copyTimerRef.current = null;
      }, 2200);
    } catch {
      setErrorMsg('Kopiranje u međumemoriju nije dostupno u ovom pregledniku.');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage();
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[75] no-print flex flex-col items-end">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Otvori Svjetski CEO i Strateški Specijalista savjetnik"
          aria-expanded={false}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--idss-blue)] hover:bg-[#024c83] dark:bg-[var(--idss-cyan)] dark:hover:bg-[#1ab8f0] text-white dark:text-slate-950 font-bold text-xs shadow-lg border border-white/15 dark:border-slate-900/20 flex items-center gap-2.5 transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--idss-cyan)]"
        >
          <Briefcase className="w-4 h-4 shrink-0" />
          <span>Svjetski CEO · Savjetnik</span>
        </button>
      ) : (
        <section
          role="dialog"
          aria-modal="false"
          aria-label="Svjetski CEO i Strateški Specijalista savjetnički panel"
          className="w-[min(430px,calc(100vw-2rem))] h-[min(600px,calc(100vh-5.5rem))] bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--line)] bg-[var(--surface-alt)] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[var(--idss-blue)] text-white flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-extrabold text-[var(--ink)] m-0 leading-tight truncate">
                  Svjetski CEO &amp; Specijalista
                </h2>
                <div className="text-[11px] text-[var(--muted)] truncate">
                  IDSS + IMH · Direktni savjetnik
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                title="Započni novi razgovor"
                aria-label="Resetuj razgovor"
                className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimiziraj u donji desni ugao (Esc)"
                aria-label="Zatvori savjetnički panel"
                className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5 sm:hidden" />
                <X className="w-4 h-4 hidden sm:block" />
              </button>
            </div>
          </div>

          {/* Segmented Focus Controls */}
          <div className="px-3 py-2 border-b border-[var(--line)] bg-[var(--surface)] shrink-0">
            <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-[var(--surface-alt)] border border-[var(--line)]">
              {FOCUS_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFocus(opt.id)}
                  className={`px-1.5 py-1.5 rounded-md text-[10.5px] font-bold transition-colors truncate cursor-pointer ${
                    focus === opt.id
                      ? 'bg-[var(--idss-blue)] text-white dark:bg-[var(--idss-cyan)] dark:text-slate-950 shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                  title={opt.label}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-[var(--muted)] px-0.5 tabular-nums">
              <span>Gotovina: {harmonizedCash.toLocaleString('bs-BA')} KM</span>
              <span>·</span>
              <span>Op. rez.: {harmonizedNetResult.toLocaleString('bs-BA')} KM</span>
              <span>·</span>
              <span>Upis: {currentStudents}</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[var(--paper)]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-xs border ${
                      isUser
                        ? 'bg-[var(--idss-blue)] text-white border-transparent'
                        : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
                    }`}
                  >
                    <FormattedMessageText text={msg.text} isUser={isUser} />
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-[var(--muted)]">
                    <span>{isUser ? 'Direktor' : 'CEO Specijalista'}</span>
                    {msg.timestamp && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{msg.timestamp}</span>
                      </>
                    )}
                    {!isUser && msg.id !== 'ceo-welcome' && (
                      <>
                        <span aria-hidden="true">·</span>
                        <button
                          type="button"
                          onClick={() => void handleCopy(msg.id, msg.text)}
                          className="inline-flex items-center gap-1 hover:text-[var(--idss-blue)] dark:hover:text-[var(--idss-cyan)] cursor-pointer font-semibold"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-[var(--imh-green)]" />
                              <span className="text-[var(--imh-green)]">Kopirano</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Kopiraj</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start">
                <div className="rounded-xl px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--muted)] flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] shrink-0" />
                  <span className="tabular-nums">
                    Analiziram podatke IDSS + IMH i pripremam izvršni savjet...
                    {elapsedSec > 0 ? ` (${elapsedSec}s)` : ''}
                  </span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-[11px] text-rose-800 dark:text-rose-200 flex items-start gap-2"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span className="flex-1">{errorMsg}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Executive Prompts */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-3 py-2 border-t border-[var(--line)] bg-[var(--surface-alt)] flex flex-wrap gap-1.5 shrink-0">
              {QUICK_PROMPTS.map((qp) => (
                <button
                  key={qp.label}
                  type="button"
                  onClick={() => void sendMessage(qp.prompt, qp.focus)}
                  className="px-2.5 py-1 rounded-md border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--idss-blue)] dark:hover:border-[var(--idss-cyan)] text-[11px] font-semibold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Composer */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 border-t border-[var(--line)] bg-[var(--surface)] flex items-end gap-2 shrink-0"
          >
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Postavite strateško, finansijsko ili pravno pitanje..."
              aria-label="Pitanje za Svjetskog CEO savjetnika"
              maxLength={2500}
              disabled={isLoading}
              className="flex-1 resize-none rounded-xl border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] px-3 py-2 text-xs outline-none focus:border-[var(--idss-blue)] dark:focus:border-[var(--idss-cyan)] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Pošalji pitanje"
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[var(--idss-blue)] hover:bg-[#024c83] dark:bg-[var(--idss-cyan)] dark:hover:bg-[#1ab8f0] text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pošalji</span>
            </button>
          </form>
        </section>
      )}
    </div>
  );
};
