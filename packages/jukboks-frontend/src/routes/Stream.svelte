<script>
  export let uuid;
  import Heading from '../components/Heading';
  import Loader from '../components/Loader';
  import * as api from '../utils/api';

  let background = '/img/backgrounds/streamPage.png';

  let promise = api.getStream(uuid);
</script>

{#await promise}
  <Loader />
{:then stream}
  <div class="outer" style="background: url({background}); background-size: cover; background-position: center;">
    la
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
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
    justify-content: center;
    align-items: center;
  }
</style>
