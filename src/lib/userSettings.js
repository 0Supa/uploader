import { writable, get } from "svelte/store";

/** @type {import('$lib/types.js').UserSettings} */
const defaultSettings = {
    "appendFileExt": false,
    "rememberFileHistory": true,
    "fileContentDisposition": true,
    "stripExif": true,
    "theme": "dark"
}

/**
 *  @type {import('svelte/store').Writable<import('$lib/types.js').UserSettings>}
 */
export const userSettings = writable(defaultSettings)

export const loadSettings = () => {
    const userSettingsVal = localStorage.getItem("user-settings");
    if (!userSettingsVal) return;
    /** @type {import('$lib/types.js').UserSettings} */
    const savedSettings = JSON.parse(userSettingsVal);

    userSettings.update(() => {
        return savedSettings;
    })
};

export const saveSettings = () => {
    localStorage.setItem("user-settings", JSON.stringify(get(userSettings)));
}
