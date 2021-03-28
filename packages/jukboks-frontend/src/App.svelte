<script>
  let background = "/img/backgrounds/mainPage.png";
  let vectorSvg = "/img/backgrounds/mainPageVector.svg";
</script>

<div class='outer'>
  <div class='inner' style="background: url({vectorSvg}); background-size: 100% 100%;">
    <h1>jukboks</h1>
  </div>
  <img src={background} alt="mainpicture" />
</div>

<style>

  .outer {
    width: 100vw;
    height: 100vh;
    padding: 0px;
    margin: 0px;
    display: flex;
    justify-content: center; /*Центрирование по горизонтали*/
    align-items: center;     /*Центрирование по вертикали */
  }

  img {
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0px;
    z-index: 1;
    position: absolute;
  }

  .inner {
    width: 400px;
    height: 400px;
    /* background: url("/img/backgrounds/mainPageVector.svg"); */
    /* background-size: 100% 100%; */
    z-index: 10;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  h1 {
    font-family: "Courier Prime";
    font-style: normal;
    font-weight: normal;
    font-size: 72px;
    line-height: 81px;
    color: #FFFFFF;
  }

  /* @media (min-width: 640px) {
    main {
      max-width: none;
    }
  } */
  
</style>
