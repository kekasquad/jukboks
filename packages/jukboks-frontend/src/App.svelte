<script>
  import { Router, Link, Route } from "svelte-navigator";
  import PrivateRoute from "./routes/PrivateRoute.svelte";
  import Main from "./routes/Main.svelte";
  import SignIn from "./routes/SignIn.svelte";
  import SignUp from "./routes/SignUp.svelte";
  import Profile from "./routes/Profile.svelte";
  import Soundcloud from "./routes/Soundcloud";
  import Stream from "./routes/Stream.svelte";
  // export let url = ""; //This property is necessary declare to avoid ignore the Router
</script>

<Router>
  <main>
    <Route path="/" component={Main} />
    <Route path="/signin" component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <PrivateRoute path="/profile">
      <Profile />
    </PrivateRoute>
    <PrivateRoute path="/stream/:id" let:params>
      <Stream id={params.id} />
    </PrivateRoute>
    <Route path="/test/sc" component={Soundcloud} />
  </main>
</Router>
