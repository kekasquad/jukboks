<script>
  import { Router, Route, navigate } from 'svelte-navigator';
  import PrivateRoute from './components/routes/PrivateRoute';
  import AuthorizedRoute from './components/routes/AuthorizedRoute';
  import Main from './routes/Main';
  import SignIn from './routes/SignIn';
  import SignUp from './routes/SignUp';
  import Profile from './routes/Profile';
  import Stream from './routes/Stream';
  import CreateStream from './routes/CreateStream';
  import NotFound from './routes/NotFound';
  import { initStores } from './utils/api';
  import { token, username } from './utils/stores';

  initStores().catch((_) => {
    token.set(null);
    username.set(null);
    if (window.location.pathname != '/') {
      navigate('/signin');
    }
  });

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
    <Route component={NotFound} />
  </main>
</Router>
