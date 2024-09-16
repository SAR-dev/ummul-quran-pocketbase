export const getImageUrl = ({
    collectionId,
    dataId,
    image
}: {
    collectionId?: string,
    dataId?: string,
    image?: string
}) => `${import.meta.env.VITE_API_URL}/api/files/${collectionId}/${dataId}/${image}`

export const getTimeOffset = () => {
    const offset = new Date().getTimezoneOffset(); // Get the offset in minutes
    const sign = offset <= 0 ? '+' : '-'; // Determine the sign
    const absOffsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0'); // Absolute hours with leading zero
    const absOffsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0'); // Absolute minutes with leading zero
  
    return `${sign}${absOffsetHours}:${absOffsetMinutes}`;
  }