export const uploadImageFromDataUri = async (dataUri: string, filename: string): Promise<string> => {
  // Pour l'instant, retourne le dataUri tel quel (l'image sera stockée en base64)
  // Dans une vraie app locale, vous pourriez utiliser l'API File System
  console.log('Image uploaded locally:', filename)
  return dataUri
}

export const deleteImage = async (imageUrl: string): Promise<void> => {
  console.log('Image deleted:', imageUrl)
}