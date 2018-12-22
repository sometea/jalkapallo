import aws from 'aws-sdk';
import { ArticleExport } from "./articleExport";
import { jalkapalloConfig } from '../config';
import { Article } from './article';

describe('ArticleExport', () => {
    let articleExport: ArticleExport;
    let s3Spy: aws.S3;
    const testDate = new Date();

    beforeEach(() => {
        s3Spy = jasmine.createSpyObj<aws.S3>('S3', ['upload', 'deleteObject']);
        s3Spy.upload = jasmine.createSpy('upload').and.returnValue({ promise: () => ({ Key: 'testKey', Location: 'testLocation' }) });
        s3Spy.deleteObject = jasmine.createSpy('deleteObject').and.returnValue({ promise: () => {} });

        articleExport = new ArticleExport(s3Spy);
    });

    it('should delete an item on s3', async () => {
        await articleExport.delete('testId');
        expect(s3Spy.deleteObject).toHaveBeenCalledWith({
            Bucket: jalkapalloConfig.exportBucket,
            Key: jalkapalloConfig.exportDirectory + '/testId.md'
        });
    });

    it('should upload an exported version of an article to s3', async () => {
        await articleExport.createOrUpdate(
            new Article('testTitle', 'testBody', 'testId', testDate, '', { testMetaData: 'test' })
        );
        expect(s3Spy.upload).toHaveBeenCalledWith({
            Bucket: jalkapalloConfig.exportBucket,
            Key: jalkapalloConfig.exportDirectory + '/testId.md',
            Body: Buffer.from("---\ntestMetaData: test\ntitle: testTitle\ndate: " + testDate.toDateString() + "\n---\ntestBody"),
            ContentType: 'text/plain',
            ACL: 'public-read',
        });
    });
});