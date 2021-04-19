<script>
  export let title;
  export let func;
  export let style;
</script>

<button class="button" on:click={func} {style}>
  <h1>{title}</h1>
</button>>

<style>
  h1 {
    padding: 0px;
    margin: 0px;
    font-size: 48px;
    line-height: 54px;
    color: #ffffff;
  }

  .button {
    padding: 0px;
    margin: 0px;
    background-color: transparent;
    border-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button:hover {
    cursor: pointer;
  }
</style>
