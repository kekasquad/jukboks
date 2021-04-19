<script>
  // TODO: add func to button
  // TODO: add streams
  import { navigate } from 'svelte-navigator';
  import Row from '../components/Row.svelte';
  import Heading from '../components/Heading.svelte';
  import Button from '../components/Button.svelte';
  import Loader from '../components/Loader';
  import { me } from '../utils/network';
  import { token, username, userName } from '../utils/stores';

  let background = '/img/backgrounds/userPage.png';

  let tokenValue;

  const subscribe = token.subscribe((value) => {
    tokenValue = value;
  });

  let promise = me(tokenValue);

  function scheduleStream() {
    navigate('/new/stream', { replace: true });
  }

  async function saveUser() {
    let json = await promise;
    localStorage.setItem('username', json.username);
    localStorage.setItem('userName', json.name);
    username.set(localStorage.getItem('username'));
    userName.set(localStorage.getItem('userName'));
  }
  saveUser();
</script>

{#await promise}
  <Loader />
{:then user}
  <div class="outer" style="background: url({background}); background-size: cover; background-position: center;">
    <Heading heading={'Welcome, ' + user.name} style="align-self: flex-start;" />
    <Heading heading="Your streams" style="align-self: flex-start; margin-top: 30px" />
    <Button title="Schedule new" style="margin-top: auto; align-self: flex-end;" func={scheduleStream} />
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  .outer {
    width: 90%;
    height: 93vh;
    padding: 5vh 5% 2vh;
    margin: 0px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
</style>
