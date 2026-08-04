import { browser } from "$app/environment";

export type Theme = "dark" | "light";

export function applyTheme(theme: Theme): void {
  if (!browser) return;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

export function getTheme(): Theme {
  if (!browser) return "dark";
  return (localStorage.getItem("theme") as Theme) ?? "dark";
}

export function toggleTheme(): void {
  applyTheme(getTheme() === "dark" ? "light" : "dark");
}
