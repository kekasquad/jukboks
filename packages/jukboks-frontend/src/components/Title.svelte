<script>
  import { fade } from 'svelte/transition';

  export let title;
  export let style = '';
</script>

<div class="title" {style} in:fade={{ duration: 100 }}>
  {title}
</div>

<style>
  .title {
    padding: 0px;
    margin: 0px;
    font-size: 32px;
    line-height: 36px;
    color: #ffffff;
  }
</style>
