import { writable } from "svelte/store";

let counter = 0;

/** @type {{msg: string, date: number, id: number}[]} */
const arr = [];
export const errors = writable(arr);

export const logError = (/** @type {String} */ msg) => {
    console.error(msg)
    errors.update(arr => {
        return [{
            id: counter++,
            msg,
            date: Date.now()
        },
        ...arr];
    });
};
