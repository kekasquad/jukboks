<script>
  import { fade } from 'svelte/transition';
</script>

<div class="shadow" in:fade={{ duration: 100, delay: 150 }} out:fade={{ duration: 100 }} />

<style>
  .shadow {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
