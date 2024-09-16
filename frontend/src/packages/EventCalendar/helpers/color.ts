export const stringToColor = (str: string) => {
    // Simple hash function to convert string to a hash number
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convert the hash to a hex color code
    let color = '#';
    for (let i = 0; i < 3; i++) {
        color += ('00' + ((hash >> (i * 8)) & 0xFF).toString(16)).slice(-2);
    }
    return color;
};
