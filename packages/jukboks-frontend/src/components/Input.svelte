<script>
  export let placeholder;
  export let style;
  export let value = '';
</script>

<input class="field" {placeholder} {style} bind:value />

<style>
  :root {
    --fieldHeight: 38px;
    --fieldFont: 32px;
  }

  .field {
    background: rgba(185, 102, 159, 0.7);
    border-radius: 30px;
    border-color: transparent;
    font-size: var(--fieldFont);
    line-height: var(--fieldHeight);
    color: #ffffff;
  }

  input::placeholder {
    color: #cccccc;
    font-size: var(--fieldFont);
    line-height: var(--fieldHeight);
    text-align: center;
  }
</style>
