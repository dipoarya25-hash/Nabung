import React, { useState, useEffect, useMemo } from "react";
import { Sun, Moon, Monitor, Palette, Plus, X, Trash2, Settings, ArrowUpRight, ArrowDownRight, Pencil, Check, Search, TrendingUp, TrendingDown, Minus, LayoutDashboard, Receipt, Tag, ChevronRight } from "lucide-react";

const WALLET_COLORS = ["#B4872E", "#3E7D57", "#A6493A", "#3E5C76", "#6B4C6B", "#2E7D77"];
const EXPENSE_CATEGORIES = ["Jajan", "Makan", "Transport", "Nabung", "Hiburan", "Lainnya"];
const INCOME_CATEGORIES = ["Uang Saku", "Hadiah", "Bonus", "Lainnya"];
const STORAGE_KEY = "kas-jajan-data-v1";

const ACCENT_PRESETS = [
  { key: "gold", label: "Emas", light: "#B4872E", dark: "#E8B44A" },
  { key: "forest", label: "Hijau", light: "#2F8F5B", dark: "#5CE3A0" },
  { key: "clay", label: "Bata", light: "#C1503E", dark: "#FF8567" },
  { key: "denim", label: "Biru", light: "#3E6FA0", dark: "#6FB2FF" },
  { key: "plum", label: "Ungu", light: "#7A4FA0", dark: "#C48CFF" },
  { key: "teal", label: "Teal", light: "#1E8F8A", dark: "#4FE0D6" },
];
const DEFAULT_ACCENT_KEY = "gold";
const QUICK_AMOUNTS = [2000, 5000, 10000, 15000, 20000, 50000];
const TABS = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { key: "transaksi", label: "Transaksi", Icon: Receipt },
  { key: "kategori", label: "Kategori", Icon: Tag },
  { key: "setting", label: "Setting", Icon: Settings },
];

const LIGHT = {
  bg: "#EEF1F6", surface: "#FFFFFF", surface2: "#F3F5F9", border: "#D9DEE7",
  text: "#10151C", muted: "#5E6B7D", income: "#1E9E63", expense: "#D6483A",
};
const DARK = {
  bg: "#0A0D12", surface: "#10141C", surface2: "#151A24", border: "#232A38",
  text: "#E9EDF3", muted: "#7C879B", income: "#4FDB9C", expense: "#FF6B5E",
};

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.kj-root { background: var(--bg); color: var(--text); font-family: var(--font-body); position: relative; }
.kj-root::before {
  content: "";
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background-image: radial-gradient(var(--grid-dot) 1px, transparent 1px);
  background-size: 22px 22px;
}
.kj-card { background: var(--surface); border: 1px solid var(--border); }
.kj-muted { color: var(--muted); }
.kj-mono { font-variant-numeric: tabular-nums; }
.kj-focus:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.kj-ticket { position: relative; overflow: visible; }
.kj-ticket .kj-perforation { position: absolute; top: 0; bottom: 0; right: 56px; border-left: 2px dashed var(--border); }
.kj-ticket .kj-notch { position: absolute; right: 48px; width: 14px; height: 14px; border-radius: 9999px; background: var(--bg); border: 1px solid var(--border); }
.kj-ticket .kj-notch.top { top: -7px; }
.kj-ticket .kj-notch.bottom { bottom: -7px; }
.kj-ticket .kj-notch::after { content: ""; position: absolute; inset: 4px; border-radius: 9999px; background: var(--notch-dot); }
.kj-navbar { position: sticky; top: 0; z-index: 30; background: var(--bg-translucent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); }
.kj-navbar::after { content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px; background: linear-gradient(90deg, transparent, var(--accent-line), transparent); opacity: 0.6; }
.kj-fade { transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, box-shadow 180ms ease; }
.kj-seg { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; padding: 4px; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; }
.kj-seg-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 10px 4px; border-radius: 9px; font-size: 11px; color: var(--muted); }
.kj-seg-btn.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 2px rgba(0,0,0,0.08), 0 0 0 1px var(--accent-line); }
.kj-swatch { width: 100%; aspect-ratio: 1; border-radius: 9999px; display: flex; align-items: center; justify-content: center; }
.kj-press { transition: transform 120ms ease; }
.kj-press:active { transform: scale(0.96); }
.kj-toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 60; }
.kj-toast-enter { animation: kj-toast-in 220ms ease; }
@keyframes kj-toast-in { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
.kj-bar-track { display: block; background: var(--surface2); border-radius: 9999px; overflow: hidden; height: 6px; }
.kj-bar-fill { display: block; height: 100%; border-radius: 9999px; transition: width 420ms ease; }
.kj-row-enter { animation: kj-row-in 220ms ease; }
@keyframes kj-row-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
.kj-holo { position: relative; }
.kj-holo::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: linear-gradient(115deg, transparent 30%, var(--accent-line) 48%, transparent 66%);
  background-size: 220% 220%; background-position: 130% 0%;
  transition: background-position 700ms ease;
  opacity: 0;
}
.kj-holo.active::before { opacity: 1; background-position: -30% 0%; }
.kj-corner { position: absolute; width: 12px; height: 12px; border: 2px solid var(--accent); opacity: 0; transition: opacity 200ms ease; pointer-events: none; }
.kj-holo.active .kj-corner { opacity: 0.9; }
.kj-corner.tl { top: -1px; left: -1px; border-right: none; border-bottom: none; border-top-left-radius: 6px; }
.kj-corner.br { bottom: -1px; right: -1px; border-left: none; border-top: none; border-bottom-right-radius: 6px; }
.kj-glass { background: var(--glass-surface); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
.kj-overlay { backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); }
.kj-bottomnav { position: fixed; left: 0; right: 0; bottom: 0; z-index: 40; background: var(--bg-translucent); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-top: 1px solid var(--border); }
.kj-bottomnav-inner { position: relative; max-width: 448px; margin: 0 auto; display: flex; }
.kj-navindicator { position: absolute; top: 0; left: 0; height: 2px; width: 25%; background: var(--accent); box-shadow: 0 0 10px var(--accent-line); transition: transform 320ms cubic-bezier(0.4, 0, 0.2, 1); }
.kj-navitem { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; padding: 9px 0 calc(7px + env(safe-area-inset-bottom, 0px)); color: var(--muted); transition: color 200ms ease, transform 150ms ease; }
.kj-navitem.active { color: var(--accent); }
.kj-navitem:active { transform: scale(0.92); }
.kj-navitem .kj-navicon { transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1); }
.kj-navitem.active .kj-navicon { transform: translateY(-1px); }
.kj-tab-panel { animation: kj-tab-in 260ms cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes kj-tab-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.kj-settrow { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; padding: 14px; }
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
`;

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "id-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
}

function todayISO() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function formatRupiah(n) {
  return "Rp" + Math.round(n || 0).toLocaleString("id-ID");
}

function hexToRgba(hex, alpha) {
  const h = (hex || "#000000").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function parseDigits(str) {
  return (str || "").replace(/[^\d]/g, "");
}

function formatDigitsDisplay(digits) {
  if (!digits) return "";
  return Number(digits).toLocaleString("id-ID");
}

function formatDateLabel(iso) {
  try {
    const d = new Date(iso + "T00:00:00");
    return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);
  } catch (e) {
    return iso;
  }
}

function seedWallets() {
  return [{ id: uid(), name: "Dompet Utama", startingBalance: 0, color: WALLET_COLORS[0] }];
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [themeMode, setThemeMode] = useState("light"); // "light" | "dark" | "system"
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [accentKey, setAccentKey] = useState(DEFAULT_ACCENT_KEY);
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeWalletId, setActiveWalletId] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyCategory, setHistoryCategory] = useState("all");

  const [showTxModal, setShowTxModal] = useState(false);
  const [txType, setTxType] = useState("expense");
  const [txAmountRaw, setTxAmountRaw] = useState("");
  const [txCategory, setTxCategory] = useState("");
  const [txNote, setTxNote] = useState("");
  const [txDate, setTxDate] = useState(todayISO());
  const [txWalletId, setTxWalletId] = useState("");
  const [confirmTxId, setConfirmTxId] = useState(null);

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState(null);
  const [editingWalletName, setEditingWalletName] = useState("");
  const [confirmDeleteWalletId, setConfirmDeleteWalletId] = useState(null);
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalanceRaw, setNewWalletBalanceRaw] = useState("");
  const [newWalletColor, setNewWalletColor] = useState(WALLET_COLORS[0]);

  useEffect(() => {
    let data = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) data = JSON.parse(raw);
    } catch (e) {
      data = null;
    }
    if (data && Array.isArray(data.wallets) && data.wallets.length > 0) {
      setWallets(data.wallets);
      setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
      const mode = data.themeMode || (data.theme === "dark" ? "dark" : data.theme === "light" ? "light" : "system");
      setThemeMode(mode);
      setAccentKey(ACCENT_PRESETS.some((p) => p.key === data.accentKey) ? data.accentKey : DEFAULT_ACCENT_KEY);
      setActiveWalletId(data.activeWalletId || data.wallets[0].id);
    } else {
      const w = seedWallets();
      setWallets(w);
      setActiveWalletId(w[0].id);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPrefersDark(mq.matches);
    const handler = (e) => setSystemPrefersDark(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const data = { wallets, transactions, themeMode, accentKey, activeWalletId };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }, [wallets, transactions, themeMode, accentKey, activeWalletId, loaded]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    setHistoryCategory("all");
    setHistoryQuery("");
  }, [activeWalletId]);

  function notify(message) {
    setToast({ id: Date.now(), message });
  }

  const resolvedTheme = themeMode === "system" ? (systemPrefersDark ? "dark" : "light") : themeMode;
  const activeAccentPreset = ACCENT_PRESETS.find((p) => p.key === accentKey) || ACCENT_PRESETS[0];
  const colors = { ...(resolvedTheme === "dark" ? DARK : LIGHT), accent: resolvedTheme === "dark" ? activeAccentPreset.dark : activeAccentPreset.light };
  const onFillText = resolvedTheme === "dark" ? "#181611" : "#FFFFFF";

  function walletBalance(walletId) {
    const w = wallets.find((x) => x.id === walletId);
    if (!w) return 0;
    const sum = transactions.reduce((acc, t) => {
      if (t.walletId !== walletId) return acc;
      return acc + (t.type === "income" ? t.amount : -t.amount);
    }, 0);
    return w.startingBalance + sum;
  }

  const totalBalance = useMemo(() => wallets.reduce((acc, w) => acc + walletBalance(w.id), 0), [wallets, transactions]);
  const heroBalance = activeWalletId === "all" ? totalBalance : walletBalance(activeWalletId);
  const heroLabel = activeWalletId === "all" ? "Semua Dompet" : (wallets.find((w) => w.id === activeWalletId)?.name || "");

  const currentMonth = todayISO().slice(0, 7);
  const monthTx = transactions.filter((t) => {
    if (activeWalletId !== "all" && t.walletId !== activeWalletId) return false;
    return t.date.slice(0, 7) === currentMonth;
  });
  const monthIncome = monthTx.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const monthExpense = monthTx.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);

  const prevMonthDate = new Date(currentMonth + "-01T00:00:00");
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  const prevMonth = prevMonthDate.toISOString().slice(0, 7);
  const prevMonthExpense = transactions
    .filter((t) => (activeWalletId === "all" || t.walletId === activeWalletId) && t.date.slice(0, 7) === prevMonth && t.type === "expense")
    .reduce((a, t) => a + t.amount, 0);
  const expenseChangePct = prevMonthExpense > 0 ? Math.round(((monthExpense - prevMonthExpense) / prevMonthExpense) * 100) : null;

  const categoryBreakdown = useMemo(() => {
    const map = {};
    monthTx.filter((t) => t.type === "expense").forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const max = entries.length ? entries[0][1] : 0;
    return entries.map(([category, amount], idx) => ({
      category, amount, pct: max ? Math.round((amount / max) * 100) : 0, opacity: [1, 0.78, 0.58, 0.42][idx] || 0.42,
    }));
  }, [monthTx]);

  const recentTx = useMemo(() => {
    const base = activeWalletId === "all" ? transactions : transactions.filter((t) => t.walletId === activeWalletId);
    return [...base].sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : b.date.localeCompare(a.date))).slice(0, 3);
  }, [transactions, activeWalletId]);

  const fullCategoryBreakdown = useMemo(() => {
    const map = {};
    monthTx.filter((t) => t.type === "expense").forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const max = entries.length ? entries[0][1] : 0;
    const total = entries.reduce((a, [, v]) => a + v, 0);
    return entries.map(([category, amount]) => ({
      category, amount, pct: max ? Math.round((amount / max) * 100) : 0, share: total ? Math.round((amount / total) * 100) : 0,
    }));
  }, [monthTx]);

  const incomeCategoryBreakdown = useMemo(() => {
    const map = {};
    monthTx.filter((t) => t.type === "income").forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const max = entries.length ? entries[0][1] : 0;
    return entries.map(([category, amount]) => ({ category, amount, pct: max ? Math.round((amount / max) * 100) : 0 }));
  }, [monthTx]);

  const historyCategories = useMemo(() => {
    const base = activeWalletId === "all" ? transactions : transactions.filter((t) => t.walletId === activeWalletId);
    return Array.from(new Set(base.map((t) => t.category)));
  }, [transactions, activeWalletId]);

  const filteredTx = useMemo(() => {
    let list = activeWalletId === "all" ? transactions : transactions.filter((t) => t.walletId === activeWalletId);
    if (historyCategory !== "all") list = list.filter((t) => t.category === historyCategory);
    const q = historyQuery.trim().toLowerCase();
    if (q) list = list.filter((t) => t.category.toLowerCase().includes(q) || (t.note || "").toLowerCase().includes(q));
    return [...list].sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : b.date.localeCompare(a.date)));
  }, [transactions, activeWalletId, historyCategory, historyQuery]);

  const grouped = useMemo(() => {
    const map = {};
    filteredTx.forEach((t) => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });
    return Object.keys(map).sort((a, b) => b.localeCompare(a)).map((date) => ({ date, items: map[date] }));
  }, [filteredTx]);

  function walletName(id) {
    return wallets.find((w) => w.id === id)?.name || "";
  }

  function openTxModal(type) {
    setTxType(type);
    setTxAmountRaw("");
    setTxCategory("");
    setTxNote("");
    setTxDate(todayISO());
    setTxWalletId(activeWalletId !== "all" ? activeWalletId : wallets[0]?.id || "");
    setShowTxModal(true);
  }

  function saveTransaction() {
    const amount = parseInt(txAmountRaw || "0", 10);
    if (!amount || amount <= 0 || !txCategory || !txWalletId) return;
    const newTx = { id: uid(), walletId: txWalletId, type: txType, amount, category: txCategory, note: txNote.trim(), date: txDate, createdAt: Date.now() };
    setTransactions((prev) => [...prev, newTx]);
    setShowTxModal(false);
    notify(txType === "income" ? "Pemasukan tersimpan" : "Pengeluaran tersimpan");
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setConfirmTxId(null);
    notify("Transaksi dihapus");
  }

  function openWalletModal() {
    setNewWalletName("");
    setNewWalletBalanceRaw("");
    setNewWalletColor(WALLET_COLORS[wallets.length % WALLET_COLORS.length]);
    setEditingWalletId(null);
    setConfirmDeleteWalletId(null);
    setShowWalletModal(true);
  }

  function addWallet() {
    if (!newWalletName.trim()) return;
    const w = { id: uid(), name: newWalletName.trim(), startingBalance: parseInt(newWalletBalanceRaw || "0", 10), color: newWalletColor };
    setWallets((prev) => [...prev, w]);
    setActiveWalletId(w.id);
    setNewWalletName("");
    setNewWalletBalanceRaw("");
    setNewWalletColor(WALLET_COLORS[(wallets.length + 1) % WALLET_COLORS.length]);
    notify(`Dompet "${w.name}" dibuat`);
  }

  function startEditWallet(w) {
    setEditingWalletId(w.id);
    setEditingWalletName(w.name);
  }

  function confirmEditWallet() {
    if (!editingWalletName.trim()) return;
    setWallets((prev) => prev.map((w) => (w.id === editingWalletId ? { ...w, name: editingWalletName.trim() } : w)));
    setEditingWalletId(null);
    notify("Nama dompet diperbarui");
  }

  function deleteWallet(id) {
    if (wallets.length <= 1) return;
    setWallets((prev) => prev.filter((w) => w.id !== id));
    setTransactions((prev) => prev.filter((t) => t.walletId !== id));
    if (activeWalletId === id) setActiveWalletId("all");
    setConfirmDeleteWalletId(null);
    notify("Dompet dihapus");
  }

  const cssVars = {
    "--bg": colors.bg, "--surface": colors.surface, "--surface2": colors.surface2, "--border": colors.border,
    "--text": colors.text, "--muted": colors.muted, "--accent": colors.accent, "--income": colors.income, "--expense": colors.expense,
    "--font-body": "'IBM Plex Sans', sans-serif",
    "--grid-dot": resolvedTheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(16,21,28,0.05)",
    "--bg-translucent": resolvedTheme === "dark" ? hexToRgba(colors.bg, 0.72) : hexToRgba(colors.bg, 0.78),
    "--accent-line": hexToRgba(colors.accent, resolvedTheme === "dark" ? 0.55 : 0.4),
    "--notch-dot": hexToRgba(colors.accent, 0.9),
    "--glass-surface": resolvedTheme === "dark" ? hexToRgba(colors.surface, 0.7) : hexToRgba(colors.surface, 0.86),
  };

  if (!loaded) {
    return (
      <div className="kj-root min-h-screen flex items-center justify-center" style={cssVars}>
        <style>{FONT_CSS}</style>
        <p className="text-sm kj-muted">Memuat...</p>
      </div>
    );
  }

  const txValid = parseInt(txAmountRaw || "0", 10) > 0 && !!txCategory && !!txWalletId;
  const categories = txType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const typeColor = txType === "income" ? "var(--income)" : "var(--expense)";

  return (
    <div className="kj-root kj-fade min-h-screen" style={cssVars}>
      <style>{FONT_CSS}</style>

      <div className="kj-navbar kj-fade">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--accent)", color: onFillText, boxShadow: `0 0 0 1px ${hexToRgba(colors.accent, 0.5)}, 0 0 14px ${hexToRgba(colors.accent, resolvedTheme === "dark" ? 0.55 : 0.3)}` }}
            >
              <span className="text-xs font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>K</span>
            </span>
            <h1 className="text-lg font-semibold leading-none tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Kas Jajan</h1>
          </div>
          <span className="text-xs font-medium kj-muted">{TABS.find((t) => t.key === activeTab)?.label}</span>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-5" style={{ paddingBottom: "calc(88px + env(safe-area-inset-bottom, 0px))" }}>
      <div key={activeTab} className="kj-tab-panel">
      {activeTab === "dashboard" && (
      <>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wide kj-muted">Dompet</span>
          <button onClick={openWalletModal} className="kj-focus flex items-center gap-1 text-xs kj-muted">
            <Settings size={12} /> Kelola
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveWalletId("all")}
            className="kj-card kj-focus kj-fade flex-shrink-0 w-40 h-24 rounded-xl p-3 flex flex-col justify-between text-left"
            style={{
              border: activeWalletId === "all" ? "1px solid var(--accent)" : "1px solid var(--border)",
              boxShadow: activeWalletId === "all" ? `0 0 0 1px ${hexToRgba(colors.accent, 0.25)}, 0 0 16px ${hexToRgba(colors.accent, resolvedTheme === "dark" ? 0.28 : 0.14)}` : "none",
            }}
          >
            <span className="text-xs uppercase tracking-wide kj-muted">Semua Dompet</span>
            <span className="kj-mono text-base font-medium" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatRupiah(totalBalance)}</span>
          </button>

          {wallets.map((w) => (
            <button
              key={w.id}
              onClick={() => setActiveWalletId(w.id)}
              className={"kj-ticket kj-holo kj-card kj-focus kj-fade flex-shrink-0 w-60 h-24 rounded-xl flex items-stretch text-left" + (activeWalletId === w.id ? " active" : "")}
              style={{
                border: activeWalletId === w.id ? "1px solid var(--accent)" : "1px solid var(--border)",
                boxShadow: activeWalletId === w.id ? `0 0 0 1px ${hexToRgba(colors.accent, 0.25)}, 0 0 16px ${hexToRgba(colors.accent, resolvedTheme === "dark" ? 0.28 : 0.14)}` : "none",
              }}
            >
              <span className="kj-corner tl" />
              <span className="kj-corner br" />
              <span className="kj-perforation" />
              <span className="kj-notch top" />
              <span className="kj-notch bottom" />
              <span className="flex-1 p-3 flex flex-col justify-between min-w-0">
                <span className="text-xs uppercase tracking-wide kj-muted truncate">{w.name}</span>
                <span className="kj-mono text-base font-medium" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatRupiah(walletBalance(w.id))}</span>
              </span>
              <span className="w-14 flex items-center justify-center flex-shrink-0">
                <span className="w-8 h-8 rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm font-semibold" style={{ background: w.color, color: "#fff" }}>
                  <span style={{ fontSize: "13px", lineHeight: 1 }}>{w.name.charAt(0).toUpperCase()}</span>
                  <span style={{ width: "16px", height: "2px", background: "rgba(255,255,255,0.55)", borderRadius: "1px" }} />
                </span>
              </span>
            </button>
          ))}

          <button
            onClick={openWalletModal}
            className="kj-focus flex-shrink-0 w-24 h-24 rounded-xl flex flex-col items-center justify-center gap-1"
            style={{ border: "1px dashed var(--border)", color: "var(--muted)" }}
          >
            <Plus size={18} />
            <span className="text-xs">Dompet Baru</span>
          </button>
        </div>

        <div
          className="kj-card kj-fade rounded-2xl p-5 mt-4"
          style={{
            backgroundImage: resolvedTheme === "dark" ? `radial-gradient(120% 140% at 100% 0%, ${hexToRgba(colors.accent, 0.1)}, transparent 60%)` : "none",
          }}
        >
          <p className="text-xs uppercase tracking-wide kj-muted mb-1">{heroLabel}</p>
          <p className="text-4xl font-semibold mb-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{formatRupiah(heroBalance)}</p>
          <div className="flex gap-4 pt-3" style={{ borderTop: "1px dashed var(--border)" }}>
            <div className="flex-1">
              <p className="text-xs kj-muted mb-0.5">Pemasukan bulan ini</p>
              <p className="kj-mono text-sm font-medium" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--income)" }}>{formatRupiah(monthIncome)}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs kj-muted mb-0.5">Pengeluaran bulan ini</p>
              <p className="kj-mono text-sm font-medium" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--expense)" }}>{formatRupiah(monthExpense)}</p>
            </div>
          </div>

          {expenseChangePct !== null && (
            <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop: "1px dashed var(--border)" }}>
              {expenseChangePct > 0 ? <TrendingUp size={13} color={colors.expense} /> : expenseChangePct < 0 ? <TrendingDown size={13} color={colors.income} /> : <Minus size={13} className="kj-muted" />}
              <p className="text-xs kj-muted">
                Pengeluaran {expenseChangePct === 0 ? "sama dengan" : expenseChangePct > 0 ? `naik ${expenseChangePct}%` : `turun ${Math.abs(expenseChangePct)}%`} dari bulan lalu
              </p>
            </div>
          )}

          {categoryBreakdown.length > 0 && (
            <div className="mt-3 pt-3" style={{ borderTop: "1px dashed var(--border)" }}>
              <p className="text-xs kj-muted mb-2">Kategori teratas bulan ini</p>
              <div className="flex flex-col gap-2">
                {categoryBreakdown.map((c) => (
                  <div key={c.category} className="flex items-center gap-2">
                    <span className="text-xs w-20 truncate flex-shrink-0">{c.category}</span>
                    <span className="kj-bar-track flex-1">
                      <span className="kj-bar-fill" style={{ width: c.pct + "%", background: colors.expense, opacity: c.opacity, boxShadow: resolvedTheme === "dark" ? `0 0 8px ${hexToRgba(colors.expense, 0.5)}` : "none" }} />
                    </span>
                    <span className="kj-mono text-xs kj-muted flex-shrink-0" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatRupiah(c.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => openTxModal("income")}
            className="kj-focus kj-press kj-fade flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
            style={{ border: "1px solid var(--income)", color: "var(--income)", boxShadow: resolvedTheme === "dark" ? `0 0 14px ${hexToRgba(colors.income, 0.18)}` : "none" }}
          >
            <Plus size={14} /> Pemasukan
          </button>
          <button
            onClick={() => openTxModal("expense")}
            className="kj-focus kj-press kj-fade flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
            style={{ border: "1px solid var(--expense)", color: "var(--expense)", boxShadow: resolvedTheme === "dark" ? `0 0 14px ${hexToRgba(colors.expense, 0.18)}` : "none" }}
          >
            <Plus size={14} /> Pengeluaran
          </button>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wide kj-muted">Transaksi Terbaru</span>
            {transactions.length > 0 && (
              <button onClick={() => setActiveTab("transaksi")} className="kj-focus kj-fade flex items-center gap-0.5 text-xs" style={{ color: "var(--accent)" }}>
                Lihat semua <ChevronRight size={13} />
              </button>
            )}
          </div>
          {recentTx.length === 0 ? (
            <div className="kj-card rounded-xl p-6 text-center">
              <p className="text-sm kj-muted">Belum ada transaksi di sini. Ketuk salah satu tombol di atas untuk mulai mencatat.</p>
            </div>
          ) : (
            <div className="kj-card rounded-xl px-3">
              {recentTx.map((t, idx) => (
                <div key={t.id} className="flex items-center gap-3 py-3" style={idx < recentTx.length - 1 ? { borderBottom: "1px dashed var(--border)" } : undefined}>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: t.type === "income" ? "rgba(63,125,87,0.14)" : "rgba(166,73,58,0.14)" }}>
                    {t.type === "income" ? <ArrowUpRight size={15} color={colors.income} /> : <ArrowDownRight size={15} color={colors.expense} />}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm truncate">{t.category}{t.note ? ` · ${t.note}` : ""}</span>
                    <span className="block text-xs kj-muted capitalize">{formatDateLabel(t.date)}</span>
                  </span>
                  <span className="kj-mono text-sm font-medium flex-shrink-0" style={{ fontFamily: "'IBM Plex Mono', monospace", color: t.type === "income" ? "var(--income)" : "var(--expense)" }}>
                    {t.type === "income" ? "+" : "-"}{formatRupiah(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
      )}

      {activeTab === "transaksi" && (
      <>
        <div className="mt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wide kj-muted">Riwayat</span>
            <span className="text-xs kj-muted">{filteredTx.length} transaksi</span>
          </div>

          {historyCategories.length > 0 && (
            <>
              <div className="rounded-lg mb-3 flex items-center gap-2 px-3 py-2" style={{ border: "1px solid var(--border)", background: "var(--surface2)" }}>
                <Search size={14} className="kj-muted flex-shrink-0" />
                <input
                  value={historyQuery}
                  onChange={(e) => setHistoryQuery(e.target.value)}
                  placeholder="Cari kategori atau catatan"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: "var(--text)" }}
                />
                {historyQuery && (
                  <button onClick={() => setHistoryQuery("")} aria-label="Hapus pencarian" className="kj-focus kj-muted flex-shrink-0"><X size={14} /></button>
                )}
              </div>

              {historyCategories.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
                  <button
                    onClick={() => setHistoryCategory("all")}
                    className="kj-focus kj-fade kj-chip text-xs px-3 py-1.5 flex-shrink-0"
                    style={historyCategory === "all" ? { border: "1px solid var(--text)", color: "var(--text)" } : { border: "1px solid var(--border)", color: "var(--muted)" }}
                  >
                    Semua
                  </button>
                  {historyCategories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setHistoryCategory(c)}
                      className="kj-focus kj-fade kj-chip text-xs px-3 py-1.5 flex-shrink-0"
                      style={historyCategory === c ? { border: "1px solid var(--text)", color: "var(--text)" } : { border: "1px solid var(--border)", color: "var(--muted)" }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {grouped.length === 0 && (
            <div className="kj-card rounded-xl p-6 text-center">
              {historyQuery || historyCategory !== "all" ? (
                <>
                  <p className="text-sm font-medium mb-1">Tidak ditemukan</p>
                  <p className="text-xs kj-muted">Coba kata kunci lain atau ganti filter kategori.</p>
                </>
              ) : (
                <p className="text-sm kj-muted">Belum ada transaksi di sini. Ketuk salah satu tombol di atas untuk mulai mencatat.</p>
              )}
            </div>
          )}

          {grouped.map((group) => (
            <div key={group.date} className="mb-4">
              <p className="text-xs kj-muted mb-1 capitalize">{formatDateLabel(group.date)}</p>
              <div className="kj-card rounded-xl px-3">
                {group.items.map((t, idx) => (
                  <div key={t.id} className="kj-row-enter">
                    {confirmTxId === t.id ? (
                      <div className="flex items-center justify-between py-3" style={idx < group.items.length - 1 ? { borderBottom: "1px dashed var(--border)" } : undefined}>
                        <span className="text-sm">Hapus transaksi ini?</span>
                        <div className="flex gap-2">
                          <button onClick={() => setConfirmTxId(null)} className="text-xs px-2 py-1 rounded kj-muted">Batal</button>
                          <button onClick={() => deleteTransaction(t.id)} className="text-xs px-2 py-1 rounded" style={{ color: "var(--expense)" }}>Hapus</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 py-3" style={idx < group.items.length - 1 ? { borderBottom: "1px dashed var(--border)" } : undefined}>
                        <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: t.type === "income" ? "rgba(63,125,87,0.14)" : "rgba(166,73,58,0.14)" }}>
                          {t.type === "income" ? <ArrowUpRight size={15} color={colors.income} /> : <ArrowDownRight size={15} color={colors.expense} />}
                        </span>
                        <span className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{t.category}</p>
                          {t.note ? <p className="text-xs kj-muted truncate">{t.note}</p> : null}
                          {activeWalletId === "all" ? <p className="text-xs kj-muted truncate">{walletName(t.walletId)}</p> : null}
                        </span>
                        <span className="kj-mono text-sm font-medium flex-shrink-0" style={{ fontFamily: "'IBM Plex Mono', monospace", color: t.type === "income" ? "var(--income)" : "var(--expense)" }}>
                          {t.type === "income" ? "+" : "-"}{formatRupiah(t.amount)}
                        </span>
                        <button onClick={() => setConfirmTxId(t.id)} aria-label="Hapus transaksi" className="kj-focus flex-shrink-0 p-1 kj-muted">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
      )}

      {activeTab === "kategori" && (
      <>
        <div className="mt-1">
          <p className="text-xs uppercase tracking-wide kj-muted mb-1">Bulan Ini · {heroLabel}</p>
          <div className="flex gap-4 kj-card rounded-xl p-4 mb-5">
            <div className="flex-1">
              <p className="text-xs kj-muted mb-0.5">Pemasukan</p>
              <p className="kj-mono text-base font-medium" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--income)" }}>{formatRupiah(monthIncome)}</p>
            </div>
            <div className="flex-1" style={{ borderLeft: "1px dashed var(--border)", paddingLeft: "16px" }}>
              <p className="text-xs kj-muted mb-0.5">Pengeluaran</p>
              <p className="kj-mono text-base font-medium" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--expense)" }}>{formatRupiah(monthExpense)}</p>
            </div>
          </div>

          <p className="text-xs uppercase tracking-wide kj-muted mb-2">Pengeluaran per Kategori</p>
          {fullCategoryBreakdown.length === 0 ? (
            <div className="kj-card rounded-xl p-6 text-center mb-5">
              <p className="text-sm kj-muted">Belum ada pengeluaran bulan ini.</p>
            </div>
          ) : (
            <div className="kj-card rounded-xl p-4 mb-5 flex flex-col gap-3">
              {fullCategoryBreakdown.map((c) => (
                <div key={c.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{c.category}</span>
                    <span className="kj-mono text-xs kj-muted" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatRupiah(c.amount)} · {c.share}%</span>
                  </div>
                  <span className="kj-bar-track">
                    <span className="kj-bar-fill" style={{ width: c.pct + "%", background: colors.expense, boxShadow: resolvedTheme === "dark" ? `0 0 8px ${hexToRgba(colors.expense, 0.5)}` : "none" }} />
                  </span>
                </div>
              ))}
            </div>
          )}

          {incomeCategoryBreakdown.length > 0 && (
            <>
              <p className="text-xs uppercase tracking-wide kj-muted mb-2">Pemasukan per Kategori</p>
              <div className="kj-card rounded-xl p-4 flex flex-col gap-3">
                {incomeCategoryBreakdown.map((c) => (
                  <div key={c.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{c.category}</span>
                      <span className="kj-mono text-xs kj-muted" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatRupiah(c.amount)}</span>
                    </div>
                    <span className="kj-bar-track">
                      <span className="kj-bar-fill" style={{ width: c.pct + "%", background: colors.income, boxShadow: resolvedTheme === "dark" ? `0 0 8px ${hexToRgba(colors.income, 0.5)}` : "none" }} />
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </>
      )}

      {activeTab === "setting" && (
      <>
        <div className="mt-1">
          <p className="text-xs uppercase tracking-wide kj-muted mb-2">Pengaturan</p>
          <div className="kj-card rounded-xl divide-y" style={{ borderColor: "var(--border)" }}>
            <button onClick={() => setShowAppearanceModal(true)} className="kj-focus kj-fade kj-settrow" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: "1px solid var(--border)", color: "var(--accent)" }}>
                <Palette size={16} />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium">Tampilan</span>
                <span className="block text-xs kj-muted">Mode gelap/terang & warna aksen</span>
              </span>
              <ChevronRight size={16} className="kj-muted flex-shrink-0" />
            </button>
            <button onClick={openWalletModal} className="kj-focus kj-fade kj-settrow">
              <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: "1px solid var(--border)", color: "var(--accent)" }}>
                <Settings size={16} />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium">Kelola Dompet</span>
                <span className="block text-xs kj-muted">{wallets.length} dompet aktif</span>
              </span>
              <ChevronRight size={16} className="kj-muted flex-shrink-0" />
            </button>
          </div>

          <p className="text-xs uppercase tracking-wide kj-muted mb-2 mt-6">Tentang</p>
          <div className="kj-card rounded-xl p-4">
            <p className="text-sm font-medium mb-0.5">Kas Jajan</p>
            <p className="text-xs kj-muted">Catat pemasukan & pengeluaran harianmu dengan mudah.</p>
          </div>
        </div>
      </>
      )}
      </div>
      </div>

      <div className="kj-bottomnav">
        <div className="kj-bottomnav-inner">
          <span className="kj-navindicator" style={{ transform: `translateX(${TABS.findIndex((t) => t.key === activeTab) * 100}%)` }} />
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              aria-label={t.label}
              aria-current={activeTab === t.key ? "page" : undefined}
              className={"kj-focus kj-navitem" + (activeTab === t.key ? " active" : "")}
            >
              <t.Icon size={20} className="kj-navicon" />
              <span className="text-[11px] font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div key={toast.id} className="kj-toast kj-toast-enter">
          <div className="kj-card kj-glass rounded-full px-4 py-2.5 text-sm" style={{ border: "1px solid var(--accent-line)", boxShadow: `0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px ${hexToRgba(colors.accent, 0.15)}` }}>
            {toast.message}
          </div>
        </div>
      )}

      {showTxModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center kj-overlay" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setShowTxModal(false)}>
          <div className="kj-card kj-glass w-full max-w-md rounded-t-2xl p-5" style={{ borderTop: "1px solid var(--accent-line)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold" style={{ color: typeColor }}>
                {txType === "income" ? "Tambah Pemasukan" : "Tambah Pengeluaran"}
              </h2>
              <button onClick={() => setShowTxModal(false)} aria-label="Tutup" className="kj-focus kj-muted"><X size={18} /></button>
            </div>

            <div className="rounded-lg p-3 flex items-center gap-2 mb-4" style={{ border: "1px solid var(--border)" }}>
              <span className="kj-muted text-lg" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Rp</span>
              <input
                inputMode="numeric"
                value={formatDigitsDisplay(txAmountRaw)}
                onChange={(e) => setTxAmountRaw(parseDigits(e.target.value))}
                placeholder="0"
                className="flex-1 bg-transparent outline-none text-2xl font-medium"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--text)" }}
                autoFocus
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTxAmountRaw((prev) => String(parseInt(prev || "0", 10) + amt))}
                  className="kj-focus kj-press kj-fade flex-shrink-0 text-xs px-3 py-1.5 rounded-full"
                  style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
                >
                  +{formatDigitsDisplay(String(amt))}
                </button>
              ))}
              {txAmountRaw && (
                <button
                  onClick={() => setTxAmountRaw("")}
                  className="kj-focus kj-press flex-shrink-0 text-xs px-3 py-1.5 rounded-full"
                  style={{ border: "1px solid var(--border)", color: typeColor }}
                >
                  Reset
                </button>
              )}
            </div>

            <p className="text-xs kj-muted mb-2">Kategori</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setTxCategory(c)}
                  className="kj-focus text-xs px-3 py-1.5 rounded-full"
                  style={
                    txCategory === c
                      ? { border: `1px solid ${typeColor}`, color: typeColor, background: txType === "income" ? "rgba(63,125,87,0.1)" : "rgba(166,73,58,0.1)" }
                      : { border: "1px solid var(--border)", color: "var(--muted)" }
                  }
                >
                  {c}
                </button>
              ))}
            </div>

            {wallets.length > 1 && (
              <div className="mb-4">
                <p className="text-xs kj-muted mb-1">Dompet</p>
                <select
                  value={txWalletId}
                  onChange={(e) => setTxWalletId(e.target.value)}
                  className="w-full rounded-lg p-2 text-sm"
                  style={{ border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)" }}
                >
                  {wallets.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
            )}

            <div className="mb-4">
              <p className="text-xs kj-muted mb-1">Catatan (opsional)</p>
              <input
                value={txNote}
                onChange={(e) => setTxNote(e.target.value)}
                placeholder="mis. Beli cimol depan sekolah"
                className="w-full rounded-lg p-2 text-sm"
                style={{ border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)" }}
              />
            </div>

            <div className="mb-5">
              <p className="text-xs kj-muted mb-1">Tanggal</p>
              <input
                type="date"
                value={txDate}
                onChange={(e) => setTxDate(e.target.value)}
                className="w-full rounded-lg p-2 text-sm"
                style={{ border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)" }}
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowTxModal(false)} className="kj-focus flex-1 py-2.5 rounded-lg text-sm font-medium kj-muted" style={{ border: "1px solid var(--border)" }}>Batal</button>
              <button
                onClick={saveTransaction}
                disabled={!txValid}
                className="kj-focus kj-press flex-1 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: typeColor, opacity: txValid ? 1 : 0.5, color: onFillText }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center kj-overlay" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setShowWalletModal(false)}>
          <div className="kj-card kj-glass w-full max-w-md rounded-t-2xl p-5" style={{ borderTop: "1px solid var(--accent-line)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Kelola Dompet</h2>
              <button onClick={() => setShowWalletModal(false)} aria-label="Tutup" className="kj-focus kj-muted"><X size={18} /></button>
            </div>

            <div className="max-h-60 overflow-y-auto mb-4">
              {wallets.map((w, idx) => (
                <div key={w.id} className="flex items-center gap-2 py-2.5" style={idx < wallets.length - 1 ? { borderBottom: "1px dashed var(--border)" } : undefined}>
                  <span className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: w.color }} />
                  {editingWalletId === w.id ? (
                    <>
                      <input
                        value={editingWalletName}
                        onChange={(e) => setEditingWalletName(e.target.value)}
                        className="flex-1 rounded-lg p-1.5 text-sm"
                        style={{ border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)" }}
                        autoFocus
                      />
                      <button onClick={confirmEditWallet} aria-label="Simpan nama" className="kj-focus" style={{ color: "var(--income)" }}><Check size={16} /></button>
                      <button onClick={() => setEditingWalletId(null)} aria-label="Batal" className="kj-focus kj-muted"><X size={16} /></button>
                    </>
                  ) : confirmDeleteWalletId === w.id ? (
                    <>
                      <span className="flex-1 text-xs kj-muted">Hapus dompet & transaksinya?</span>
                      <button onClick={() => setConfirmDeleteWalletId(null)} className="text-xs px-2 py-1 kj-muted">Batal</button>
                      <button onClick={() => deleteWallet(w.id)} className="text-xs px-2 py-1" style={{ color: "var(--expense)" }}>Hapus</button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm truncate">{w.name}</span>
                      <span className="text-xs kj-muted" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatRupiah(walletBalance(w.id))}</span>
                      <button onClick={() => startEditWallet(w)} aria-label="Ubah nama" className="kj-focus kj-muted"><Pencil size={14} /></button>
                      <button
                        onClick={() => wallets.length > 1 && setConfirmDeleteWalletId(w.id)}
                        aria-label="Hapus dompet"
                        className="kj-focus"
                        style={{ color: wallets.length > 1 ? "var(--muted)" : "var(--border)" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs uppercase tracking-wide kj-muted mb-2" style={{ borderTop: "1px dashed var(--border)", paddingTop: "12px" }}>Dompet Baru</p>
            <input
              value={newWalletName}
              onChange={(e) => setNewWalletName(e.target.value)}
              placeholder="Nama dompet, mis. Tabungan"
              className="w-full rounded-lg p-2 text-sm mb-2"
              style={{ border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)" }}
            />
            <div className="rounded-lg p-2 flex items-center gap-2 mb-3" style={{ border: "1px solid var(--border)" }}>
              <span className="kj-muted text-sm" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Rp</span>
              <input
                inputMode="numeric"
                value={formatDigitsDisplay(newWalletBalanceRaw)}
                onChange={(e) => setNewWalletBalanceRaw(parseDigits(e.target.value))}
                placeholder="Saldo awal"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--text)" }}
              />
            </div>
            <div className="flex gap-2 mb-4">
              {WALLET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewWalletColor(c)}
                  aria-label="Pilih warna"
                  className="kj-focus w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: c, border: newWalletColor === c ? "2px solid var(--text)" : "2px solid transparent" }}
                >
                  {newWalletColor === c ? <Check size={12} color="#fff" /> : null}
                </button>
              ))}
            </div>
            <button
              onClick={addWallet}
              disabled={!newWalletName.trim()}
              className="kj-focus kj-press w-full py-2.5 rounded-lg text-sm font-medium"
              style={{ background: "var(--accent)", opacity: newWalletName.trim() ? 1 : 0.5, color: onFillText }}
            >
              Tambah Dompet
            </button>
          </div>
        </div>
      )}

      {showAppearanceModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center kj-overlay" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setShowAppearanceModal(false)}>
          <div className="kj-card kj-glass w-full max-w-md rounded-t-2xl p-5" style={{ borderTop: "1px solid var(--accent-line)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold">Tampilan</h2>
              <button onClick={() => setShowAppearanceModal(false)} aria-label="Tutup" className="kj-focus kj-muted"><X size={18} /></button>
            </div>

            <p className="text-xs uppercase tracking-wide kj-muted mb-2">Mode</p>
            <div className="kj-seg mb-5" role="radiogroup" aria-label="Mode tampilan">
              {[
                { key: "light", label: "Terang", Icon: Sun },
                { key: "dark", label: "Gelap", Icon: Moon },
                { key: "system", label: "Sistem", Icon: Monitor },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  role="radio"
                  aria-checked={themeMode === key}
                  onClick={() => setThemeMode(key)}
                  className={"kj-focus kj-fade kj-seg-btn" + (themeMode === key ? " active" : "")}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide kj-muted">Warna aksen</p>
              <span className="text-xs kj-muted">{activeAccentPreset.label}</span>
            </div>
            <div className="grid grid-cols-6 gap-3 mb-5">
              {ACCENT_PRESETS.map((p) => {
                const swatchColor = resolvedTheme === "dark" ? p.dark : p.light;
                const selected = accentKey === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => setAccentKey(p.key)}
                    aria-label={p.label}
                    aria-pressed={selected}
                    className="kj-focus flex flex-col items-center gap-1.5"
                  >
                    <span className="kj-swatch kj-fade" style={{ background: swatchColor, border: selected ? "2px solid var(--text)" : "2px solid transparent", boxShadow: selected ? "0 0 0 2px var(--surface)" : "none" }}>
                      {selected ? <Check size={13} color="#fff" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs uppercase tracking-wide kj-muted mb-2" style={{ borderTop: "1px dashed var(--border)", paddingTop: "12px" }}>Pratinjau</p>
            <div className="kj-card rounded-xl p-3 flex items-center justify-between" style={{ border: "1px solid var(--border)" }}>
              <span className="text-sm">Tombol &amp; sorotan memakai warna ini</span>
              <button className="kj-focus px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0" style={{ background: "var(--accent)", color: onFillText }}>
                Contoh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
