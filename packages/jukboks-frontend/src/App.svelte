<script>
  import { Router, Link, Route } from "svelte-navigator";
  import PrivateRoute from "./routes/PrivateRoute.svelte";
  import Main from "./routes/Main.svelte";
  import SignIn from "./routes/SignIn.svelte";
  import SignUp from "./routes/SignUp.svelte";
  import Profile from "./routes/Profile.svelte";
  // export let url = ""; //This property is necessary declare to avoid ignore the Router
</script>

<Router>
  <main>
    <Route path="/" component={Main} />
    <Route path="/signin" component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <PrivateRoute path="/stream/:id" let:params>
        <h1>{params.id}</h1>
    </PrivateRoute>
  </main>
</Router>
