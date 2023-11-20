import sharp from "sharp";

export const resizeAndConvertToJPEG = async (imageBuffer, width, height) => {
  const resizedImageBuffer = await sharp(imageBuffer)
    .resize({ width, height })
    .jpeg()
    .toBuffer();
  
  return resizedImageBuffer;
}