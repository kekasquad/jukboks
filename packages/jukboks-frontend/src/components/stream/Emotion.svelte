<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  export let emotion;

  const dispatch = createEventDispatcher();

  function deleteEmotion(id) {
    dispatch('change', {
      id,
    });
  }

  setTimeout(function () {
    deleteEmotion(emotion.id);
  }, 1000);
</script>

<div class="emotion" in:fade={{ duration: 1000 }} out:fly={{ duration: 1000, y: -200 }}>{emotion.text}</div>

<style>
  .emotion {
    position: absolute;
    right: 20px;
    bottom: 60px;
    font-size: 32px;
  }
</style>
