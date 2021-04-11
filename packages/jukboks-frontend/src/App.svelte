<script>
  import { Router, Route, Link } from "svelte-routing";
  import Main from "./Main.svelte";
  import SignIn from "./SignIn.svelte";
  import SignUp from "./SignUp.svelte";
  import Profile from "./Profile.svelte";
  // export let url = ""; //This property is necessary declare to avoid ignore the Router
</script>

<Router>
  <main>
    <Route path="/"><Main /></Route>
    <Route path="/signin"><SignIn /></Route>
    <Route path="/signup"><SignUp /></Route>
    <Route path="/profile"><Profile /></Route>
  </main>
</Router>
