<script>
  import { fade } from 'svelte/transition';
  import Title from '../components/Title';
  import Loader from '../components/Loader';
  import Preview from '../components/Preview';
  import StreamContent from '../components/StreamContent';
  import * as api from '../utils/api';
  import * as ws from '../utils/ws';

  export let uuid;

  const EVENTS = {
    STREAM_STARTED: 'stream:started',
    SONG_STARTED: 'song:started',
  };

  let background = '/img/backgrounds/streamPage.png';

  let promise = api.getStream(uuid);

  let entered = false;
</script>

{#await promise}
  <Loader />
{:then stream}
  <div class="outer" style="background: url({background}); background-size: cover; background-position: center;">
    {#if !entered}
      <Preview {stream} bind:entered><div class="shadow" /></Preview>
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

  .shadow {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
