<script>
  import { fade } from 'svelte/transition';
  import * as ws from '../../utils/ws';
  import Shadow from '../Shadow.svelte';

  export let stream;
  let entered = false;

  let date = new Date();
  let time = date.getTime();
  let error;

  function dateFrom(mseconds) {
    let begin = new Date();
    begin.setTime(mseconds);
    return begin.toLocaleString();
  }

  function isNotStarted() {
    return time < stream.dt_start;
  }

  function isEnded() {
    return time > stream.dt_end;
  }

  function onError(reason) {
    error = 'Something went wrong';
    console.log('Error on connecting to socket: ' + reason);
  }

  async function enterTheStream() {
    await ws.connect().catch(onError);
    await ws.join(stream.uuid).catch(onError);
    await ws.getListeners().then(console.log).catch(onError);
    entered = true;
  }
</script>

{#if !error}
  <div class="outer" out:fade={{ duration: 100 }} in:fade={{ duration: 100, delay: 150 }}>
    <Shadow />
    <h1>{stream.title} by {stream.author.username}</h1>
    {#if !entered && !isEnded()}
      <h1 class="enter" on:click={enterTheStream}>Enter the stream</h1>
    {:else if isNotStarted()}
      <h1>Wait for the start at {dateFrom(stream.dt_start)}</h1>
    {:else if isEnded()}
      <h1>Stream has ended</h1>
    {:else}
      <h1>Wait for some seconds...</h1>
    {/if}
  </div>
{:else}
  <p style="color: red">{error}</p>
{/if}

<style>
  h1 {
    position: relative;
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
    z-index: 301;
    text-decoration-line: underline;
  }

  .enter:hover {
    cursor: pointer;
  }
</style>
