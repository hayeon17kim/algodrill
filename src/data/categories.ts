import type { Bilingual } from "@/lib/i18n";

export interface Category {
  id: string;
  icon: string;
  name: Bilingual;
}

export const CATEGORIES: Category[] = [
  { id: "two-pointers", icon: "👉👈", name: { ko: "Two Pointers", en: "Two Pointers" } },
  { id: "sliding-window", icon: "🪟", name: { ko: "Sliding Window", en: "Sliding Window" } },
  { id: "binary-search", icon: "🔍", name: { ko: "Binary Search", en: "Binary Search" } },
  { id: "hash-map", icon: "🗂️", name: { ko: "Hash Map", en: "Hash Map" } },
  { id: "stack-queue", icon: "📚", name: { ko: "Stack / Queue", en: "Stack / Queue" } },
  { id: "bfs-dfs", icon: "🌐", name: { ko: "BFS / DFS", en: "BFS / DFS" } },
  { id: "tree", icon: "🌳", name: { ko: "Tree", en: "Tree" } },
  { id: "graph", icon: "🕸️", name: { ko: "Graph", en: "Graph" } },
  { id: "dp", icon: "📐", name: { ko: "Dynamic Programming", en: "Dynamic Programming" } },
  { id: "greedy", icon: "🎯", name: { ko: "Greedy", en: "Greedy" } },
  { id: "heap", icon: "⛰️", name: { ko: "Heap / Priority Queue", en: "Heap / Priority Queue" } },
  { id: "sorting", icon: "📊", name: { ko: "정렬 / Sorting", en: "Sorting" } },
  { id: "communication", icon: "🎙️", name: { ko: "커뮤니케이션", en: "Communication" } },
];
