<script>
  export let time;
  export let style;

  let date = new Date();
  date.setTime(time);
</script>

<div class="time" {style}>
  {date.toLocaleString()}
</div>

<style>
  .time {
    padding: 0px;
    margin: 0px;
    font-size: 36px;
    line-height: 40px;
    color: #ffffff;
  }
</style>
