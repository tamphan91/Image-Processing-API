import express, { Request, Response } from 'express';
import path from 'path';
import { checkFileExists, transformImage, createFile, isPositiveNumber } from '../../utilities/index';
const images = express.Router();

images.get('/', async (req: Request, res: Response) => {
  const fileName = req.query.fileName;
  const width = req.query.width as unknown;
  const height = req.query.height as unknown;

  if (fileName == null) {
    res.status(400).send('fileName is required');
    return;
  }

  if ((width == null && height != null) || (width != null && height == null)) {
    res.status(400).send('width and height are required');
    return;
  }
  const fullFileDir = path.join(process.cwd(), '/public/assets/images/full');
  const thumbFileDir = path.join(process.cwd(), '/public/assets/images/thumb');
  const fullFilePath = `${fullFileDir}/${fileName}.jpg`;
  const isExist = await checkFileExists(fullFilePath);
  if (!isExist) {
    res.status(404).send('File not found');
    return;
  }

  if (width != null && height != null) {
    try {
      if (!isPositiveNumber(width) || !isPositiveNumber(height)) {
        res.status(400).send('width and height must be positive');
        return;
      }
    } catch (error) {
      res.status(400).send('width and height must be number');
      return;
    }

    const thumbFilePath = `${thumbFileDir}/${fileName}_${width}_${height}.jpg`;
    const isExist = await checkFileExists(thumbFilePath);
    if (isExist) {
      // console.log('get image from thumb dir');
      res.sendFile(thumbFilePath);
      return;
    }

    try {
      console.log('transform image');
      const transformedImage = await transformImage(
        `${fullFileDir}/${fileName}.jpg`,
        parseInt(width as string),
        parseInt(height as string)
      );
      // console.log('save image to thumb dir');
      await createFile(transformedImage, thumbFilePath);
      res.sendFile(thumbFilePath);
    } catch (err) {
      console.log(err);
    }
    return;
  }

  // console.log('get image from full dir');
  res.sendFile(fullFilePath);
  return;
});

export default images;
