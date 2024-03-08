<script>
    import { page } from "$app/stores";
    import { loadSettings, saveSettings, userSettings } from "$lib/userSettings.js";
    import { onMount } from "svelte";

    onMount(() => {
        loadSettings();
    });

    const changeTheme = (/** @type {MouseEvent} */ e) => {
        e.preventDefault();
        $userSettings.theme = $userSettings.theme === "light" ? "dark" : "light";
        saveSettings();
    };
</script>

<svelte:head>
    <title
        >{$page.url.hostname}{(() => {
            const path = $page.url.pathname.slice(1);
            return path ? ` / ${path}` : "";
        })()}</title>
    <link rel="stylesheet" href="/static/styles/{$userSettings.theme || 'dark'}.css" />
</svelte:head>

<main>
    <div class="wrapper">
        <h1 class="name">{$page.url.hostname}</h1>

        <nav>
            <ul>
                <li>
                    <a aria-current={$page.url.pathname === "/" ? "page" : undefined} href="/">home</a>
                </li>
                <li>
                    <a aria-current={$page.url.pathname === "/uploaders" ? "page" : undefined} href="/uploaders">uploaders</a>
                </li>
            </ul>
            <a class="link tm" href="https://supa.codes/" target="_blank">supa.codes&trade;</a>
        </nav>
        <hr />

        <noscript>JavaScript is required for this website.</noscript>

        <details class="settings">
            <summary>Settings</summary>
            <div>
                <div class="option">
                    <a href="/" on:click={changeTheme}>{$userSettings.theme === "light" ? "Dark" : "Light"} theme?</a>
                </div>
                <label class="option">
                    <input type="checkbox" id="file-ext" name="file-ext" bind:checked={$userSettings.appendFileExt} on:change={saveSettings} />
                    Append file extension at the end of URLs
                </label>
                <label class="option">
                    <input type="checkbox" id="file-history" name="file-history" bind:checked={$userSettings.rememberFileHistory} on:change={saveSettings} />
                    Remember upload history, stored locally
                </label>
                <label class="option">
                    <input type="checkbox" id="file-disposition" name="file-disposition" bind:checked={$userSettings.fileContentDisposition} on:change={saveSettings} />
                    Save remote file with its original name&nbsp;
                    <span class="tooltip" title="Enabling this will show your file's original (local) name to other users in supported browsers; e.g. when saving.">( ? )</span>
                </label>
            </div>
        </details>

        <slot />
    </div>
</main>

<style lang="scss">
    :root {
        --font-body: "Noto Sans", sans-serif, -apple-system, "Helvetica Neue";
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

    h1 {
        font-weight: 400;
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

    .wrapper {
        width: 800px;
        padding: 10px;
    }

    .settings {
        display: flex;
        background-color: rgb(var(--bg_h));
        width: fit-content;
        padding: 5px;
        border-radius: 5px;
        gap: 2px;
        flex-direction: column;

        &[open] {
            background-color: rgb(var(--bg2));
            summary {
                padding-bottom: 2px;
                // margin-bottom: 5px;
                border-bottom: 2px solid rgb(var(--primary));
            }
        }

        summary {
            cursor: pointer;
        }
    }

    .option {
        display: flex;
        align-items: center;
        max-width: max-content;
    }

    .tm {
        float: right;
    }

    .tooltip {
        cursor: help;
        text-decoration: underline dotted;
    }

    .name {
        margin: 0;
        margin-bottom: 10px;
        overflow: auto;
    }

    hr {
        margin: 0;
        margin-bottom: 5px;
        border: 2px solid rgb(var(--primary));
        border-radius: 5px;
    }

    ul {
        display: inline;
        padding: 0;
        margin: 0;
        list-style-type: none;

        li {
            display: inline;
            &:not(:last-child)::after {
                content: " // ";
                color: rgb(var(--fg));
            }
        }
    }
</style>