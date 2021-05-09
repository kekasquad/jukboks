<script>
  import Shadow from '../Shadow';
  import Loader from '../Loader';
  import { fade } from 'svelte/transition';
  import Title from '../Title';
  import * as api from '../../utils/api';

  export let isPopupShown;
  export let popupText;
  export let streamUuid;

  let isContentShown = false;

  let currentTrack;
  let nextTrack;
  let live;
  //TODO: add controls bool values;
  let textAreaMessage = '';
  let getStreamInfoError;

  function showPopup(text) {
    popupText = text;
    isPopupShown = true;
    setTimeout(function () {
      popupText = '';
      isPopupShown = false;
    }, 5000);
  }

  async function showPanel() {
    try {
      let streamInfo = await api.getStreamInfo(streamUuid);
      if (streamInfo) {
        currentTrack = streamInfo.current;
        if (streamInfo.next) {
          nextTrack = streamInfo.next;
        } else {
          nextTrack = '-';
        }

        live = streamInfo.live;
        isContentShown = true;
      } else {
        console.log('Something wrong with method getStreamInfo');
      }
    } catch (err) {
      getStreamInfoError = (await err.response.json()).error;
      console.error(err);
      showPopup('Something has happened');
    }
  }

  showPanel();

  function share() {
    navigator.clipboard.writeText(window.location.href).then(
      function () {
        showPopup('Link was copied to the clipboard!');
      },
      function () {
        console.log('not cliped');
      },
    );
  }

  async function send() {
    try {
      if (textAreaMessage && textAreaMessage.length > 0) {
        await api.sendMessage(streamUuid, textAreaMessage);
        textAreaMessage = '';
      } else {
        showPopup('First add some text!');
      }
    } catch {
      showPopup('Something has happened');
    }
  }
</script>

<div class="panel" in:fade={{ duration: 100, delay: 150 }} out:fade={{ duration: 100 }}>
  <Shadow />
  {#if isContentShown}
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
        <textarea class="message" bind:value={textAreaMessage} type="text" placeholder="Type your message" />
        <div class="button" on:click={send} style="margin-left: auto;">Send</div>
      </div>
    </div>
  {:else}
    <Loader />
  {/if}
</div>

<style>
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
