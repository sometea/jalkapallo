import { S3 } from "aws-sdk/clients/all";
import { ArticleS3Provider } from "./articleS3Provider";

describe('ArticleS3Provider', () => {
    let articleProvider: ArticleS3Provider;
    let S3Spy: S3;

    beforeEach(() => {
        S3Spy = jasmine.createSpyObj<S3>('DocumentClient', ['get', 'scan', 'delete', 'put']);
        articleProvider = new ArticleS3Provider(S3Spy);
    });
});