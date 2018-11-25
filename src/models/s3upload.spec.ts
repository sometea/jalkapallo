import { S3Upload } from "./s3upload";
import aws from 'aws-sdk';
import { Request, Response } from 'express';
import { ImageProvider } from "./imageProvider";

describe('S3Upload', () => {
    let s3upload: S3Upload;
    let s3Spy: aws.S3;
    let imageProviderSpy: ImageProvider;
    const request = jasmine.createSpyObj<Request>('Request', ['get']);
    const response = jasmine.createSpyObj<Response>('Response', ['get']);

    beforeEach(() => {
        imageProviderSpy = jasmine.createSpyObj<ImageProvider>('ImageProvider', ['get']);
        s3Spy = jasmine.createSpyObj<aws.S3>('S3', ['upload', 'deleteObject']);
        s3Spy.upload = jasmine.createSpy().and.returnValue({ promise: () => ({ Key: 'testKey', Location: 'testLocation' }) });
        s3upload = new S3Upload(imageProviderSpy, s3Spy);
    });

    it('should call next in uploadMiddleware', async () => {
        request.body = { filename: 'testFilename', body: 'testBody' };
        const next = jasmine.createSpy('next');
        await s3upload.uploadMiddleware(request, response, next);
        expect(next).toHaveBeenCalled();
    });
});