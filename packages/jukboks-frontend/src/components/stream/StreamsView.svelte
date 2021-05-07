<script>
  import { onMount } from 'svelte';
  import StreamRow from './StreamRow';
  export let streams = [];

  let date = new Date();
  let scheduled = streams.filter((stream) => date < stream.dt_start);
  let ended = streams.filter((stream) => date >= stream.dt_end);
  let playing = streams.filter((stream) => date < stream.dt_end && date >= stream.dt_start);

  function show(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = 'unset';
    }
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.style.backgroundColor = '#b9669f';
  }

  onMount(function () {
    // Get the element with id="defaultOpen" and click on it
    document.getElementById('defaultOpen').click();
  });
</script>

<div class="outer">
  <div class="tab">
    <button class="tablinks" on:click={(event) => show(event, 'Scheduled')} id="defaultOpen">Scheduled</button>
    <button class="tablinks" on:click={(event) => show(event, 'Playing')}>Playing</button>
    <button class="tablinks" on:click={(event) => show(event, 'Ended')}>Ended</button>
  </div>

  <div id="Scheduled" class="tabcontent">
    {#each scheduled as stream}
      <StreamRow style="align-self: flex-start;" title={stream.title} time={stream.dt_start} uuid={stream.uuid} />
    {/each}
  </div>

  <div id="Playing" class="tabcontent">
    {#each playing as stream}
      <StreamRow style="align-self: flex-start;" title={stream.title} time={stream.dt_start} uuid={stream.uuid} />
    {/each}
  </div>

  <div id="Ended" class="tabcontent">
    {#each ended as stream}
      <StreamRow style="align-self: flex-start;" title={stream.title} time={stream.dt_start} uuid={stream.uuid} />
    {/each}
  </div>
</div>

<style>
  .outer {
    width: 100%;
    height: 60%;
  }

  /* Style the tab */
  .tab {
    overflow: hidden;
    background-color: unset;
    text-align: center;
    display: flex;
    justify-content: space-between;
    height: auto;
  }

  /* Style the buttons inside the tab */
  .tab button {
    background-color: inherit;
    border-radius: 20px;
    border: none;
    color: white;
    outline: none;
    cursor: pointer;
    transition: 0.3s;
    font-size: 32px;
    padding: 10px 20px;
  }

  /* Change background color of buttons on hover */
  .tab button:hover {
    background-color: rgba(185, 102, 159, 0.7);
  }

  /* Style the tab content */
  .tabcontent {
    display: none;
    overflow-y: auto;
    padding: 0px;
    margin: 0px;
    height: 80%;
  }
</style>
