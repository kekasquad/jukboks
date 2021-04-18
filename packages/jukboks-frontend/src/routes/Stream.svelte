<script>
  export let id;
  import Heading from "../components/Heading";
  import Loader from "../components/Loader";
  import { getStream } from "../utils/network";
  import { token } from "../utils/stores";

  let background = "/img/backgrounds/streamPage.png";

  let tokenValue;

  const subscribe = token.subscribe((value) => {
    tokenValue = value;
  });

  let promise = getStream(id, tokenValue);
</script>

{#await promise}
  <Loader />
{:then stream}
  lol
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
</style>
