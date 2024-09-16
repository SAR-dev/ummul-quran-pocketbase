export const getImageUrl = ({
    collectionId,
    dataId,
    image
}: {
    collectionId?: string,
    dataId?: string,
    image?: string
}) => `${import.meta.env.VITE_API_URL}/api/files/${collectionId}/${dataId}/${image}`