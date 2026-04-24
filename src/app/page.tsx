"use client";

import { useState, useMemo } from "react";
import { researchers, sortResearchers, getProvinceStats, type SortKey } from "@/data/researchers";
import { translations, type Lang } from "@/data/i18n";

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return n.toString();
}

function getRankMedal(rank: number) {
  if (rank === 1) return <span className="text-2xl" title="1st">🥇</span>;
  if (rank === 2) return <span className="text-2xl" title="2nd">🥈</span>;
  if (rank === 3) return <span className="text-2xl" title="3rd">🥉</span>;
  return <span className="text-muted font-mono text-lg">{rank}</span>;
}

type Region = "all" | "mainland" | "us" | "other";
type Tab = "rankings" | "provinces";

function matchRegion(country: string, region: Region): boolean {
  if (region === "all") return true;
  if (region === "mainland") return country === "🇨🇳";
  if (region === "us") return country === "🇺🇸";
  return country !== "🇨🇳" && country !== "🇺🇸";
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [tab, setTab] = useState<Tab>("rankings");
  const [sortKey, setSortKey] = useState<SortKey>("h_index");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null);

  const t = translations[lang];

  const filtered = useMemo(() => {
    const sorted = sortResearchers(researchers, sortKey);
    return sorted.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.name_en.toLowerCase().includes(q) ||
        r.name_zh.includes(q) ||
        r.affiliation_en.toLowerCase().includes(q) ||
        r.field_en.toLowerCase().includes(q) ||
        r.native_province_en.toLowerCase().includes(q) ||
        r.native_province_zh.includes(q);
      return matchSearch && matchRegion(r.country, region);
    });
  }, [sortKey, search, region]);

  const stats = useMemo(() => {
    const avg_h = Math.round(filtered.reduce((s, r) => s + r.h_index, 0) / (filtered.length || 1));
    const avg_cit = Math.round(filtered.reduce((s, r) => s + r.citations, 0) / (filtered.length || 1));
    const total_papers = filtered.reduce((s, r) => s + r.papers, 0);
    return { avg_h, avg_cit, total_papers };
  }, [filtered]);

  const provinceStats = useMemo(() => {
    return getProvinceStats(researchers);
  }, []);

  return (
    <main className="flex-1">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold text-accent">{t.title}</h1>
              <p className="text-sm text-muted mt-0.5">{t.subtitle}</p>
            </div>
            <button
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              className="px-4 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition font-medium text-sm shrink-0"
            >
              {lang === "en" ? "中文" : "English"}
            </button>
          </div>
          {/* Tab Navigation */}
          <nav className="flex gap-1 mt-3 -mb-px">
            <button
              onClick={() => setTab("rankings")}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition border-b-2 ${
                tab === "rankings"
                  ? "border-accent text-accent bg-accent/10"
                  : "border-transparent text-muted hover:text-foreground hover:bg-card-hover"
              }`}
            >
              {lang === "en" ? "Rankings" : "排行榜"}
            </button>
            <button
              onClick={() => setTab("provinces")}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition border-b-2 ${
                tab === "provinces"
                  ? "border-accent text-accent bg-accent/10"
                  : "border-transparent text-muted hover:text-foreground hover:bg-card-hover"
              }`}
            >
              {t.province_tab}
              <span className="ml-1.5 text-xs bg-accent/20 text-accent rounded-full px-1.5 py-0.5">
                {provinceStats.length}
              </span>
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ===== RANKINGS TAB ===== */}
        {tab === "rankings" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-muted text-xs uppercase tracking-wider">{t.unit_label}</p>
                <p className="text-3xl font-bold text-accent mt-1">{filtered.length}</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-muted text-xs uppercase tracking-wider">{t.avg_h}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.avg_h}</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-muted text-xs uppercase tracking-wider">{t.avg_citations}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{formatNumber(stats.avg_cit)}</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-muted text-xs uppercase tracking-wider">{t.total_papers}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{formatNumber(stats.total_papers)}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search}
                className="flex-1 min-w-[200px] bg-card border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="bg-card border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="h_index">{t.sort_by}: {t.h_index}</option>
                <option value="citations">{t.sort_by}: {t.citations}</option>
                <option value="papers">{t.sort_by}: {t.papers}</option>
              </select>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                className="bg-card border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="all">{t.all}</option>
                <option value="mainland">{t.mainland}</option>
                <option value="us">{t.us}</option>
                <option value="other">{t.other}</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-card text-muted text-left text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 w-16">{t.rank}</th>
                    <th className="px-4 py-3">{t.name}</th>
                    <th className="px-4 py-3 hidden md:table-cell">{t.affiliation}</th>
                    <th className="px-4 py-3 hidden lg:table-cell">{t.field}</th>
                    <th className="px-4 py-3 text-right cursor-pointer hover:text-accent" onClick={() => setSortKey("h_index")}>
                      {t.h_index} {sortKey === "h_index" ? "▼" : ""}
                    </th>
                    <th className="px-4 py-3 text-right cursor-pointer hover:text-accent" onClick={() => setSortKey("citations")}>
                      {t.citations} {sortKey === "citations" ? "▼" : ""}
                    </th>
                    <th className="px-4 py-3 text-right cursor-pointer hover:text-accent hidden sm:table-cell" onClick={() => setSortKey("papers")}>
                      {t.papers} {sortKey === "papers" ? "▼" : ""}
                    </th>
                    <th className="px-4 py-3 w-12">{t.country}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`border-t border-border hover:bg-card-hover transition cursor-pointer ${
                        expandedId === r.id ? "bg-card-hover" : i % 2 === 0 ? "bg-background" : "bg-card/30"
                      }`}
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                    >
                      <td className="px-4 py-3 text-center">{getRankMedal(i + 1)}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{lang === "en" ? r.name_en : r.name_zh}</div>
                        <div className="text-xs text-muted">{lang === "en" ? r.name_zh : r.name_en}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted">
                        {lang === "en" ? r.affiliation_en : r.affiliation_zh}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted text-xs">
                        {lang === "en" ? r.field_en : r.field_zh}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-accent">{r.h_index}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatNumber(r.citations)}</td>
                      <td className="px-4 py-3 text-right font-mono hidden sm:table-cell">{formatNumber(r.papers)}</td>
                      <td className="px-4 py-3 text-center text-lg">{r.country}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-muted">
                        {t.none_found}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Expanded Detail */}
            {expandedId && (
              <div className="bg-card rounded-xl border border-accent/30 p-6 animate-fade-in">
                {(() => {
                  const r = researchers.find((x) => x.id === expandedId);
                  if (!r) return null;
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl font-bold text-accent">
                          {lang === "en" ? r.name_en : r.name_zh}
                        </h2>
                        <span className="text-muted text-sm">
                          {lang === "en" ? r.name_zh : r.name_en}
                        </span>
                        <span className="text-lg">{r.country}</span>
                      </div>
                      <p className="text-muted">{lang === "en" ? r.affiliation_en : r.affiliation_zh}</p>
                      <p className="text-sm">{lang === "en" ? r.field_en : r.field_zh}</p>
                      <p className="text-sm">
                        <span className="text-muted">{t.native_place}: </span>
                        <span>{lang === "en" ? r.native_province_en : r.native_province_zh}</span>
                      </p>
                      <div className="flex gap-6 flex-wrap text-sm">
                        <div>
                          <span className="text-muted">{t.h_index}: </span>
                          <span className="font-bold text-accent">{r.h_index}</span>
                        </div>
                        <div>
                          <span className="text-muted">{t.citations}: </span>
                          <span className="font-bold">{r.citations.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted">{t.papers}: </span>
                          <span className="font-bold">{r.papers.toLocaleString()}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted text-sm">{t.notable}: </span>
                        <span className="text-sm">{lang === "en" ? r.notable_work_en : r.notable_work_zh}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}

        {/* ===== PROVINCE RANK TAB ===== */}
        {tab === "provinces" && (
          <section className="space-y-6">
            {/* Province summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-muted text-xs uppercase tracking-wider">{t.provinces_covered}</p>
                <p className="text-3xl font-bold text-accent mt-1">{provinceStats.length}</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-muted text-xs uppercase tracking-wider">{t.unit_total}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{researchers.length}</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-muted text-xs uppercase tracking-wider">{t.top_province}</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {lang === "en" ? provinceStats[0]?.province_en : provinceStats[0]?.province_zh}
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-muted text-xs uppercase tracking-wider">{t.top_province_count}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{provinceStats[0]?.count}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-accent">{t.native_place_stats}</h2>
              <p className="text-sm text-muted mt-1">{t.native_place_subtitle}</p>
            </div>

            {/* Bar chart */}
            <div className="bg-card rounded-xl border border-border p-4 space-y-1">
              {provinceStats.map((ps, i) => {
                const maxCount = provinceStats[0].count;
                const pct = (ps.count / maxCount) * 100;
                const isExpanded = expandedProvince === ps.province_en;
                return (
                  <div key={ps.province_en}>
                    <div
                      className={`flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2.5 transition hover:bg-card-hover ${isExpanded ? "bg-card-hover" : ""}`}
                      onClick={() => setExpandedProvince(isExpanded ? null : ps.province_en)}
                    >
                      <span className="w-7 text-right font-mono text-muted text-sm shrink-0">
                        {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                      </span>
                      <span className="w-28 shrink-0 font-medium text-sm">
                        {lang === "en" ? ps.province_en : ps.province_zh}
                      </span>
                      <div className="flex-1 h-8 bg-background rounded-md overflow-hidden relative">
                        <div
                          className="h-full rounded-md transition-all duration-500"
                          style={{
                            width: `${Math.max(pct, 4)}%`,
                            background: i === 0
                              ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                              : i === 1
                              ? "linear-gradient(90deg, #f59e0b, #f97316)"
                              : i === 2
                              ? "linear-gradient(90deg, #d97706, #f59e0b)"
                              : "linear-gradient(90deg, #475569, #64748b)",
                          }}
                        />
                        <span className="absolute inset-0 flex items-center px-3 text-xs font-bold text-white drop-shadow-sm">
                          {ps.count} {t.unit_count}
                        </span>
                      </div>
                      <span className="w-16 text-right text-xs text-muted hidden sm:block font-mono">
                        H̄ {ps.avg_h_index}
                      </span>
                      <span className="w-20 text-right text-xs text-muted hidden md:block font-mono">
                        {formatNumber(ps.total_citations)}
                      </span>
                      <span className="text-xs text-muted w-4 text-center">{isExpanded ? "▲" : "▼"}</span>
                    </div>

                    {isExpanded && (
                      <div className="ml-10 mt-1 mb-3 animate-fade-in">
                        <div className="bg-background rounded-lg border border-border p-4 space-y-3">
                          <div className="flex gap-6 flex-wrap text-sm">
                            <div>
                              <span className="text-muted">{t.people_count}: </span>
                              <span className="font-bold text-accent">{ps.count}</span>
                            </div>
                            <div>
                              <span className="text-muted">{t.avg_h_province}: </span>
                              <span className="font-bold">{ps.avg_h_index}</span>
                            </div>
                            <div>
                              <span className="text-muted">{t.total_cit_province}: </span>
                              <span className="font-bold">{formatNumber(ps.total_citations)}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted mb-2">{t.top_researchers}:</p>
                            <div className="flex flex-wrap gap-2">
                              {ps.researchers.map((r) => (
                                <span
                                  key={r.id}
                                  className="inline-flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1 text-xs hover:border-accent/50 transition"
                                >
                                  <span className="font-medium">{lang === "en" ? r.name_en : r.name_zh}</span>
                                  <span className="text-accent font-mono">H:{r.h_index}</span>
                                  <span className="text-muted">{r.country}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-muted py-6 border-t border-border">
          <p>{t.disclaimer}</p>
          <p className="mt-2">
            {researchers.length} {t.total}
          </p>
        </footer>
      </div>
    </main>
  );
}
