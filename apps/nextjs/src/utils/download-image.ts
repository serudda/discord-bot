/**
 * The `downloadImage` function in TypeScript downloads an
 * image from a given URL and saves it with a specified file
 * name.
 *
 * @param {string} imageUrl - The `imageUrl` parameter is a
 *   string that represents the URL of the image that you
 *   want to download. This URL should point to the location
 *   of the image file on the internet.
 * @param {string} fileName - The `fileName` parameter in
 *   the `downloadImage` function is a string that
 *   represents the name under which the downloaded image
 *   file will be saved on the user's device. It is the name
 *   that will be displayed to the user when they are
 *   prompted to save the file.
 */

export async function downloadImage(imageUrl: string, fileName: string): Promise<void> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const link = document.createElement('a');

    if (!response.ok) throw new Error('Network response was not ok');

    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error downloading the image:', error);
  }
}
