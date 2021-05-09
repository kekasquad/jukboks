<script>
  export let title;
  export let func;
  export let style = '';
</script>

<div class="button" on:click={func} {style}>
  <h1>{title}</h1>
</div>

<style>
  h1 {
    padding: 0px;
    margin: 0px;
    font-size: 48px;
    line-height: normal;
    color: #ffffff;
  }

  .button {
    padding: 5px 10px;
    margin: 0px;
    background-color: transparent;
    border-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
  }

  .button:hover {
    cursor: pointer;
  }

  .button:active {
    background-color: rgba(185, 102, 159, 0.7);
  }
</style>
