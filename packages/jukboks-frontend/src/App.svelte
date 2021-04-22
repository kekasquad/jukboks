<script>
  import { Router, Link, Route, navigate } from 'svelte-navigator';
  import Loader from './components/Loader.svelte';
  import PrivateRoute from './routes/PrivateRoute.svelte';
  import AuthorizedRoute from './routes/AuthorizedRoute.svelte';
  import Main from './routes/Main.svelte';
  import SignIn from './routes/SignIn.svelte';
  import SignUp from './routes/SignUp.svelte';
  import Profile from './routes/Profile.svelte';
  import Soundcloud from './routes/Soundcloud';
  import Stream from './routes/Stream.svelte';
  import CreateStream from './routes/CreateStream.svelte';
  import NotFound from './routes/NotFound.svelte';
  import { initStores } from './utils/api';

  initStores().catch((_) => navigate('/signin'));

  // export let url = ""; //This property is necessary declare to avoid ignore the Router
</script>

<Router>
  <main>
    <Route path="/" component={Main} primary={false} />
    <AuthorizedRoute path="/signin">
      <SignIn />
    </AuthorizedRoute>
    <AuthorizedRoute path="/signup">
      <SignUp />
    </AuthorizedRoute>
    <PrivateRoute path="/profile">
      <Profile />
    </PrivateRoute>
    <PrivateRoute path="/new/stream" let:params>
      <CreateStream />
    </PrivateRoute>
    <PrivateRoute path="/stream/:uuid" let:params>
      <Stream uuid={params.uuid} />
    </PrivateRoute>
    <Route path="/test/sc" component={Soundcloud} />
    <Route component={NotFound} />
  </main>
</Router>
