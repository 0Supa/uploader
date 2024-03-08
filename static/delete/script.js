document.title = window.location.hostname;

const key = window.location.search.substring(1);

const loadObject = async () => {
    try {
        const res = await fetch(`/api/object?key=${key}`);
        const file = await res.json();
        if (file.error) return msg.innerHTML = `Error ${file.error}: ${file.message}`;

        object.innerText = `${file.id}: ${file.type}`;

        if (file.type.startsWith('image/'))
            preview.src = `/${file.id}`;
        else {
            preview.style.display = "none";
            object.style['font-size'] = '1.5em';
        }

        msg.innerText = 'Are you sure you want to delete this file?';
        content.style.display = "block";
    } catch (e) {
        console.error(e);
        msg.innerText = 'Request failed';
    }
};

const deleteObject = async () => {
    try {
        content.style.display = "none";
        msg.innerText = 'Deleting...';

        const res = await fetch(`/api/delete?key=${key}`);
        const json = await res.json();
        if (json.error) return msg.innerHTML = `Delete Error ${json.error}: ${json.message}`;

        msg.innerHTML = 'Your file has been successfully deleted from our servers.';
    } catch (e) {
        console.error(e);
        msg.innerText = 'Delete request failed';
    }
};

if (!key) msg.innerText = 'No key specified.';
else {
    msg.innerText = "Loading...";
    loadObject();
}
