<script>
  import { fade } from 'svelte/transition';
  import Title from '../components/Title';
  import Loader from '../components/Loader';
  import * as api from '../utils/api';
  import * as ws from '../utils/ws';

  export let uuid;

  let background = '/img/backgrounds/streamPage.png';

  let promise = api.getStream(uuid);
  let date = new Date();
  let time = date.getTime();

  let entered = false;
  let songTitle = ''; //TODO: bind with title
  let songArtist = ''; //TODO: bind with artist
  let song;

  function dateFrom(mseconds) {
    let begin = new Date();
    begin.setTime(mseconds);
    return begin.toLocaleString();
  }

  async function enterTheStream() {
    await ws.connect();
    ws.join(uuid);
    entered = true; //TODO change the logic of setting
  }
</script>

{#await promise}
  <Loader />
{:then stream}
  <div class="outer" style="background: url({background}); background-size: cover; background-position: center;">
    {#if !entered}
      <!-- TODO: create a separate element and present it -->
      <div class="shadow" out:fade={{ duration: 100 }} in:fade={{ duration: 100 }} />
      <h1 out:fade={{ duration: 100 }}>{stream.title} by {stream.author.username}</h1>
      {#if time < stream.dt_start}
        <h1>Wait for the start at {dateFrom(stream.dt_start)}</h1>
      {:else if time < stream.dt_end}
        <h1 class="enter" on:click={enterTheStream} out:fade={{ duration: 100 }}>Enter the stream</h1>
      {:else}
        <h1>Stream has ended</h1>
      {/if}
    {:else}
      <!-- TODO: make stream structure after entering -->
      <!-- TODO: create a separate element and present it -->
      <Title title="{stream.title} by {stream.author.username}" />
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
    width: 90%;
    height: 93vh;
    padding: 5vh 5% 2vh;
    margin: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .shadow {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 300;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    z-index: 301;
    font-size: 32px;
    line-height: 36px;
    padding: 0px;
    margin: 0px;
    margin-bottom: 20px;
  }

  .enter {
    background: linear-gradient(90deg, #9adff2 0%, #b9669f 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: #b9669f;
    z-index: 302;
    text-decoration-line: underline;
  }

  .enter:hover {
    cursor: pointer;
  }
</style>
