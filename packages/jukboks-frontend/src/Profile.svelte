<script>
  let background = "/img/backgrounds/mainPage.png";
  import Unauthorized from "./Unauthorized.svelte";
  import { Link, navigate } from "svelte-routing";

  let token = localStorage.getItem("token");
  let authorized = false;
  if (token != null) {
    authorized = true;
  }
</script>

{#if !authorized}
  <Unauthorized />
{:else}
  Auth
{/if}
