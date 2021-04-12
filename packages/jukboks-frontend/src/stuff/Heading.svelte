<script>
  export let heading;
  let stylish = $$props.style;
</script>

<div class="heading" style={stylish}>
  {heading}
</div>

<style>
  .heading {
    padding: 0px;
    margin: 0px;
    font-size: 48px;
    line-height: 54px;
    color: #ffffff;
  }
</style>
