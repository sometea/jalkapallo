export class S3File {
    constructor(private title: string, private url: string, private id: string, private content: Buffer = Buffer.from('')) {}

    static copyWithUrl(s3File: S3File, url: string|null = null) {
        return new S3File(
            s3File.getTitle(),
            url ? url : s3File.getUrl(),
            s3File.getId(),
            s3File.getContent()
        );
    }

    setBase64Content(content: string): S3File {
        this.content = Buffer.from(content.replace(/^data:.+\/(.+);base64,/, ''), 'base64');
        return this;
    }

    hasContent(): boolean {
        return this.content.length !== 0;
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

    getContent(): Buffer {
        return this.content;
    }
}