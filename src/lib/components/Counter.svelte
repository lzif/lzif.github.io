<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  let { value, suffix = "", delay = 0 }: { value: number; suffix?: string; delay?: number } = $props();

  // Starts at the final value so the prerendered HTML states the real number for
  // non-JS consumers; the browser rewinds to 0 before tweening.
  // svelte-ignore state_referenced_locally
  let shown = $state(value);
  let started = $state(false);

  function start() {
    if (started) return;
    started = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown = value;
      return;
    }
    shown = 0;
    const tween = tweened(0, { duration: 900, delay, easing: cubicOut });
    tween.subscribe((v) => (shown = Math.round(v)));
    tween.set(value);
  }
</script>

<span {@attach start}>
  {shown}{suffix}
</span>
