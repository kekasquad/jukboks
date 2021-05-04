<script>
  import { onMount } from 'svelte';
  import { SC } from './api';
  import { song } from '../../utils/stores';

  let widget;
  let sc;

  var options = [];
  options.auto_play = true;
  const onSongChange = (song) => {
    if (sc) {
      sc.load(song.url, options);
    }
  };
  $: onSongChange($song);

  let songUrl = $song.url;
  let offset = $song.offset;

  // Need onmount, since we can only bind after `sc` is set to Element
  onMount(() => {
    console.log('Mounted');
    console.log(widget);

    sc = SC.Widget(widget);

    sc.bind(SC.Widget.Events.READY, () => {
      console.log('READY');
      if (offset && offset > 0) {
        //offset - milliseconds
        sc.seekTo(offset);
      }
    });

    sc.bind(SC.Widget.Events.PLAY, () => {
      sc.getCurrentSound((s) => {
        console.log(`PLAYING`);
        console.dir(s);
      });
    });
  });
</script>

<iframe
  id="widget"
  title="SoundCloud Widget"
  bind:this={widget}
  src="https://w.soundcloud.com/player/?url={songUrl}&auto_play=true"
  allow="autoplay"
/>

<style>
  #widget {
    z-index: -1;
    display: none;
  }
</style>
