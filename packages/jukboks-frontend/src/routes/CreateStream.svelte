<script>
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import Loader from '../components/Loader';
  import Heading from '../components/Heading';
  import Button from '../components/Button';
  import Input from '../components/Input';
  import Datepicker from 'svelte-calendar';
  import { TimepickerUI } from 'timepicker-ui';
  import Song from '../components/Song';
  import * as api from '../utils/api';
  import { navigate } from 'svelte-navigator';

  let background = '/img/backgrounds/createStreamPage.png';
  let inputURL = '';
  let title = '';
  let time = '';
  let songs = [];
  let timePicker;
  let timePickerInput;

  onMount(() => {
    const newTimepicker = new TimepickerUI(timePicker, {
      mobile: true,
      enableSwitchIcon: true,
      theme: 'crane-radius',
    });
    newTimepicker.create();
  });

  let start = new Date();
  if (start.getHours() > 13) {
    time += start.getHours() - 12;
  } else {
    time += start.getHours();
  }
  time += ':';
  if (start.getMinutes() < 10) {
    time += '0' + start.getMinutes();
  } else {
    time += start.getMinutes();
  }
  if (start.getHours() > 13) {
    time += ' PM';
  } else {
    time += ' AM';
  }

  let end = new Date();
  end.setMonth(start.getMonth() + 3);

  let formattedSelected;
  let error;
  let createError;
  let selected;

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
    let timePickerInputValue = timePickerInput.value;
    let dayTime = timePickerInputValue.split(' ')[1];
    let hours = Number(timePickerInputValue.split(' ')[0].split(':')[0]);
    let minutes = Number(timePickerInputValue.split(' ')[0].split(':')[1]);
    if (dayTime == 'PM') {
      hours += 12;
    }
    if (hours == '24') {
      hours = 0;
    }
    console.log(dayTime, hours, minutes);

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
    <div style="display: flex; justify-content: space-between;">
      <Datepicker {start} {end} style="width: 55%;" bind:formattedSelected bind:selected>
        <button class="calendar">{formattedSelected}</button>
      </Datepicker>
      <div class="timepicker-ui" bind:this={timePicker} style="width: 40%">
        <input class="timepicker-ui-input" bind:value={time} bind:this={timePickerInput} style="width: 100%" />
      </div>
    </div>
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

  .timepicker-ui-input {
    background: rgba(185, 102, 159, 0.7);
    border-color: transparent;
    font-size: 16px;
    line-height: normal;
    color: #ffffff;
    text-align: center;
    width: auto;
  }

  .timepicker-ui-input::placeholder {
    color: #cccccc;
    font-size: 16px;
    line-height: normal;
    text-align: center;
  }
</style>
