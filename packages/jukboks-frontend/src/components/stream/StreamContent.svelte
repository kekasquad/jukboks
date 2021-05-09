<script>
  import { fade } from 'svelte/transition';
  import Loader from '../Loader';
  import Title from '../Title';
  import Widget from '../souncloud/Widget';
  import Panel from './Panel';
  import Popup from '../Popup';
  import * as api from '../../utils/api';
  import { song, username, message } from '../../utils/stores';

  export let stream;

  let isPanelShown = false;
  let isPopupShown = false;

  let popupText = '';

  function handleKeydown(event) {
    if (event.keyCode == 27) {
      isPanelShown = false;
    }
  }

  function showPopup(text) {
    popupText = text;
    isPopupShown = true;
    setTimeout(function () {
      popupText = '';
      isPopupShown = false;
    }, 5000);
  }

  async function showPanel() {
    isPanelShown = true;
  }

  const onMessage = (message) => {
    if (message) {
      showPopup(message);
    }
  };
  $: onMessage($message);
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $song}
  <div class="outer" in:fade={{ duration: 100, delay: 150 }} out:fade={{ duration: 100 }}>
    {#if isPopupShown}
      <Popup message={popupText} />
    {/if}
    {#if isPanelShown}
      <Panel bind:isPopupShown bind:popupText />
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
</style>
