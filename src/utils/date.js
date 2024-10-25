export function formatDateObjectToInput(date) {
    if (!date || date.toString() === "Invalid Date") {
        return null;
    }

    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero based
    let year = date.getFullYear();

    // Add leading zeros to day and month if needed
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;

    return `${year}-${month}-${day}`;
}

export const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-IL", {
        month: "short",
        year: "2-digit",
        day: "2-digit",
    });
};

