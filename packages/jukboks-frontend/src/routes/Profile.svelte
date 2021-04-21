<script>
  // TODO: add func to button
  // TODO: add streams
  import { navigate } from 'svelte-navigator';
  import Stream from '../components/Stream.svelte';
  import Heading from '../components/Heading.svelte';
  import Button from '../components/Button.svelte';
  import Loader from '../components/Loader';
  import { me } from '../utils/api';

  let background = '/img/backgrounds/userPage.png';

  let promise = me();

  function scheduleStream() {
    navigate('/new/stream', { replace: true });
  }
</script>

{#await promise}
  <Loader />
{:then user}
  <div class="outer" style="background: url({background}); background-size: cover; background-position: center;">
    <Heading heading={'Welcome, ' + user.name} style="align-self: flex-start;" />
    <Heading heading="Your streams" style="align-self: flex-start; margin-top: 30px" />
    <Button title="Schedule new" style="margin-top: auto; align-self: flex-end;" func={scheduleStream} />
  </div>
{:catch error}
  {#await error.response.json() then j}
    <p style="color: red">{j.error}</p>
  {/await}
{/await}

<style>
  .outer {
    width: 90%;
    height: 93vh;
    padding: 5vh 5% 2vh;
    margin: 0px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
</style>
