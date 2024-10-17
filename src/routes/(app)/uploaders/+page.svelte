<script>
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { userSettings } from "$lib/userSettings";

    const url = $page.url.origin;

    let sharexConfigURL = new URL(`${url}/config.sxcu`);

    const endpoints = {
        upload: `${url}/api/upload`,
        delete: `${url}/api/delete`,
        object: `${url}/api/object`,
    };

    $: {
        if ($userSettings.fileContentDisposition) {
            sharexConfigURL.searchParams.delete("skip-cd");
        } else {
            sharexConfigURL.searchParams.set("skip-cd", "true");
        }

        if ($userSettings.appendFileExt) {
            sharexConfigURL.searchParams.set("ext", "true");
        } else {
            sharexConfigURL.searchParams.delete("ext");
        }
        sharexConfigURL = sharexConfigURL;
    }
</script>

<div>
    <details open>
        <summary>ShareX</summary>
        {#if browser}
            <p>
                <a
                    href={sharexConfigURL.toString()}
                    data-umami-event="sharex-download">Click here</a
                > to download the ShareX 11.5+ config
            </p>
        {/if}
    </details>
</div>

<div>
    <details open>
        <summary>Chatterino</summary>
        <div>
            <p>Settings; External Tools; Image Uploader</p>

            <table>
                <tr>
                    <th>Request URL:</th>
                    <td
                        >{endpoints.upload}{!$userSettings.fileContentDisposition
                            ? "?skip-cd=true"
                            : ""}</td
                    >
                </tr>
                <tr>
                    <th>Form field:</th>
                    <td>file</td>
                </tr>
                <tr>
                    <th>Image link:</th>
                    <td
                        >{`{link}${$userSettings.appendFileExt ? "{ext}" : ""}`}</td
                    >
                </tr>
                <tr>
                    <th>Deletion link:</th>
                    <td>{"{delete}"}</td>
                </tr>
            </table>
        </div>
    </details>
</div>

<div>
    <details>
        <summary>
            <a
                target="_blank"
                href="https://play.google.com/store/apps/details?id=com.flxrs.dankchat&ref=i.supa.codes"
                data-umami-event="dankchat-link">DankChat</a
            >
        </summary>
        <p>
            Native Twitch chat client for mobile -- <br />Same configuration
            format as Chatterino, uploader defaults to
            <a target="_blank" href="https://kappa.lol/">kappa.lol</a>.
        </p>
    </details>
</div>

<div>
    <details>
        <summary>API</summary>
        <div>
            <table>
                <tr>
                    <th>Upload:</th>
                    <td class="code">
                        curl "{endpoints.upload}" -F
                        "file=@/home/supa/kappa.png"
                    </td>
                </tr>
            </table>
            <div class="r">
                <pre>content-type: application/json</pre>
                <pre>{JSON.stringify(
                        {
                            id: "${id}",
                            ext: ".png",
                            type: "image/png",
                            checksum: "${md5}",
                            key: "${key}",
                            link: `${$page.url.origin}/\${id}`,
                            delete: `${$page.url.origin}/delete?\${key}`,
                        },
                        null,
                        4,
                    )}</pre>
            </div>
        </div>
        <div>
            <table>
                <tr>
                    <th>Delete:</th>
                    <td class="code">
                        curl "{endpoints.delete}?key=$fileKey"
                    </td>
                </tr>
            </table>
            <div class="r">
                <pre>content-type: application/json</pre>
                <pre>{JSON.stringify({ success: true }, null, 4)}</pre>
            </div>
        </div>
        <div>
            <table>
                <tr>
                    <th>Object:</th>
                    <td class="code">
                        curl "{endpoints.object}?id=$fileId"
                    </td>
                </tr>
            </table>
            <div class="r">
                <pre>content-type: application/json</pre>
                <pre>{JSON.stringify(
                        {
                            id: "${id}",
                            type: "${mimetype}",
                            date: "${Number(unixUploadTimeMS)}",
                            size: "${Number(bytes)}",
                            checksums: { md5: "${md5}" },
                            name: "${filename} (nullable)",
                        },
                        null,
                        4,
                    )}</pre>
            </div>
        </div>
    </details>
</div>

<div>
    <p>
        Looking for a cool song/video queue manager for your Twitch chat?<br
        />Either way, check out
        <a
            href="https://chat.vote/playlist/?ref=i.supa.codes"
            target="_blank"
            data-umami-event="badoge-playlist-link">chat.vote/playlist</a
        >!
    </p>
</div>

<style>
    summary {
        margin-top: 10px;
        margin-bottom: 0;
        font-weight: 500;
        font-size: 2em;
        cursor: pointer;
    }

    details p {
        margin-top: 0;
    }

    .r {
        border-left: 1px solid rgb(var(--fg));
        padding: 0 10px;
        margin: 5px;
    }

    table {
        border-spacing: 2px;
        border-collapse: separate;
    }

    td {
        padding: 3px;
        background-color: rgb(var(--bg2));
        border-radius: 5px;
    }

    th {
        text-align: inherit;
    }

    .code {
        font-family: monospace;
        background-color: rgb(var(--bg0));
    }
</style>
