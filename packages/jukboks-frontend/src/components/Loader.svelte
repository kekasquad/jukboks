<script>
  import { Jellyfish } from "svelte-loading-spinners";
</script>

<div class="loader">
  <Jellyfish size="60" color="#b9669f" unit="px" duration="1s" />
</div>

<style>
  .loader {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
