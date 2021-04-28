<script>
  import { fade } from 'svelte/transition';
  import Loader from '../Loader';
  import Title from '../Title';
  import Widget from '../souncloud/Widget';
  import { song } from '../../utils/stores';

  export let stream;
</script>

{#if $song}
  <div class="outer" in:fade={{ duration: 100, delay: 150 }}>
    <Title title="{stream.title} by {stream.author.username}" />
    <Title
      title="{$song.title} by {$song.artist}"
      style="align-self: flex-start; margin-top: auto; text-align: left;"
    />
    <Widget url={$song.url} />
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
</style>
