<script>
  import { Router, Route, Link } from "svelte-routing";
	import Main from './Main.svelte';
  import Auth from './Auth.svelte';
  // export let url = ""; //This property is necessary declare to avoid ignore the Router
</script>

<Router>
  <main>
    <Route path="/"><Main/></Route>
    <Route path="/auth"><Auth/></Route>
  </main>
</Router>