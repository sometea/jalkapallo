import { S3 } from "aws-sdk/clients/all";

export class TaggingHandler {
    public findValueForTag(tagKey: string, tagSet: S3.Tag[]): string {
        const foundTag = tagSet.find(tag => (tag.Key === tagKey));
        return foundTag !== undefined ? foundTag.Value : '';
    }
}