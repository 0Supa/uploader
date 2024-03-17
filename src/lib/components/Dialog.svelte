<script>
    import Icon from "./Icon.svelte";

    /** @type {HTMLDialogElement} */
    export let node;
</script>

<dialog bind:this={node}>
    <a
        href="."
        class="close-btn"
        on:click={(e) => {
            e.preventDefault();
            node.close();
        }}>
        <Icon src="/static/close.svg"></Icon>
    </a>
    <section>
        <slot />
    </section>
</dialog>

<style lang="scss">
    dialog {
        background-color: rgb(var(--bg));
        color: rgb(var(--fg));
        border: 2px solid rgb(var(--primary));
        border-radius: 5px;
        padding: 5px;
        outline: none;
        word-wrap: break-word;
        overscroll-behavior: contain;

        &::backdrop {
            background-color: rgba(0, 0, 0, 0.2);
        }
    }

    .close-btn {
        width: 1.5rem;
        height: 1.5rem;
        cursor: pointer;
        position: absolute;
        top: 2px;
        right: 2px;
        text-decoration: none;
        opacity: 0.5;

        &:hover {
            opacity: 1;
        }
    }

    section {
        margin: 0 5px;
    }
</style>
