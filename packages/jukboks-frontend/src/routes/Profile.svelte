<script>
  // TODO: add func to button
  // TODO: add streams
  import { navigate } from 'svelte-navigator';
  import Row from '../components/Row.svelte';
  import Heading from '../components/Heading.svelte';
  import Button from '../components/Button.svelte';
  import Loader from '../components/Loader';
  import { me } from '../utils/api';
  import { saveUser } from '../utils/stores';

  let background = '/img/backgrounds/userPage.png';

  let promise = me();

  saveUser();

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
  <p style="color: red">{error.message}</p>
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
