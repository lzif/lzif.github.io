<script>
  let themes = document.documentElement.attributes.getNamedItem('data-theme')?.value 

  function toogledark(){
    themes = "dark"
    document.dispatchEvent(new CustomEvent('set-theme', { detail: "dark" }))
  }
  function tooglelight(){
    themes = "light"
    document.dispatchEvent(new CustomEvent('set-theme', { detail: "light" }))
  }
</script>

{#if themes==="dark"}
  <button on:click={tooglelight}>light</button>
{:else}
  <button on:click={toogledark}>dark</button>
{/if}
