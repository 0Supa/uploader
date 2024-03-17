<script>
    import Icon from "./Icon.svelte";
</script>

<h1 class="title">
    <Icon class="icon" src="/static/heart.svg"></Icon>
    Support
</h1>

<p><b>i.supa.codes</b> is an entirely free and ad-less service sustained without profit in mind.<br />Every donation is greatly appreciated!</p>

<p>
    <b>Bitcoin:</b><br />
    <code>bc1qxnvm9cpmphnzqn36dyktkqgfay7d9g3mz8y8fv</code>
</p>

<p>
    <b>Monero:</b><br />
    <code>42oX4zS59RG8vxD3gjiR2oT3YcXpoSgMuP45nhyyUa6XERR19XknyV1B7r7qeF1JwFWSuc5rkCmxEfJEoEcggmFVHjmUEtv</code>
</p>

<p>
    <a href="https://www.twitch.tv/subs/u_pa__" target="_blank"><b>Subscribe on Twitch</b></a>
</p>

<style lang="scss">
    .title {
        color: rgb(var(--fg2));
    }

    .title :global(.icon) {
        vertical-align: middle;
        width: 1em;
        height: 1em;
        animation: pulse 0.8s ease-in infinite alternate;
    }

    @keyframes pulse {
        to {
            transform: scale(1.25);
            background-color: #c81919;
        }
    }
</style>
