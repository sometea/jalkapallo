import { S3 } from "aws-sdk/clients/all";
import { ArticleS3Provider } from "./articleS3Provider";
import { Article } from "./article";
import { jalkapalloConfig } from "../config";
import { ArticleMarkdownMapper } from "./articleMarkdownMapper";

describe('ArticleS3Provider', () => {
    let articleProvider: ArticleS3Provider;
    let S3Spy: S3;
    let mapperSpy: ArticleMarkdownMapper;
    const testDate = new Date('12.12.1980');

    beforeEach(() => {
        S3Spy = jasmine.createSpyObj<S3>('S3', ['upload', 'deleteObject', 'listObjects', 'getObject']);
        mapperSpy = jasmine.createSpyObj<ArticleMarkdownMapper>('ArticleMarkdownMapper', ['toArticle', 'toMarkdown']);
        articleProvider = new ArticleS3Provider(S3Spy, mapperSpy);
        jalkapalloConfig.articlesBucket = 'testBucket';
        jalkapalloConfig.articlesDirectory = 'testDirectory';
    });

    it('lists articles', async () => {
        const mockReturnValue = {
            Contents: [{
                Key: 'testKey',
                LastModified: testDate,
            }],
        };
        S3Spy.listObjects = jasmine.createSpy('listObjects').and.returnValue({ promise: () => mockReturnValue });

        const result = await articleProvider.list();

        expect(result).toEqual([ new Article('testKey', '', 'testKey', testDate, 'article') ]);
    });

    it('retrieves single articles', async () => {
        const mockReturnValue = {
            Body: 'testBody',
        };
        S3Spy.getObject = jasmine.createSpy('getObject').and.returnValue({ promise: () => mockReturnValue });
        mapperSpy.toArticle = jasmine.createSpy('toArticle').and.returnValue(new Article('test', 'test', 'test', testDate));

        const result = await articleProvider.get('testId');

        expect(mapperSpy.toArticle).toHaveBeenCalledWith('testBody', 'testId');
        expect(result).toEqual(new Article('test', 'test', 'test', testDate));
    });

    it('deletes articles', async () => {
        S3Spy.deleteObject = jasmine.createSpy('deleteObject').and.returnValue({ promise: () => undefined });

        await articleProvider.delete('testObjectId');

        expect(S3Spy.deleteObject).toHaveBeenCalledWith({
            Bucket: 'testBucket',
            Key: 'testDirectory/testObjectId.md',
        });
    });

    it('creates articles', async () => {
        S3Spy.upload = jasmine.createSpy('upload').and.returnValue({ promise: () => undefined });
        mapperSpy.toMarkdown = jasmine.createSpy('toMarkdown').and.returnValue('testMarkdown');
        const testArticle = new Article('testTitle', 'testBody', 'testId', testDate);

        await articleProvider.create(testArticle);

        expect(mapperSpy.toMarkdown).toHaveBeenCalled();
        expect(S3Spy.upload).toHaveBeenCalled();
    });

    it('updates articles', async () => {
        S3Spy.upload = jasmine.createSpy('upload').and.returnValue({ promise: () => undefined });
        mapperSpy.toMarkdown = jasmine.createSpy('toMarkdown').and.returnValue('testMarkdown');
        const testArticle = new Article('testTitle', 'testBody', 'testId', testDate);

        await articleProvider.update('realTestId', testArticle);
        
        expect(mapperSpy.toMarkdown).toHaveBeenCalledWith(testArticle);
        expect(S3Spy.upload).toHaveBeenCalledWith({
            Bucket: 'testBucket',
            Key: 'testDirectory/realTestId.md',
            Body: 'testMarkdown',
            ContentType: 'text/plain',
            ACL: 'public-read',
        });
    });
});