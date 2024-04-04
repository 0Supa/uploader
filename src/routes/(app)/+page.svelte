<script>
    import Dialog from "$lib/components/Dialog.svelte";
    import Terms from "$lib/components/Terms.svelte";
    import { logError } from "$lib/components/errorLog";
    import Errors from "$lib/components/Errors.svelte";
    import { userSettings } from "$lib/userSettings";
    import { uploadedFiles, saveFiles, loadFiles } from "$lib/components/files";
    import { onMount } from "svelte";
    import FileDisplay from "$lib/components/File.svelte";
    import { dev } from "$app/environment";
    import { cleanBuffer } from "$lib/utils.js";

    let mountDate = Date.now();

    let disabled = false;

    /** @type {HTMLInputElement} */
    let fileInput;

    /** @type {Number?} */
    let uploadProgress = null;

    /** @type {HTMLDivElement} */
    let dropZone;

    /** @type {HTMLDialogElement} */
    let tosDialog;

    /** @type {HTMLDialogElement} */
    let errorDialog;

    /** @type {EventTarget} */
    let lastTarget;

    const notifyError = (/** @type {string} */ msg) => {
        logError(msg);
        errorDialog.showModal();
    };

    const removeExif = (/** @type {File} */ file) => {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => {
                if (!(fr.result instanceof ArrayBuffer))
                    return reject("Failed reading image buffer");

                const cleanedBuffer = cleanBuffer(fr.result);
                const blob = new Blob([cleanedBuffer], { type: file.type });
                const newFile = new File([blob], file.name, {
                    type: file.type,
                });
                resolve(newFile);
            };
            fr.readAsArrayBuffer(file);
        });
    };

    /** @type {Array<Number>} */
    let totalProgress = [];
    let filesCount = 0;
    let completed = 0;

    async function upload(/** @type {FileList} */ files) {
        disabled = true;

        const percentComplete = () => {
            return totalProgress.length
                ? totalProgress.reduce((a, b) => a + b, 0) /
                      totalProgress.length
                : 0;
        };

        for (const file of files) {
            const progressId = filesCount++;
            const formData = new FormData();

            if ($userSettings.stripExif && file.type.startsWith("image/")) {
                try {
                    formData.append("file", await removeExif(file));
                } catch (err) {
                    return notifyError(`Error reading "${file.name}":\n${err}`);
                }
            } else {
                formData.append("file", file);
            }

            const xhr = new XMLHttpRequest();

            xhr.addEventListener("load", () => {
                try {
                    if (++completed >= filesCount) uploadProgress = null;

                    if (xhr.status === 413) {
                        return notifyError(
                            `Failed uploading "${file.name}": File too large`,
                        );
                    } else if (xhr.status !== 200) {
                        try {
                            const res = JSON.parse(xhr.response);
                            return notifyError(
                                `Error uploading "${file.name}": (${xhr.status})\n${JSON.stringify(res, null, 4)}`,
                            );
                        } catch (_) {
                            return notifyError(
                                `Error uploading "${file.name}": (${xhr.status})`,
                            );
                        }
                    }

                    const res = JSON.parse(xhr.response);

                    loadFiles();
                    uploadedFiles.update((arr) => {
                        return [
                            {
                                id: res.id,
                                name: file.name,
                                ext: res.ext,
                                type: file.type || res.type,
                                key: res.key,
                                date: Date.now(),
                                checksum: res.checksum,
                            },
                            ...arr,
                        ];
                    });
                    saveFiles();
                } catch (err) {
                    notifyError(
                        `Unexpected error uploading "${file.name}": (${xhr.status})\n${err}`,
                    );
                }
            });

            xhr.addEventListener("error", (e) => {
                notifyError(
                    `Failed uploading "${file.name}": ${e.loaded} bytes transferred`,
                );
                totalProgress[progressId] = 100;
                if (++completed >= files.length) uploadProgress = null;
            });

            xhr.open(
                "POST",
                `${dev ? "http://localhost:8787" : ""}/api/upload${!$userSettings.fileContentDisposition ? "?skip-cd=true" : ""}`,
                true,
            );

            xhr.upload?.addEventListener("progress", (e) => {
                if (!e.lengthComputable) return;

                totalProgress[progressId] = ~~(e.loaded / e.total) * 100;
                uploadProgress = ~~percentComplete();
            });

            xhr.send(formData);
        }
        disabled = false;
    }

    const fileInputChange = () => {
        if (!fileInput.files) return;
        upload(fileInput.files);
    };

    const dragFiles = (/** @type {DragEvent} */ e) => {
        if (!e.dataTransfer?.types.includes("Files") || !e.target) return;

        e.preventDefault();
        lastTarget = e.target;
        dropZone.style.visibility = "visible";
        e.dataTransfer.dropEffect = "copy";
    };

    const dragLeave = (/** @type {DragEvent} */ e) => {
        if (e.target !== lastTarget && e.target !== document) return;
        dropZone.style.visibility = "hidden";
    };

    const dropFiles = (/** @type {DragEvent} */ e) => {
        if (!e.dataTransfer?.files) return;

        e.preventDefault();
        dropZone.style.visibility = "hidden";
        upload(e.dataTransfer.files);
    };

    const pasteFiles = (/** @type {ClipboardEvent} */ e) => {
        if (disabled || !e.clipboardData?.files) return;

        e.preventDefault();
        upload(e.clipboardData.files);
    };

    onMount(() => {
        mountDate = Date.now();
        loadFiles();
    });
</script>

<svelte:window
    on:dragleave={dragLeave}
    on:dragover={dragFiles}
    on:dragenter={dragFiles}
    on:drop={dropFiles}
/>

<svelte:body on:paste={pasteFiles} />

<div class="drop-zone" bind:this={dropZone}></div>

<Dialog bind:node={errorDialog}>
    <section>
        <Errors></Errors>
    </section>
</Dialog>

<Dialog bind:node={tosDialog}>
    <section class="terms">
        <Terms></Terms>
    </section>
</Dialog>

<section>
    <p>
        <a
            href="/terms"
            on:click={(e) => {
                e.preventDefault();
                tosDialog.showModal();
            }}>Terms and Privacy Policy</a
        >
    </p>
    <p>
        Max file size: 100 MB<br />Drag or paste files anywhere on this page to
        start uploading
    </p>

    <div class="upload-area">
        <label class="upload-label">
            <input
                bind:this={fileInput}
                on:change={fileInputChange}
                type="file"
                id="file-input"
                {disabled}
                multiple
            />
            Choose Files
        </label>
    </div>

    {#if uploadProgress !== null}
        <p>Uploading... ({uploadProgress}%)</p>
    {/if}
</section>

<div class="uploaded-files">
    {#each $uploadedFiles as file (file.id)}
        <FileDisplay
            isNewUpload={(() => {
                return file.date > mountDate;
            })()}
            {notifyError}
            {file}
        ></FileDisplay>
    {/each}
</div>

<style lang="scss">
    .drop-zone {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        opacity: 0.5;
        visibility: hidden;
        display: block;
        background: gray url("/static/upload.svg") no-repeat center;
        background-size: 30%;
    }

    #file-input {
        display: none;
    }

    .upload-area {
        display: flex;
    }

    .upload-label {
        font-size: 1.2rem;
        font-weight: bold;
        width: 130px;
        text-align: center;
        color: rgb(var(--fg2));
        text-shadow: 0 0 2px rgb(var(--bg0));
        border: 2px solid rgb(var(--primary));
        padding: 6px 12px;
        cursor: pointer;
        display: inline-block;
        background: rgb(var(--bg_h));
        transition: transform ease-out 150ms;
        border-radius: 5px;

        &:hover {
            background: rgb(var(--bg2));
            transform: scale(105%);
        }
    }

    .uploaded-files {
        margin: 20px 0;
        display: flex;
        flex-direction: column;
        width: 320px;
    }

    .terms {
        font-size: 0.9rem;
    }
</style>
