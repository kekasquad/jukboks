<script>
  // TODO: add func to button
  // TODO: add streams
  import Unauthorized from "./Unauthorized.svelte";
  import Row from "./stuff/Row.svelte";
  import Heading from "./stuff/Heading.svelte";
  import Button from "./stuff/Button.svelte";
  import { Link, navigate } from "svelte-routing";
  import { me } from "./stuff/network";
  let background = "/img/backgrounds/UserPage.png";

  let token = localStorage.getItem("token");
  let authorized = false;
  let promise;
  if (token != null) {
    authorized = true;
    promise = me(token);
  }
</script>

{#if !authorized}
  <Unauthorized />
{:else}
  {#await promise}
    <h1>loading...</h1>
  {:then user}
    <div
      class="outer"
      style="background: url({background}); background-size: cover; background-position: center;"
    >
      <Heading
        heading={"Welcome, " + user.name}
        style="align-self: flex-start;"
      />
      <Heading
        heading="Your streams"
        style="align-self: flex-start; margin-top: 30px"
      />
      <Button
        title="Schedule new"
        style="margin-top: auto; align-self: flex-end;"
      />
    </div>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
{/if}

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
    background: url();
  }
</style>
