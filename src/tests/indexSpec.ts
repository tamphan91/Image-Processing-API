import supertest from 'supertest';
import path from 'path';
import app from '../index';
import { checkFileExists, transformImage } from '../utilities/index';

describe('Check file', () => {
  const fullFileDir = path.join(process.cwd(), '/public/assets/images/full');
  it('Expected file exists', async () => {
    expect(await checkFileExists(`${fullFileDir}/fjord.jpg`)).toBeTrue();
  });

  it('Expected file does not exist', async () => {
    expect(await checkFileExists(`${fullFileDir}/fjord1.jpg`)).toBeFalse();
  });
});

describe('Transform image', () => {
  const fullFileDir = path.join(process.cwd(), '/public/assets/images/full');
  it('Expected transform success', async () => {
    expect(await transformImage(`${fullFileDir}/fjord.jpg`, 300, 200)).toBeInstanceOf(Buffer);
  });

  it('Expected transform throw error', async () => {
    try {
      await transformImage(`${fullFileDir}/fjord1.jpg`, 300, 200);
    } catch (error: unknown) {
      expect((error as Error).message).toBe(`Input file is missing: ${fullFileDir}/fjord1.jpg`);
    }
  });
});

const request = supertest(app);
describe('Test endpoint responses', () => {
  it('gets the api endpoint without fileName query', async () => {
    const response = await request.get('/api/images');
    expect(response.status).toBe(400);
  });

  it('gets the api endpoint with fileName query does exist', async () => {
    const response = await request.get('/api/images?fileName=fjord');
    expect(response.status).toBe(200);
  });

  it('gets the api endpoint with fileName query does not exist', async () => {
    const response = await request.get('/api/images?fileName=fjord1');
    expect(response.status).toBe(404);
  });

  it('gets the api endpoint with height is not positive', async () => {
    const response = await request.get('/api/images?fileName=fjord&width=300&height=-100');
    expect(response.status).toBe(400);
  });

  it('gets the api endpoint with height is not number', async () => {
    const response = await request.get('/api/images?fileName=fjord&width=a&height=-100');
    expect(response.status).toBe(400);
  });

  it('gets the api endpoint with height and width are positive', async () => {
    const response = await request.get('/api/images?fileName=fjord&width=300&height=200');
    expect(response.status).toBe(200);
  });
});
