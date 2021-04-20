<script>
  export let id;
  import Heading from '../components/Heading';
  import Loader from '../components/Loader';
  import { getStream } from '../utils/api';

  let background = '/img/backgrounds/streamPage.png';

  let promise = getStream(id);
</script>

{#await promise}
  <Loader />
{:then stream}
  lol
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
</style>
