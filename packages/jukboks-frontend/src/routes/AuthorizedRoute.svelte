<script>
  import { Route } from 'svelte-navigator';
  import AuthorizedRouteGuard from './AuthorizedRouteGuard.svelte';

  export let path;
</script>

<Route {path} let:params let:location let:navigate primary={false}>
  <AuthorizedRouteGuard>
    <slot {params} {location} {navigate} />
  </AuthorizedRouteGuard>
</Route>
