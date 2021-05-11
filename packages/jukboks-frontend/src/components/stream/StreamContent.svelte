<script>
  import { fade } from 'svelte/transition';
  import { onDestroy } from 'svelte';
  import Loader from '../Loader';
  import Title from '../Title';
  import Widget from '../souncloud/Widget';
  import Panel from './Panel';
  import Emotion from './Emotion';
  import Popup from '../Popup';
  import * as api from '../../utils/api';
  import { song, username, message, reaction, listeners } from '../../utils/stores';

  export let stream;

  let container;

  let isPanelShown = false;
  let isPopupShown = false;

  let popupText = '';

  let emotions = [];

  function onInterval(callback, milliseconds) {
    const interval = setInterval(callback, milliseconds);

    onDestroy(() => {
      clearInterval(interval);
    });
  }

  $: seconds = 0;
  onInterval(() => (seconds += 1), 1000);
  function onSongChange(newSong) {
    if (newSong.offset) {
      seconds = Number(newSong.offset / 1000);
    } else {
      seconds = 0;
    }
  }
  $: onSongChange($song);

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

  function showReaction(text) {
    const id = Math.floor(Math.random() * 999);
    emotions = [...emotions, { text, id }];
  }

  function removeEmotion(event) {
    emotions = emotions.filter((arr) => arr.id !== event.detail.id);
  }

  async function showPanel() {
    isPanelShown = true;
  }

  async function sendReaction(emotion) {
    try {
      await api.sendReaction(stream.uuid, emotion);
    } catch {
      showPopup('Something has happened');
    }
  }

  const onMessage = (newMessage) => {
    if (newMessage) {
      showPopup(newMessage);
    }
  };
  $: onMessage($message);

  const onReaction = (newReaction) => {
    if (newReaction) {
      showReaction(newReaction);
    }
  };
  $: onReaction($reaction);
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $song}
  <div class="outer" in:fade={{ duration: 100, delay: 150 }} out:fade={{ duration: 100 }} bind:this={container}>
    {#if isPopupShown}
      <Popup message={popupText} />
    {/if}
    {#each emotions as emotion (emotion.id)}
      <div>
        <Emotion {emotion} on:change={removeEmotion} />
      </div>
    {/each}
    {#if isPanelShown}
      <Panel bind:isPopupShown bind:popupText streamUuid={stream.uuid} />
    {:else}
      <div class="content" in:fade={{ duration: 100, delay: 150 }} out:fade={{ duration: 100 }}>
        <div class="head">
          {#if stream.author.username == $username}
            <div class="admin" on:click={showPanel}>Admin</div>
          {/if}
          <Title title="{stream.title} by {stream.author.username}" style="grid-area: title;" />
          {#if stream.reactions}
            <div class="emotions">
              <div class="emotion" on:click={(event) => sendReaction('👍')}>👍</div>
              <div class="emotion" on:click={(event) => sendReaction('👎')}>👎</div>
              <div class="emotion" on:click={(event) => sendReaction('💜')}>💜</div>
            </div>
          {/if}
        </div>
        <div class="bottom">
          {#if stream.showSongs}
            <Title title="{$song.title} by {$song.artist}" style="text-align: left; grid-area: songTitle;" />
          {/if}
          <Title title="{$listeners}👁" style="text-align: right; grid-area: live;" />
        </div>
      </div>
    {/if}

    <Widget />
  </div>
  <div class="progress-bar">
    <svg width="100%" height="5px">
      <defs>
        <linearGradient id="gradient">
          <stop offset="{(seconds * 1000 * 100) / $song.duration}%" stop-color="#f1c40f" />
          <stop offset="100%" stop-color="#c0392b" />
        </linearGradient>

        <clipPath id="clip">
          <rect id="clipRect" width="100%" height="5px" />
        </clipPath>
      </defs>

      <rect width="100%" height="5px" clip-path="url(#clip)" fill="url(#gradient)" />
    </svg>
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
    grid-template-areas: 'admin title title title emotions';
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

  .emotions {
    grid-area: emotions;
    justify-self: end;
    display: flex;
    justify-content: flex-end;
  }

  .emotion {
    font-size: 28px;
    margin-left: 10px;
    cursor: pointer;
  }

  .bottom {
    margin-top: auto;
    display: grid;
    grid-template-columns: 85% 15%;
    width: 100%;
    grid-template-areas: 'songTitle live';
  }

  .progress-bar {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
</style>
