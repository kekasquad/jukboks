<script>
  import { fade } from 'svelte/transition';
  import Loader from '../components/Loader';
  import Heading from '../components/Heading';
  import Button from '../components/Button';
  import Input from '../components/Input';
  import Datepicker from 'svelte-calendar';
  import Song from '../components/Song';
  import * as api from '../utils/api';
  import { navigate } from 'svelte-navigator';

  let background = '/img/backgrounds/createStreamPage.png';
  let inputURL = '';
  let title = '';
  let songs = [];

  let start = new Date();
  let end = new Date();
  end.setMonth(start.getMonth() + 3);

  let formattedSelected;
  let error;
  let createError;
  let selected;
  let hours = 16;
  let minutes = 59;

  async function add() {
    let song = await api.getSong(inputURL);
    if (song.title && song.url && song.artist && song.duration) {
      songs.push(song);
      songs = songs;
      error = null;
    } else {
      error = "Can't parse URL";
    }
  }

  async function createStream() {
    if (songs.length == 0) {
      createError = 'Add some songs!';
      return;
    }
    if (title.length < 1) {
      createError = 'Add title!';
      return;
    }
    let dt_start = selected.getTime() + (hours * 60 + minutes) * 60 * 1000;
    let stream = { title, songs, dt_start };
    try {
      stream = await api.createStream(stream);
      if (stream) {
        console.log(stream);
        createError = null;
        navigate('/profile');
      } else {
        console.log('Something wrong with method createStream');
      }
    } catch (err) {
      createError = (await err.response.json()).error;
      console.error(err);
    }
  }
</script>

<div class="outer" style="background: url({background}); background-size: cover; background-position: center;">
  <div class="left">
    <Input
      placeholder="Soundcloud track url"
      style="align-self: flex-start; width: 100%; margin-top: 54px;"
      bind:value={inputURL}
    />
    {#if error}
      <div out:fade={{ duration: 100 }} in:fade={{ duration: 100 }}>{error}</div>
    {/if}
    <Button title="Add" style="align-self: flex-end;" func={add} />
    <Input
      placeholder="Stream title"
      style="align-self: flex-start; width: 100%; margin-top: 54px;"
      bind:value={title}
    />
    <Datepicker {start} {end} style="width: 100%; display: block;" bind:formattedSelected bind:selected>
      <button class="calendar">{formattedSelected}</button>
    </Datepicker>
  </div>
  <div class="right">
    <Heading heading="Added songs" style="text-align: left; align-self: flex-start;" />
    <div class="songs">
      {#each songs as song}
        <Song {song} />
      {/each}
    </div>
    <Button title="Schedule" style="margin-top: auto; align-self: flex-end;" func={createStream} />
    {#if createError}
      <div out:fade={{ duration: 100 }} in:fade={{ duration: 100 }}>{createError}</div>
    {/if}
  </div>
</div>

<style>
  .outer {
    width: 90%;
    height: 93vh;
    padding: 5vh 5% 2vh;
    margin: 0px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .left,
  .right {
    color: white;
    height: 100%;
    padding: 0px;
    margin: 0px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .left {
    width: 40%;
  }

  .right {
    width: 60%;
    margin-left: 5%;
  }

  .calendar {
    display: block;
    width: 100%;
    background-color: rgba(185, 102, 159, 0.7);
    border-color: transparent;
    color: white;
  }

  .songs {
    background-color: rgba(185, 102, 159, 0.7);
    border-radius: 30px;
    padding-top: 20px;
    width: 100%;
    height: 70%;
    overflow-y: auto;
  }
</style>
