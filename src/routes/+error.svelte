<script>
  import { page } from "$app/stores";

  // we don't want to use <svelte:window bind:online> here, because we only care about the online
  // state when the page first loads
  let online = typeof navigator !== "undefined" ? navigator.onLine : true;
</script>

<svelte:head>
  <title>{$page.status}</title>
</svelte:head>

<div class="container">
  {#if $page.status === 404}
    <div class="w-full text-center my-30">
      <h1 class="text-8xl font-black">Page Not found!</h1>
      <p class="text-2xl">Maybe it hasn't been made yet.</p>
      <p class="mt-5"><a href="/" class="text-xl">{"👈"} Go Back!</a></p>
    </div>
  {:else if online}
    <h1>Yikes!</h1>

    {#if $page.error?.message}
      <p class="error">{$page.status}: {$page.error?.message}</p>
    {/if}

    <p>Please try reloading the page.</p>
  {:else}
    <h1>It looks like you're offline</h1>

    <p>Reload the page once you've found the internet.</p>
  {/if}
</div>
