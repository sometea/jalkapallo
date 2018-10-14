export class Article {
    constructor(private title: string, private body: string, private id: string) {}

    getTitle(): string {
        return this.title;
    }

    getBody(): string {
        return this.body;
    }

    getId(): string {
        return this.id;
    }
}