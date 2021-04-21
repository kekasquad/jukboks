<script>
  import { fade } from 'svelte/transition';

  export let song;
  export let style;
</script>

<div class="song" {style} out:fade={{ duration: 100 }} in:fade={{ duration: 100 }}>
  <h1>{song.title}</h1>
  <h2>{song.artist}</h2>
</div>

<style>
  .song {
    width: 90%;
    padding: 0px;
    margin-bottom: 20px;
    margin-left: 3%;
    margin-right: 3%;
    color: #ffffff;
  }

  h1,
  h2 {
    margin: 0px;
    padding: 0px;
  }

  h1 {
    font-size: 32px;
    line-height: 36px;
  }

  h2 {
    font-size: 24px;
    line-height: 28px;
  }
</style>
