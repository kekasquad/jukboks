<script>
  import { Link } from 'svelte-navigator';
</script>

<div class="outer">
  <h1>404, not found :(</h1>
  <h1><Link to="/">Main page</Link></h1>
</div>

<style>
  .outer {
    width: 100%;
    height: 100vh;
    padding: 0px;
    margin: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
