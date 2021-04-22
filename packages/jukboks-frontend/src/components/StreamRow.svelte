<script>
  import { navigate } from 'svelte-navigator';

  export let title;
  export let time;
  export let uuid;
  export let style;

  let date = new Date();
  date.setTime(time);

  function openStream() {
    navigate('/stream/' + uuid);
  }
</script>

<div class="time" {style} on:click={openStream}>
  {title + ', ' + date.toLocaleString()}
</div>

<style>
  .time {
    padding: 0px;
    margin: 0px;
    font-size: 36px;
    line-height: 40px;
    color: #ffffff;
  }

  .time:hover {
    cursor: pointer;
  }
</style>
