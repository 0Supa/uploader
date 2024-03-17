<script>
    export let src = "";
    export let color = "rgb(var(--fg2))";
</script>

<i class="icon {$$restProps.class}" style="--i: url({src}); --c: {color};"></i>

<style>
    .icon {
        background-color: var(--c);
        mask-image: var(--i);
        -webkit-mask-image: var(--i);
        width: 100%;
        height: 100%;
        display: inline-block;
    }
</style>
