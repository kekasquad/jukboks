<script>
  // TODO: add func to button
  // TODO: add streams
  let background = "/img/backgrounds/UserPage.png";
  import Unauthorized from "./Unauthorized.svelte";
  import Row from "./stuff/Row.svelte";
  import Heading from "./stuff/Heading.svelte";
  import Button from "./stuff/Button.svelte";
  import { Link, navigate } from "svelte-routing";

  let token = localStorage.getItem("token");
  let authorized = false;
  let heading;
  let streams;
  if (token != null) {
    authorized = true;
    async function me() {
      try {
        const res = await fetch("http://localhost:8080/me", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        let json = await res.json();

        if (!res.ok) {
          throw new Error(json.message);
        }

        console.log(json);
        heading = "Welcome, " + json.name;
        streams = json.streams;
      } catch (e) {
        alert(e);
      }
    }
    me();
  }
</script>

{#if !authorized}
  <Unauthorized />
{:else}
  <div
    class="outer"
    style="background: url({background}); background-size: cover; background-position: center;"
  >
    <Heading bind:heading style="align-self: flex-start;" />
    <Heading
      heading="Your streams"
      style="align-self: flex-start; margin-top: 30px"
    />
    <Button
      title="Schedule new"
      style="margin-top: auto; align-self: flex-end;"
    />
  </div>
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
