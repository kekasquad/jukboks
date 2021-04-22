<script>
  import { Route } from 'svelte-navigator';
  import PrivateRouteGuard from './PrivateRouteGuard.svelte';

  export let path;
</script>

<Route {path} let:params let:location let:navigate primary={false}>
  <PrivateRouteGuard>
    <slot {params} {location} {navigate} />
  </PrivateRouteGuard>
</Route>
