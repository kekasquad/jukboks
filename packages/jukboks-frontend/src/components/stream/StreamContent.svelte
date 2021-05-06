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
</script>

{#if $song}
  <div class="outer" in:fade={{ duration: 100, delay: 150 }} out:fade={{ duration: 100 }}>
    {#if isPanelShown}
      <div class="panel">
        <Shadow />
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
          <Title title="{stream.title} by {stream.author.username}" />
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
    grid-template-columns: 1fr 3fr 1fr;
    width: 100%;
  }

  .admin {
    font-size: 32px;
    line-height: 36px;
    align-self: flex-start;
    position: relative;
    justify-self: start;
    cursor: pointer;
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
