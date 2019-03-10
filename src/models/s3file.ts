export class S3File {
    constructor(private title: string, private url: string, private id: string) {}

    static copyWithUrl(s3File: S3File, url: string|null = null) {
        return new S3File(
            s3File.getTitle(),
            url ? url : s3File.getUrl(),
            s3File.getId()
        );
    }

    getTitle(): string {
        return this.title;
    }

    getUrl(): string {
        return this.url;
    }

    getId(): string {
        return this.id;
    }
}