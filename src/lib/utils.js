// https://stackoverflow.com/a/77472484

export const cleanBuffer = (/** @type {ArrayBuffer} */ arrayBuffer) => {
    let dataView = new DataView(arrayBuffer);
    const exifMarker = 0xffe1;
    let offset = 2; // Skip the first two bytes (0xFFD8)

    while (offset < dataView.byteLength) {
        if (dataView.getUint16(offset) === exifMarker) {
            // Found an EXIF marker
            const segmentLength = dataView.getUint16(offset + 2, false) + 2;

            // Update the arrayBuffer and dataView
            arrayBuffer = removeSegment(arrayBuffer, offset, segmentLength);
            dataView = new DataView(arrayBuffer)
        } else {
            // Move to the next marker
            offset += 2 + dataView.getUint16(offset + 2, false);
        }
    }

    return arrayBuffer;
};

export const removeSegment = (/** @type {ArrayBuffer} */ buffer, /** @type {number} */ offset, /** @type {number} */ length) => {
    // Create a new buffer without the specified segment
    const modifiedBuffer = new Uint8Array(buffer.byteLength - length);
    modifiedBuffer.set(new Uint8Array(buffer.slice(0, offset)), 0);
    modifiedBuffer.set(new Uint8Array(buffer.slice(offset + length)), offset);

    return modifiedBuffer.buffer;
};

