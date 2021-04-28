<script>
  // TODO: add func to button
  // TODO: add streams
  import { navigate } from 'svelte-navigator';
  import StreamRow from '../components/stream/StreamRow';
  import Heading from '../components/Heading';
  import Button from '../components/Button';
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
    <div class="streams">
      {#each user.streams as stream}
        <StreamRow style="align-self: flex-start;" title={stream.title} time={stream.dt_start} uuid={stream.uuid} />
      {/each}
    </div>
    <Button title="Schedule new" style="margin-top: auto; align-self: flex-end;" func={scheduleStream} />
  </div>
{:catch error}
  {#await error.response.json() then j}
    <p style="color: red">{j.error}</p>
  {/await}
{/await}

<style>
  .outer {
    color: white;
    width: 90%;
    height: 93vh;
    padding: 5vh 5% 2vh;
    margin: 0px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .streams {
    width: 100%;
    height: 60%;
    overflow-y: auto;
    margin-top: 10px;
  }
</style>
