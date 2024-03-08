import { writable, get } from "svelte/store";
import { loadSettings, userSettings } from "$lib/userSettings";

/**
 *  @type {import('svelte/store').Writable<Array<import('$lib/types.js').File>>}
 */
export const uploadedFiles = writable([])

export const loadFiles = () => {
    loadSettings();
    if (get(userSettings).rememberFileHistory !== true) return

    const filesVal = localStorage.getItem("uploaded-files");
    if (!filesVal) return;
    /** @type {Array<import('$lib/types.js').File>} */
    const files = JSON.parse(filesVal);

    uploadedFiles.update(() => {
        return files
    })
};

export const saveFiles = () => {
    loadSettings();
    if (get(userSettings).rememberFileHistory !== true) return

    localStorage.setItem("uploaded-files", JSON.stringify(get(uploadedFiles)));
}
