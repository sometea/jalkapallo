import { S3 } from "aws-sdk/clients/all";
import { S3File } from "./s3file";
import { CrudInterface } from "./crudInterface";
import { jalkapalloConfig } from "../config";

export class FileS3Provider implements CrudInterface<S3File> {
    constructor(private s3: S3) { }

    async list(): Promise<S3File[]> {
        const result = await this.s3.listObjects({
            Bucket: jalkapalloConfig.s3Bucket,
        }).promise();
        if (!result.Contents) {
            return [];
        }
        return Promise.all(result.Contents.map(async obj => await this.mapS3ObjectToFile(obj)));
    }

    private async mapS3ObjectToFile(object: S3.Object): Promise<S3File> {
        if (!object.Key) {
            throw new Error("Key missing in S3 response.");
        }
        const taggingResult = await this.s3.getObjectTagging({
            Bucket: jalkapalloConfig.s3Bucket,
            Key: object.Key,
        }).promise();
        const title = this.findValueForTag('title', taggingResult.TagSet);
        return new S3File(
            this.findValueForTag('title', taggingResult.TagSet),
            this.findValueForTag('url', taggingResult.TagSet),
            object.Key
            );
    }

    private findValueForTag(tagKey: string, tagSet: S3.Tag[]): string {
        const foundTag = tagSet.find(tag => (tag.Key === tagKey));
        return foundTag !== undefined ? foundTag.Value : '';
    }

    get(id: string): Promise<S3File> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    create(dataObject: S3File): Promise<S3File> {
        throw new Error("Method not implemented.");
    }
    update(id: string, dataObject: S3File): Promise<S3File> {
        throw new Error("Method not implemented.");
    }
}