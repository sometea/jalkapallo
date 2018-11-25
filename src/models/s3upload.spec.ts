import { S3Upload } from "./s3upload";
import aws from 'aws-sdk';
import { Request, Response } from 'express';
import { ImageProvider } from "./imageProvider";
import { Image } from "./image";
import { jalkapalloConfig } from '../config';

describe('S3Upload', () => {
    let s3upload: S3Upload;
    let s3Spy: aws.S3;
    let imageProviderSpy: ImageProvider;
    const request = jasmine.createSpyObj<Request>('Request', ['get']);
    request.body = { filename: 'testFilename', body: 'testBody' };
    request.params = { id: 'testId' };
    const response = jasmine.createSpyObj<Response>('Response', ['get']);

    beforeEach(() => {
        imageProviderSpy = jasmine.createSpyObj<ImageProvider>('ImageProvider', ['get']);
        imageProviderSpy.get = jasmine.createSpy('get').and.returnValue(new Image('testTitle', 'testFilename', 'testUrl', 'testId'))
        s3Spy = jasmine.createSpyObj<aws.S3>('S3', ['upload', 'deleteObject']);
        s3Spy.upload = jasmine.createSpy('upload').and.returnValue({ promise: () => ({ Key: 'testKey', Location: 'testLocation' }) });
        s3Spy.deleteObject = jasmine.createSpy('deleteObject').and.returnValue({ promise: () => {} });
        s3upload = new S3Upload(imageProviderSpy, s3Spy);
    });

    it('should call next in uploadMiddleware', async () => {
        const next = jasmine.createSpy('next');
        await s3upload.uploadMiddleware(request, response, next);
        expect(next).toHaveBeenCalled();
    });

    it('should call s3 upload with correct parameters', async () => {
        spyOn(s3upload, 'getKey').and.returnValue('testKey');
        await s3upload.uploadMiddleware(request, response, () => {});
        expect(s3Spy.upload).toHaveBeenCalledWith({
            Bucket: jalkapalloConfig.s3Bucket,
            Key: 'testKey',
            Body: Buffer.from('testBody', 'base64'),
            ContentType: 'application/octet-stream', 
            ACL: 'public-read',
        });
    });

    it('should call next in updateMiddleware', async () => {
        const next = jasmine.createSpy('next');
        await s3upload.updateMiddleware(request, response, next);
        expect(next).toHaveBeenCalled();
    });

    it('should call next in deleteMiddleware', async () => {
        const next = jasmine.createSpy('next');
        await s3upload.deleteMiddleware(request, response, next);
        expect(next).toHaveBeenCalled();
    });

    it('should call s3 deleteObject with correct parameters', async () => {
        await s3upload.deleteMiddleware(request, response, () => {});
        expect(s3Spy.deleteObject).toHaveBeenCalledWith({
            Bucket: jalkapalloConfig.s3Bucket,
            Key: 'testFilename',
        });
    });
});