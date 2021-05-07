<script>
  import { fade } from 'svelte/transition';
  import Loader from '../Loader';
  import Title from '../Title';
  import Widget from '../souncloud/Widget';
  import { song, username } from '../../utils/stores';
  import Shadow from '../Shadow.svelte';

  export let stream;

  let isPanelShown = false;

  function showPanel() {
    isPanelShown = true;
  }

  function handleKeydown(event) {
    if (event.keyCode == 27) {
      isPanelShown = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $song}
  <div class="outer" in:fade={{ duration: 100, delay: 150 }} out:fade={{ duration: 100 }}>
    {#if isPanelShown}
      <div class="panel" in:fade={{ duration: 100, delay: 150 }} out:fade={{ duration: 100 }}>
        <Shadow />
        <div class="info" style="margin-top: 70px;">
          <div class="row">
            <Title title="Currently playing:" style="width: 40%; margin-right: 5%;" />
            <Title title="ii" style="width: 55%; text-align: left;" />
          </div>
          <div class="row" style="margin-top: 24px;">
            <Title title="Next:" style="width: 40%; margin-right: 5%;" />
            <Title title="ooooo" style="width: 55%; text-align: left;" />
          </div>
          <div class="row" style="margin-top: 24px;">
            <Title title="Live:" style="width: 40%; margin-right: 5%;" />
            <Title title="qqqqq" style="width: 55%; text-align: left;" />
          </div>
        </div>
        <div class="info" style="margin-top: 50px;">
          <div class="row">
            <Title title="Controls:" style="width: 40%; margin-right: 5%; align-self: flex-start;" />
            <div class="controls" style="width: 55%; text-align: left;">
              <Title title="ell" style="width: 100%;" />
              <Title title="pufpufpuf" style="width: 100%;" />
            </div>
          </div>
        </div>
        <div class="bottomButtons">
          <div><div class="button" style="margin-right: auto;">Next</div></div>
          <div style="display: flex; justify-content: center;"><div class="button">Share</div></div>
          <div><div class="button" style="margin-left: auto;">Send</div></div>
        </div>
      </div>
    {:else}
      <div class="content" in:fade={{ duration: 100, delay: 150 }} out:fade={{ duration: 100 }}>
        <div class="head">
          {#if stream.author.username == $username}
            <div class="admin" on:click={showPanel}>Admin</div>
          {/if}
          <Title title="{stream.title} by {stream.author.username}" style="grid-area: title;" />
        </div>
        <Title
          title="{$song.title} by {$song.artist}"
          style="align-self: flex-start; margin-top: auto; text-align: left;"
        />
      </div>
    {/if}

    <Widget />
  </div>
{:else}
  <Loader />
{/if}

<style>
  .outer {
    color: white;
    width: 96%;
    height: 96%;
    padding: 2% 2% 2%;
    margin: 0px;
    display: flex;
    flex-direction: column;
    z-index: 0;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
  }

  .content {
    /* width: 96%;
    height: 96%;
    padding: 2% 2% 2%; */
    width: 100%;
    height: 100%;
    margin: 0px;
    display: flex;
    flex-direction: column;
    z-index: 0;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
  }

  .head {
    display: inline-grid;
    grid-template-columns: repeat(5, 1fr);
    width: 100%;
    grid-template-areas: 'admin title title title temp';
  }

  .admin {
    font-size: 32px;
    line-height: 36px;
    align-self: flex-start;
    position: relative;
    justify-self: start;
    cursor: pointer;
    grid-area: admin;
  }

  .panel {
    display: flex;
    flex-direction: column;
    z-index: 1;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    width: 100%;
    height: 100%;
  }

  .info {
    display: flex;
    flex-direction: column;
    z-index: 1;
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }

  .row {
    display: flex;
    flex-direction: row;
    z-index: 1;
    justify-content: center;
    align-items: center;
    text-align: right;
    width: 100%;
  }

  .controls {
    display: flex;
    flex-direction: column;
    z-index: 1;
    align-items: center;
    width: 100%;
  }

  .bottomButtons {
    width: 100%;
    margin-top: auto;
    z-index: 1;
    display: inline-grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .button {
    font-size: 32px;
    line-height: 36px;
    width: min-content;
    cursor: pointer;
    position: relative;
  }
</style>
