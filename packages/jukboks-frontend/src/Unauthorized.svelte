<script>
  import { Link } from "svelte-routing";
  // function signIn() {
  //   navigate("/signin", { replace: true });
  // }
</script>

<div class="outer">
  <h1>You are not Unauthorized :(</h1>
  <h1>To continue you should <Link to="/signin">login</Link></h1>
</div>

<style>
  .outer {
    width: 100%;
    height: 100vh;
    padding: 0px;
    margin: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
