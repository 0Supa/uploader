<script>
    import { page } from "$app/stores";
    import Icon from "$lib/components/Icon.svelte";
    import {
        loadSettings,
        saveSettings,
        userSettings,
    } from "$lib/userSettings.js";
    import { onMount } from "svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import Donate from "$lib/components/Donate.svelte";
    import umami from "$lib/umami.js";

    /** @typedef {import("$lib/types.js").Theme} Theme */

    /** @type {Theme[]} */
    const themes = ["light", "dark", "amoled", "catppuccin"];

    /** @type {HTMLDialogElement} */
    let donateDialog;

    onMount(() => {
        loadSettings();
    });

    const changeTheme = (
        /** @type {MouseEvent} */ e,
        /** @type {Theme} */ theme,
    ) => {
        e.preventDefault();

        $userSettings.theme = theme;
        saveSettings();
    };
</script>

<svelte:head>
    <title
        >{$page.url.hostname}{(() => {
            const path = $page.url.pathname.slice(1);
            return path ? ` / ${path}` : "";
        })()}</title
    >
    <link
        rel="stylesheet"
        href="/static/styles/{$userSettings.theme || 'dark'}.css"
    />
    <script
        defer
        src="https://umami.supa.codes/script.js"
        data-website-id={umami[$page.url.hostname]}
    ></script>
</svelte:head>

<main>
    <div class="wrapper">
        <Dialog bind:node={donateDialog}>
            <section>
                <Donate></Donate>
            </section>
        </Dialog>

        <header class="header">
            <!-- Logo-name -->
            <h1 class="header__name pride">{$page.url.hostname}</h1>
            <!-- Navbar -->
            <nav class="navbar">
                <div class="navbar__tabs">
                    <a href="/" class="navbar__tab"
                    aria-current={$page.url.pathname === "/"
                        ? "page"
                        : undefined}>Home</a>
                    <a href="/uploaders" class="navbar__tab"
                    aria-current={$page.url.pathname === "/uploaders"
                        ? "page"
                        : undefined}>Uploaders</a>
                </div>
                <div class="navbar__tabs">
                    <a href="https://github.com/0Supa/uploader" class="navbar__tab">
                        GitHub
                    </a>
                    <a href="/" class="navbar__tab"
                        on:click={(e) => {
                            e.preventDefault();
                            donateDialog.showModal();
                        }}
                    >
                        Support
                    </a>
                </div>
            </nav>
            <!-- Hr -->
            <hr class="hr">
        </header>

        <noscript>JavaScript is required for this website.</noscript>

        <details class="settings">
            <summary>Settings</summary>
            <div class="container">
                <div class="option themes">
                    <span>Theme:</span>
                    {#each themes as theme}
                        <a
                            href="/"
                            class="theme-name"
                            on:click={(e) => changeTheme(e, theme)}>{theme}</a
                        >
                    {/each}
                </div>
                <label class="option">
                    <input
                        type="checkbox"
                        id="file-ext"
                        name="file-ext"
                        bind:checked={$userSettings.appendFileExt}
                        on:change={saveSettings}
                    />
                    Append file extension to URL
                </label>
                <label class="option">
                    <input
                        type="checkbox"
                        id="file-history"
                        name="file-history"
                        bind:checked={$userSettings.rememberFileHistory}
                        on:change={saveSettings}
                    />
                    Remember upload history, stored locally
                </label>
                <label class="option">
                    <input
                        type="checkbox"
                        id="file-disposition"
                        name="file-disposition"
                        bind:checked={$userSettings.fileContentDisposition}
                        on:change={saveSettings}
                    />
                    Share your file's original name&nbsp;
                    <span
                        class="tooltip"
                        title="Enabling this will show your file's original (local) name to other users in supported browsers; e.g. when saving."
                        >( ? )</span
                    >
                </label>
                <label class="option">
                    <input
                        type="checkbox"
                        id="file-stripexif"
                        name="file-stripexif"
                        bind:checked={$userSettings.stripExif}
                        on:change={saveSettings}
                    />
                    Entirely strip Exif data from image
                </label>
            </div>
        </details>

        <slot />
    </div>
</main>

<style lang="scss">
    :root {
        --font-body: "Roboto", -apple-system, BlinkMacSystemFont, "Apple Color Emoji", "Segoe UI", Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    }

    main {
        display: flex;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        background-color: rgb(var(--bg));
        font-family: var(--font-body);
        color: rgb(var(--fg));
    }

    [aria-current="page"] {
        text-decoration: overline;
    }

    h1 {
        font-size: 2rem;
    }

    input {
        font-size: inherit;
        font-family: inherit;
        margin-left: 0;
        accent-color: rgb(var(--primary));

        &:focus:not(:focus-visible) {
            outline: none;
        }
    }

    @media screen and (max-width: 800px) {
        .wrapper {
            width: 100%;
        }
    }

    .settings {
        display: flex;
        background-color: rgb(var(--bg_h));
        width: fit-content;
        border-radius: 0.45rem;
        gap: 2px;
        flex-direction: column;

        outline: 1px solid rgb(var(--outl2));

        &[open] {
            background-color: rgb(var(--bg2));
            summary {
                // margin-bottom: 5px;
                border-bottom: 2px solid rgb(var(--primary));
            }
        }

        summary {
            cursor: pointer;
            padding: 0.35rem 1rem 0.35rem 1rem;
        }

        .container {
            display: flex;
            flex-direction: column;
            padding: 0.25rem 0.5rem;
        }
    }

    .option {
        display: flex;
        align-items: center;
        max-width: max-content;
    }

    .themes {
        gap: 1ch;
        margin: 5px 0;
    }

    .tooltip {
        cursor: help;
        text-decoration: underline dotted;
    }


    .wrapper {
        width: 700px;
        padding: 10px;
    }

    /* Header */

    .header {
        display: flex;
        flex-direction: column;
        align-items: center;
    }


    .header__name {
        display: inline-block;
        text-transform: uppercase;
        margin: 10px 0 0;
        padding: 0;
        overflow: auto;
        font-weight: 800;
        font-size: 32px;

        &:hover {
            cursor: pointer;
        }
    }

    /* Navbar */

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0 6px;
        width: 100%;
    }

    .navbar__tabs {
        display: flex;
        align-items: center;
    }

    .navbar__tab {
        margin: 0 2px;
        padding: 1px 8px;
        border-radius: 4px;
        color: rgb(var(--fg));

        &:hover {
            cursor: pointer;
            text-decoration: none;
        }

        &:visited {
            text-decoration: none;
        }
    }

    .navbar__tab[aria-current="page"] {
        text-decoration: none;
        border: 2px solid rgb(var(--primary));
        color: rgb(var(--fg));
        margin: 0;
    }

    .navbar__button {
        height: 27px;
        border-color: rgb(var(--primary));
        display: flex;
        align-items: center;
    }

    .button__icon {
        width: 18px;
        height: 18px;
        fill: white;

        &:hover {
            fill: rgb(var(--primary));
        }
    }


    .navbar__links {
        list-style: none;
    }

    .hr {
        margin: 0 0 10px;
        background-color: rgb(var(--primary));
        border-radius: 0.45rem;
        border: none;
        height: 2px;
        width: 100%;
    }

    ul {
        display: flex;
        height: 22px;
        flex-direction: row;
        padding: 0;
        margin: 0;
        list-style-type: none;
    }

    li {
        display: inline-flex;
        height: 100%;
        align-items: center;
        &:not(:last-child)::after {
            content: "•";
            margin: 0 0.5ch;
        }
    }

    .support-btn {
        color: rgb(var(--fg2));
        display: flex;
        height: 100%;
        font-weight: 500;
        background-color: rgb(var(--bg2));
        border-radius: 0.25rem;
        align-items: center;
        padding: 0 0.35rem;

        outline: 1px solid rgb(var(--outl2));

        :global(.icon) {
            margin-right: 2px;
            width: 1em;
            height: 1em;
        }

        &:hover :global(.icon) {
            background-color: #c81919;
        }
    }

    .theme-name {
        text-transform: capitalize;
    }

    .pride {
        background-image: linear-gradient(
            to right,
            #e50000,
            #ff8d00,
            #ffee00,
            #028121,
            #004cff,
            #770088
        );
        background-clip: text;
        color: transparent;
    }
</style>
