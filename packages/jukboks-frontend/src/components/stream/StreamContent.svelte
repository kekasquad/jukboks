<script>
  import { fade } from 'svelte/transition';
  import Loader from '../Loader';
  import Title from '../Title';
  import Widget from '../souncloud/Widget';
  import { song, username, message } from '../../utils/stores';
  import Shadow from '../Shadow';
  import Popup from '../Popup';
  import * as api from '../../utils/api';

  export let stream;

  let isPanelShown = false;
  let isPopupShown = false;

  let popupText = '';

  let currentTrack;
  let nextTrack;
  let live;
  //TODO: add controls bool values;
  let getStreamInfoError;

  async function showPanel() {
    try {
      let streamInfo = await api.getStreamInfo();
      if (streamInfo) {
        currentTrack = streamInfo.current;
        nextTrack = streamInfo.next;
        live = streamInfo.live;
        isPanelShown = true;
      } else {
        console.log('Something wrong with method getStreamInfo');
      }
    } catch (err) {
      getStreamInfoError = (await err.response.json()).error;
      console.error(err);
    }
    isPanelShown = true;
  }

  function handleKeydown(event) {
    if (event.keyCode == 27) {
      isPanelShown = false;
    }
  }

  function share() {
    navigator.clipboard.writeText(window.location.href).then(
      function () {
        popupText = 'Link was copied to the clipboard!';
        isPopupShown = true;
        setTimeout(function () {
          popupText = '';
          isPopupShown = false;
        }, 5000);
      },
      function () {
        console.log('not cliped');
      },
    );
  }

  const onMessage = (message) => {
    popupText = message;
    isPopupShown = true;
    setTimeout(function () {
      popupText = '';
      isPopupShown = false;
    }, 5000);
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
      <div class="panel" in:fade={{ duration: 100, delay: 150 }} out:fade={{ duration: 100 }}>
        <Shadow />
        <div class="info" style="margin-top: 70px;">
          <div class="row">
            <Title title="Currently playing:" style="width: 40%; margin-right: 5%;" />
            <Title bind:title={currentTrack} style="width: 55%; text-align: left;" />
          </div>
          <div class="row" style="margin-top: 24px;">
            <Title title="Next:" style="width: 40%; margin-right: 5%;" />
            <Title bind:title={nextTrack} style="width: 55%; text-align: left;" />
          </div>
          <div class="row" style="margin-top: 24px;">
            <Title title="Live:" style="width: 40%; margin-right: 5%;" />
            <Title bind:title={live} style="width: 55%; text-align: left;" />
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
          <div class="button" on:click={share}>Share</div>
          <div class="messageContainer">
            <textarea class="message" type="text" placeholder="Type your message" />
            <div class="button" style="margin-left: auto;">Send</div>
          </div>
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
    align-items: flex-end;
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
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .button {
    font-size: 32px;
    line-height: 36px;
    width: min-content;
    cursor: pointer;
    position: relative;
  }

  .messageContainer {
    display: flex;
    flex-direction: column;
    z-index: 1;
    align-items: center;
    width: 30%;
  }

  .message {
    width: 100%;
    height: 20vh;
    color: white;
    background: transparent;
    resize: none;
  }
</style>
