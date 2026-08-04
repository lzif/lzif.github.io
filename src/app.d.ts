// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

declare namespace svelteHTML {
  import type { AttributifyAttributes } from "@unocss/preset-attributify";

  type HTMLAttributes = AttributifyAttributes;
}

// Custom window event dispatched by `applyTheme` so multiple
// ThemeToggle instances (desktop + mobile) stay in sync.
declare module "svelte/elements" {
  interface SvelteWindowAttributes {
    onthemechange?: (event: Event) => void;
    "on:themechange"?: (event: Event) => void;
  }
}

export {};
