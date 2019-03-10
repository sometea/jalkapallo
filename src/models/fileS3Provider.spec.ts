import { FileS3Provider } from "./fileS3Provider";
import { S3 } from "aws-sdk/clients/all";
import { jalkapalloConfig } from "../config";
import { S3File } from "./s3file";

describe('FileS3Provider', () => {
    let fileS3Provider: FileS3Provider;
    let S3Spy: S3;

    beforeEach(() => {
        S3Spy = jasmine.createSpyObj<S3>('S3', ['upload', 'deleteObject', 'listObjects', 'getObject']);
        fileS3Provider = new FileS3Provider(S3Spy);
        jalkapalloConfig.exportBucket = 'testBucket';
        jalkapalloConfig.exportDirectory = 'testDirectory';
    });

    it('lists files from the bucket', async () => {
        const mockReturnValue = {
            Contents: [{
                Key: 'testKey',
            }],
        };
        const mockTaggingResult = {
            TagSet: [
                { Key: 'title', Value: 'testTitle' },
                { Key: 'url', Value: 'testUrl' }
            ]
        }
        S3Spy.listObjects = jasmine.createSpy('listObjects').and.returnValue({ promise: () => mockReturnValue });
        S3Spy.getObjectTagging = jasmine.createSpy('getObjectTagging').and.returnValue({ promise: () => mockTaggingResult });

        const result = await fileS3Provider.list();
        
        expect(result[0].getId()).toEqual('testKey');
        expect(result[0].getTitle()).toEqual('testTitle');
        expect(result[0].getUrl()).toEqual('testUrl');
    });
});