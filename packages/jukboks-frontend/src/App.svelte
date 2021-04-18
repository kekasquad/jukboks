<script>
  import { Router, Route, Link } from "svelte-routing";
  import Main from "./routes/Main.svelte";
  import SignIn from "./routes/SignIn.svelte";
  import SignUp from "./routes/SignUp.svelte";
  import Profile from "./routes/Profile.svelte";
  import ProtectedRoute from "./routes/ProtectedRoute.svelte";
  // export let url = ""; //This property is necessary declare to avoid ignore the Router
</script>

<Router>
  <main>
    <Route path="/" component={Main} />
    <Route path="/signin" component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <ProtectedRoute path="/profile" component={Profile} />
  </main>
</Router>
