<script>
    import { userSettings } from "$lib/userSettings";
    import { onDestroy, onMount, tick } from "svelte";
    import Dialog from "./Dialog.svelte";
    import { uploadedFiles, saveFiles, loadFiles } from "./files";
    import { dev } from "$app/environment";
    import Icon from "./Icon.svelte";

    /** @type {Boolean} */
    export let isNewUpload;

    /** @type {import('$lib/types.js').File} */
    export let file;

    /** @type {HTMLDialogElement} */
    let deleteDialog;

    /** @type {HTMLInputElement} */
    let urlInput;

    /** @type {(msg: string) => void} */
    export let notifyError;

    const copy = () => {
        const val = urlInput.value;
        urlInput.select();
        urlInput.setSelectionRange(0, val.length);
        navigator.clipboard.writeText(val);
    };

    const deleteFile = () => {
        deleteDialog.showModal();
    };

    const dialogOnClose = async () => {
        if (deleteDialog.returnValue === "confirm") {
            deleteDialog.returnValue = "";
            try {
                const res = await fetch(
                    `${dev ? "http://localhost:8787" : ""}/api/delete?key=${encodeURIComponent(file.key)}`,

                    { method: "POST" },
                );

                const data = await res.json();

                loadFiles();
                uploadedFiles.update((arr) => {
                    return arr.filter((x) => x.id !== file.id);
                });
                saveFiles();

                if (!data.success) throw data.message ?? JSON.stringify(data, null, 4);
            } catch (err) {
                notifyError(`Failed deleting "${file.name}":\n${err}`);
            }
        }
    };

    $: fileUrl = `${file.origin || window.location.origin}/${file.id}${$userSettings.appendFileExt ? file.ext : ""}`;

    onMount(async () => {
        if (isNewUpload) {
            urlInput.focus();
        }
        deleteDialog.addEventListener("close", dialogOnClose);
    });

    onDestroy(() => {
        deleteDialog.removeEventListener("close", dialogOnClose);
    });
</script>

<Dialog bind:node={deleteDialog}>
    <div class="delete-dialog">
        <p>Are you sure you want to delete <span class="highlight">{file.name}</span>?</p>
        <div class="option">
            <button on:click={() => deleteDialog.close("confirm")} class="alert">Yes</button>
            <button on:click={() => deleteDialog.close("cancel")} class="ok">No</button>
        </div>
    </div>
</Dialog>

<div class="file">
    <div class="name" title={file.name}>{file.name}</div>
    <div class="details">
        <input tabindex="0" aria-label="Open link" bind:this={urlInput} on:focus={copy} on:select={copy} on:click={copy} class="link" type="text" readonly value={fileUrl} />
        <button class="alert" on:click={deleteFile}>
            <Icon class="icon" src="/static/delete.svg"></Icon>
        </button>
        <button class="default" aria-label="Delete" on:click={() => window.open(fileUrl, "file-link")}>
            <Icon class="icon" src="/static/open_in_new.svg"></Icon>
        </button>
    </div>
    <div class="footer">
        <div class="mimetype">{file.type}</div>
        <div class="date">{new Date(file.date).toLocaleString("sv", { timeZoneName: "shortOffset" })}</div>
        <div>{file.checksum}</div>
    </div>
</div>

<style lang="scss">
    .file {
        display: flex;
        flex-direction: column;
        padding: 10px 8px;
        background-color: rgb(var(--bg_h));
        border-radius: 10px;
        border: 1px solid rgb(var(--outl2));
        border-left: 2px solid rgb(var(--primary));

        &:not(:last-child) {
            margin-bottom: 10px;
            // border-bottom: 2px dashed rgb(var(--primary));
        }

        .details {
            display: flex;
            font-size: 1.2rem;
            border-radius: 5px;
            outline: 1px solid rgb(var(--outl1));
            margin: 2px 0;

            button {
                border-radius: 0;
                &:last-child {
                    border-radius: 0 5px 5px 0;
                }
                :global(.icon) {
                    vertical-align: middle;
                    width: 18pt;
                    height: 18pt;
                }
            }
        }

        .name {
            font-size: 1.2rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .link {
            border-radius: 5px 0 0 5px;
            background-color: rgb(var(--bg));
            font-size: 0.9rem;
            color: rgb(var(--fg2));
            flex: 1;

            &:focus {
                background-color: rgb(var(--bg_h));
            }
        }
    }

    button {
        cursor: pointer;
        background-color: rgba(var(--bg2), 0.1);
        border: none;
        color: rgb(var(--fg2));
        border-radius: 5px;

        &:hover {
            background-color: rgba(var(--bg2), 0.2);
        }
    }

    input[type="text"] {
        border: none;
        outline: none;
    }

    input[type="text"] {
        padding: 5px;
    }

    .alert {
        background-color: rgba(255, 0, 0, 0.2);
        &:hover {
            background-color: rgba(255, 0, 0, 0.4);
        }
    }

    .ok {
        background-color: rgba(0, 255, 0, 0.2);
        &:hover {
            background-color: rgba(0, 255, 0, 0.4);
        }
    }

    .default {
        background-color: rgb(var(--bg_h));
        &:hover {
            background: rgb(var(--bg2));
        }
    }

    .footer {
        font-size: 0.8rem;
        text-overflow: clip;
        overflow: hidden;
    }

    .date {
        margin-right: 5px;
    }

    .mimetype {
        float: right;
    }

    .delete-dialog {
        font-size: 1.1rem;
        max-width: 500px;
        padding: 10px 0;
        text-align: center;
        overflow: hidden;

        p {
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .option {
            display: flex;
            justify-content: center;
            gap: 10px;

            button {
                outline: 1px solid rgb(var(--outl1));
                font-size: 0.9em;
                padding: 0.25em 1.5em;
            }
        }
    }

    .highlight {
        color: rgb(var(--fg2));
        background-color: rgb(var(--bg2));
        border-radius: 5px;
        padding: 0 2px;
        white-space: nowrap;
    }
</style>
