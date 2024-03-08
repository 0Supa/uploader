<script>
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
        <i class="icon"></i>
    </a>
    <slot />
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
        position: sticky;
        top: 0;
        text-decoration: none;
        float: right;
        opacity: 0.5;
        transition: opacity 150ms;

        &:hover {
            opacity: 1;
        }
    }

    .icon {
        background-color: rgb(var(--fg2));
        mask-image: url("/static/close.svg");
        -webkit-mask-image: url("/static/close.svg");
        width: 100%;
        height: 100%;
        display: inline-block;
    }
</style>
