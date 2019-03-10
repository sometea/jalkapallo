export class S3File {
    constructor(private title: string, private url: string, private id: string) {}

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