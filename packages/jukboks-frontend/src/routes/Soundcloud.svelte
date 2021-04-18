<script>
    import { onMount } from "svelte";
    import { SC } from "../sc/api";
    export let url = "https://soundcloud.com/lustry/i-fell-into-your-brown-eyes";
    export let autoplay = true;

    let widget;
    let sc;
    let title;

    // functions
    let toggle;

    // Need onmount, since we can only bind after `sc` is set to Element
    onMount(() => {
        console.log("Mounted");
        console.log(widget);

        sc = SC.Widget(widget);
        
        sc.bind(SC.Widget.Events.READY, () => {
            console.log("READY")
            // if (autoplay) sc.play(); // WebAudio Policy wtf???
            // TODO: autoresume on user interaction
        });

        sc.bind(SC.Widget.Events.PLAY, () => {
            sc.getCurrentSound((s) => {
                title = s.title;
                console.log(`PLAYING`);
                console.dir(s);
            })
        })

        toggle = sc.toggle.bind(sc);
    })
</script>

<div>
    <h1>SoundCloud test page</h1>
    {#if title}
        <h2>{title}</h2>
    {/if}
    <button on:click={toggle}>Play/Pause</button>
    <iframe
        id="widget"
        title="SoundCloud Widget"
        bind:this={widget}
        src="https://w.soundcloud.com/player/?url={url}"
        allow={autoplay ? "autoplay": null}
        height={5000}
    ></iframe>
</div>

<style>
#widget {
	z-index: -1;
    display: none;
}
</style>