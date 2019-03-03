import { S3 } from "aws-sdk/clients/all";
import { ArticleS3Provider } from "./articleS3Provider";
import { Article } from "./article";
import { jalkapalloConfig } from "../config";

describe('ArticleS3Provider', () => {
    let articleProvider: ArticleS3Provider;
    let S3Spy: S3;

    beforeEach(() => {
        S3Spy = jasmine.createSpyObj<S3>('S3', ['upload', 'deleteObject', 'listObjects', 'getObject']);
        articleProvider = new ArticleS3Provider(S3Spy);
        jalkapalloConfig.exportBucket = 'testBucket';
        jalkapalloConfig.exportDirectory = 'testDirectory';
    });

    it('lists articles', async () => {
        const mockReturnValue = {
            Contents: [{
                Key: 'testKey',
                LastModified: new Date('12.12.1980'),
            }],
        };
        S3Spy.listObjects = jasmine.createSpy('listObjects').and.returnValue({ promise: () => mockReturnValue });

        const result = await articleProvider.list();

        expect(result).toEqual([ new Article('testKey', '', 'testKey', new Date('12.12.1980'), 'article') ]);
    });

    it('retrieves single articles', async () => {
        const mockReturnValue = {
            Body: 'testBody',
        };
        S3Spy.getObject = jasmine.createSpy('getObject').and.returnValue({ promise: () => mockReturnValue });

        const result = await articleProvider.get('testId');

        expect(result).toEqual(new Article('', '', ''));
    });

    it('deletes articles', async () => {
        S3Spy.deleteObject = jasmine.createSpy('deleteObject').and.returnValue({ promise: () => undefined });

        await articleProvider.delete('testObjectId');

        expect(S3Spy.deleteObject).toHaveBeenCalled();
    });

    it('creates articles', async () => {
        S3Spy.upload = jasmine.createSpy('upload').and.returnValue({ promise: () => undefined });

        await articleProvider.create(new Article('testTitle', 'testBody', 'testId', new Date('12.12.1980')));

        expect(S3Spy.upload).toHaveBeenCalledWith({
            Bucket: 'testBucket',
            Key: 'testDirectory/testId.md',
            Body: '{"title":"testTitle","date":"1980-12-11T23:00:00.000Z"}\n\ntestBody',
            ContentType: 'text/plain',
            ACL: 'public-read',
        });
    });

    it('updates articles', async () => {
        S3Spy.upload = jasmine.createSpy('upload').and.returnValue({ promise: () => undefined });

        await articleProvider.update('realTestId', new Article('testTitle', 'testBody', 'testId', new Date('12.12.1980')));

        expect(S3Spy.upload).toHaveBeenCalledWith({
            Bucket: 'testBucket',
            Key: 'testDirectory/realTestId.md',
            Body: '{"title":"testTitle","date":"1980-12-11T23:00:00.000Z"}\n\ntestBody',
            ContentType: 'text/plain',
            ACL: 'public-read',
        });
    });
});