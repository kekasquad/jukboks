<script>
  import { Route, Link } from "svelte-routing";
  import accessDenied from "./Unauthorized.svelte";
  import { token } from "../utils/stores.js";

  export let path;
  export let component;

  $: isAuthenticated = $token;
</script>

{#if isAuthenticated}
  <Route {path} {component} />
{:else}
  <Route {path} component={accessDenied} />
{/if}
