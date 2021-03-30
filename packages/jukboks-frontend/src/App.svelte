<script>
  let background = "/img/backgrounds/mainPage.png";
  let vectorSvg = "/img/backgrounds/mainPageVector.svg";
  let intro = "img/stuff/mainPageIntro.png";
</script>

<div
  class="outerMain"
  style="background: url({background}); background-size: cover; background-position: center;"
>
  <div
    class="innerMain"
    style="background: url({vectorSvg}); background-size: 100% 100%;"
  >
    <h1>jukboks</h1>
  </div>
</div>

<div class="outerSecondary">
  <h2 id="first">For artists, DJ’s, creators</h2>
  <h2 id="second">by software engeneers</h2>
  <img src={intro} alt="intro" />
  <h1>Create live streams</h1>
  <div class="preview">
    <h1>Video preview</h1>
  </div>
  <h1>Get reactions</h1>
  <h1>Promote your music</h1>
</div>

<style>
  .outerMain {
    width: 100vw;
    height: 100vh;
    padding: 0px;
    margin: 0px;
    display: flex;
    justify-content: center; /*Центрирование по горизонтали*/
    align-items: center; /*Центрирование по вертикали */
  }

  .innerMain {
    width: 450px;
    height: 450px;
    z-index: 10;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .innerMain h1 {
    font-size: 72px;
    line-height: 81px;
    color: #ffffff;
  }

  .outerSecondary {
    width: 100vw;
    height: auto;
    background: linear-gradient(180deg, #b9669f 0%, #9adff2 100%);
    display: flex;
    flex-direction: column;
  }

  .outerSecondary h2 {
    font-size: 36px;
    line-height: 40px;
    color: #000000;
    margin: 0vh 12.5vw;
  }

  .outerSecondary h2[id="first"] {
    margin-top: 10vh;
  }

  .outerSecondary h2[id="second"] {
    margin-top: 5vh;
    align-self: flex-end;
    text-align: right;
  }

  .outerSecondary img {
    margin: 1.5vh 12.5vw 8.5vh;
    height: 75vh;
  }

  .outerSecondary h1 {
    margin: 1.5vh 12.5vw 0vh;
    font-size: 72px;
    line-height: 81px;
    color: #000000;
  }

  .preview {
    margin: 5vh 12.5vw 4.5vh;
    height: 50vh;
    text-align: center;
    background-color: aqua;
  }



  /* @media (min-width: 640px) {
    main {
      max-width: none;
    }
  } */
</style>
