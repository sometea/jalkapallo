import uuidv4 from 'uuid';

export class Article {
    constructor(
        private title: string,
        private body: string,
        private id: string, 
        private date: Date = new Date(),
        private type: string = '',
        private metaData: Object = {}
        ) {}

    static copyWithId(article: Article, id: string|null = null) {
        return new Article(
            article.getTitle(),
            article.getBody(),
            id ? id : uuidv4(),
            article.getDate(),
            article.getType(),
            article.getMetaData()
        );
    }    

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

    getType(): string {
        return this.type;
    }

    getMetaData(): Object {
        return this.metaData;
    }
}