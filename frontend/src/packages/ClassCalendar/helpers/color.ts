export const stringToColor = (str: string, opacity: number = 1) => {
    // Simple hash function to convert string to a hash number
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convert the hash to a hex color code
    let r = (hash >> 0) & 0xFF;
    let g = (hash >> 8) & 0xFF;
    let b = (hash >> 16) & 0xFF;

    // Return the color as an RGBA string with opacity
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
