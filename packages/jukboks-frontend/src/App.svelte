<script>
  let background = "/img/backgrounds/mainPage.png";
  let vectorSvg = "/img/backgrounds/mainPageVector.svg";
</script>

<div class='outerMain' style="background: url({background}); background-size: 100% 100%;">
  <div class='innerMain' style="background: url({vectorSvg}); background-size: 100% 100%;">
    <h1>jukboks</h1>
  </div>
</div>

<div class='outerSecondary'>
  <div class='innerSecondary'>
  </div>
</div>

<style>

  .outerMain {
    width: 100vw;
    height: 100vh;
    padding: 0px;
    margin: 0px;
    display: flex;
    justify-content: center; /*Центрирование по горизонтали*/
    align-items: center;     /*Центрирование по вертикали */
  }

  .innerMain {
    width: 450px;
    height: 450px;
    /* background: url("/img/backgrounds/mainPageVector.svg"); */
    /* background-size: 100% 100%; */
    z-index: 10;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .innerMain h1 {
    font-style: normal;
    font-weight: normal;
    font-size: 72px;
    line-height: 81px;
    color: #FFFFFF;
  }

  .outerSecondary {
    width: 100vw;
    height: 200vh;
    background: linear-gradient(180deg, #B9669F 0%, #9ADFF2 100%);;
  }

  /* @media (min-width: 640px) {
    main {
      max-width: none;
    }
  } */
  
</style>
