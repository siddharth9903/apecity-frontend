export function shortenText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) {
        return text;
    } else {
        return (
            text.substr(0, maxLength / 2) +
            "..." +
            text.substr(text.length - maxLength / 2)
        );
    }
}

export function timestampToDate(timestamp) {
    // Create a new Date object from the timestamp (converted to milliseconds)
    const date = new Date(timestamp * 1000);

    // Extract year, month, and day components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    // Construct the date string in yyyy-mm-dd format
    const dateString = `${year}-${month}-${day}`;

    return dateString;
}