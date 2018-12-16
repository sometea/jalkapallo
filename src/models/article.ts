export class Article {
    constructor(private title: string, private body: string, private id: string, private date: Date = new Date()) {}

    getTitle(): string {
        return this.title;
    }

    getBody(): string {
        return this.body;
    }

    getId(): string {
        return this.id;
    }

    getDate(): Date {
        return this.date;
    }
}