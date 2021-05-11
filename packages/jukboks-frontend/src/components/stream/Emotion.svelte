<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  export let emotion;

  const dispatch = createEventDispatcher();

  function deleteEmotion(id) {
    dispatch('change', {
      id,
    });
  }

  setTimeout(function () {
    deleteEmotion(emotion.id);
  }, 2000 + 400);
</script>

<div class="emotion" in:fade={{ duration: 400 }} out:fly={{ duration: 2000, y: -200, easing: cubicInOut }}>
  {emotion.text}
</div>

<style>
  .emotion {
    position: absolute;
    right: 20px;
    bottom: 60px;
    font-size: 32px;
  }
</style>
