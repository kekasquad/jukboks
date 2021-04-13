<script>
  import { Link } from "svelte-routing";
  import { signUp } from "./stuff/network";
  let background = "/img/backgrounds/mainPage.png";
  let vectorSvg = "/img/stuff/mainPageVector.svg";
  let join = "img/stuff/join.svg";
</script>

<div
  class="outerMain"
  style="background: url({background}); background-size: cover; background-position: center;"
>
  <div
    class="icon"
    style="background: url({vectorSvg}); background-size: 100% 100%;"
  >
    <h1>jukboks</h1>
  </div>

  <div class="authFields">
    <input class="field" id="username" placeholder="username" />
    <input class="field" id="name" placeholder="name" />
    <input class="field" id="password" placeholder="password" />
    <Link to="/signin">
      <h2>Already have an account?</h2>
    </Link>
    <button id="join" style="background: url({join});" on:click={signUp}>
      <h1>Join</h1>
    </button>
  </div>
</div>

<style>
  :root {
    --switchHeight: 25px;
    --switchFont: 22px;
    --fieldHeight: 38px;
    --fieldFont: 32px;
  }
  .outerMain {
    width: 90vw;
    height: 100vh;
    padding: 0px 5vw;
    margin: 0px;
    display: flex;
    justify-content: space-evenly; /*Центрирование по горизонтали*/
    align-items: center; /*Центрирование по вертикали */
  }

  button {
    background-color: transparent;
    border-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button[id="join"] {
    height: 60px;
    width: 130px;
  }

  button h1 {
    font-size: 36px;
    line-height: 40px;
    padding: 0px;
    margin: 0px;
    color: #ffffff;
  }

  h2 {
    margin: 0px;
    margin-bottom: 10px;
    padding: 0px;
    font-size: var(--switchFont);
    line-height: var(--switchHeight);
    color: #dddddd;
  }

  button:hover {
    cursor: pointer;
  }

  .icon {
    width: 450px;
    height: 450px;
    z-index: 10;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .icon h1 {
    font-size: 72px;
    line-height: 81px;
    color: #ffffff;
  }

  .authFields {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: center;
  }

  .field {
    background: rgba(185, 102, 159, 0.7);
    border-radius: 30px;
    border-color: transparent;
    font-size: var(--fieldFont);
    line-height: var(--fieldHeight);
    color: #ffffff;
    width: 30vw;
  }

  input::placeholder {
    color: #cccccc;
    font-size: var(--fieldFont);
    line-height: var(--fieldHeight);
  }

  .field[id="password"] {
    -webkit-text-security: disc;
  }

  /* @media (min-width: 640px) {
          main {
            max-width: none;
          }
        } */
</style>
