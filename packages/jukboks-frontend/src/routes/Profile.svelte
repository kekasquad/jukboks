<script>
  // TODO: add func to button
  // TODO: add streams
  import { navigate } from 'svelte-navigator';
  import StreamsView from '../components/stream/StreamsView.svelte';
  import Heading from '../components/Heading';
  import Button from '../components/Button';
  import Loader from '../components/Loader';
  import { me } from '../utils/api';
  import { token, username } from '../utils/stores';

  let background = '/img/backgrounds/userPage.png';

  let promise = me();

  function scheduleStream() {
    navigate('/new/stream', { replace: true });
  }

  function logout() {
    token.set(null);
    username.set(null);
  }
</script>

{#await promise}
  <Loader />
{:then user}
  <div class="outer" style="background: url({background}); background-size: cover; background-position: center;">
    <div class="welcome">
      <Heading heading={'Welcome, ' + user.name} style="align-self: flex-start;" />
      <div class="logout" on:click={logout}>Logout</div>
    </div>
    <Heading heading="Your streams" style="align-self: flex-start; margin-top: 30px" />
    <StreamsView streams={user.streams} />
    <Button title="Schedule new" style="margin-top: auto; align-self: flex-end;" func={scheduleStream} />
  </div>
{:catch error}
  {#await error.response.json() then j}
    <p style="color: red">{j.error}</p>
  {/await}
{/await}

<style>
  .outer {
    color: white;
    width: 90%;
    height: 93vh;
    padding: 5vh 5% 2vh;
    margin: 0px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .welcome {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .logout {
    cursor: pointer;
    font-size: 32px;
  }
</style>
