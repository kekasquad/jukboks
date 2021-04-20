<script>
  import Loader from '../components/Loader';
  import Button from '../components/Button.svelte';
  import Input from '../components/Input.svelte';
  import Datepicker from 'svelte-calendar';
  import { getSong } from '../utils/api';

  let background = '/img/backgrounds/createStreamPage.png';
  let inputURL = '';

  let start = new Date();
  let end = new Date();
  end.setMonth(start.getMonth() + 3);
  let formattedSelected;

  function add() {
    getSong(inputURL);
  }

  function createStream() {
    console.log(formattedSelected);
    // let id;
    // navigate('/stream/{id}', { replace: true });
  }
</script>

<div class="outer" style="background: url({background}); background-size: cover; background-position: center;">
  <div class="left">
    <Input placeholder="Soundcloud track url" style="align-self: flex-start; width: 100%;" bind:value={inputURL} />
    <Button title="Add" style="align-self: flex-end;" func={add} />
    <Datepicker {start} {end} style="width: 100%; display: block;" bind:formattedSelected>
      <button class="calendar">{formattedSelected}</button>
    </Datepicker>
  </div>
  <div class="right">
    <Button title="Schedule" style="margin-top: auto; align-self: flex-end;" func={createStream} />
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
  }

  .calendar {
    display: block;
    width: 100%;
    background-color: rgba(185, 102, 159, 0.7);
    border-color: transparent;
    color: white;
  }
</style>
