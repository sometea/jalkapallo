export class S3File {
    constructor(private title: string, private filename: string, private url: string, private id: string) {}

    getTitle(): string {
        return this.title;
    }

    getFilename(): string {
        return this.filename;
    }

    getUrl(): string {
        return this.url;
    }

    getId(): string {
        return this.id;
    }
}