<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  let { value, suffix = "", delay = 0 }: { value: number; suffix?: string; delay?: number } = $props();

  let shown = $state(0);
  let started = $state(false);

  function start() {
    if (started) return;
    started = true;
    const tween = tweened(0, { duration: 900, delay, easing: cubicOut });
    tween.subscribe((v) => (shown = Math.round(v)));
    tween.set(value);
  }
</script>

<span {@attach start}>
  {shown}{suffix}
</span>
