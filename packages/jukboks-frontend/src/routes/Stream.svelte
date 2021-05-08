<script>
  import Loader from '../components/Loader';
  import Preview from '../components/stream/Preview';
  import StreamContent from '../components/stream/StreamContent';
  import * as api from '../utils/api';
  import { plays, song, message } from '../utils/stores';

  export let uuid;

  let background = '/img/backgrounds/streamPage.png';

  song.set(null);
  plays.set(false);
  message.set(null);

  let promise = api.getStream(uuid);
</script>

{#await promise}
  <Loader />
{:then stream}
  <div class="outer" style="background: url({background}); background-size: cover; background-position: center;">
    {#if !$plays}
      <Preview {stream} />
    {:else}
      <StreamContent {stream} />
    {/if}
  </div>
{:catch error}
  <div class="outer" style="background: url({background}); background-size: cover; background-position: center;">
    {#await error.response.json() then j}
      <p style="color: red">{j.error}</p>
    {/await}
  </div>
{/await}

<style>
  .outer {
    color: white;
    width: 100%;
    height: 100vh;
    margin: 0px;
    display: flex;
    flex-direction: column;
    z-index: 0;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>
