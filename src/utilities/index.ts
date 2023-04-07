import fs from 'fs/promises';
import sharp from 'sharp';

export const checkFileExists = async (filePath: string): Promise<boolean> => {
  try {
    const fileHandle = await fs.open(filePath);
    fileHandle.close();
    return true;
  } catch (error) {
    return false;
  }
};

export const transformImage = async (filePath: string, width: number, height: number): Promise<Buffer> => {
  return await sharp(filePath).resize(width, height).toBuffer();
};

export const createFile = async (file: Buffer, filePath: string) => {
  await fs.writeFile(filePath, file);
};
