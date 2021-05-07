<script>
  import { fade } from 'svelte/transition';

  export let message;
  export let style = '';
</script>

<div class="title" {style} in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
  {message}
</div>

<style>
  .title {
    position: absolute;
    right: 20px;
    top: 20px;
    padding: 0px;
    margin: 0px;
    font-size: 18px;
    line-height: 22px;
    color: black;
    background-color: white;
    border-radius: 20px;
    padding: 10px 20px;
    width: 30%;
    z-index: 1;
  }
</style>
