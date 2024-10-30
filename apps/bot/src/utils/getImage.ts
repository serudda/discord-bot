import { MIME_TYPE } from '../common/constants';
import { Jimp } from 'jimp';

export const getImage = async (url: string): Promise<Buffer> => {
  console.log('** url **', url);
  const image = await Jimp.read(url);
  console.log('** image **', image);

  return await image.getBuffer(MIME_TYPE);
};
