<script>
    import { errors } from "./errorLog";
</script>

<p>Error log</p>
<div class="error-log">
    {#each $errors as err (err.id)}
        <div class="error">
            <code>{new Date(err.date).toISOString()}<br />{err.msg}</code>
        </div>
    {/each}
</div>

<style lang="scss">
    p {
        font-size: 1.2em;
        margin: 5px;
    }

    .error {
        margin: 10px;
        padding: 0 5px;
        border-left: 2px solid rgb(200, 0, 0);
        font-family: monospace;
    }
</style>
