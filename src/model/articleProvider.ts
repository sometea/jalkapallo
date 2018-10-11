import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { CrudInterface } from "../crudInterface";
import { Article } from "./article";

export class ArticleProvider implements CrudInterface<Article> {
    constructor(private db: DocumentClient) { }

    list(): Promise<Article[]> {
        return new Promise((resolve, reject) => {
            this.db.query({
                TableName: 'Articles',
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else if (data.Items) {
                    const articles = data.Items.map((item) => {
                        return new Article(item.title, item.body, item.id);
                    });
                    resolve(articles);
                } else {
                    reject('No items found.');
                }
            });
        });
    }

    get(id: string): Article {
        return new Article('test', 'test', 'id');
    }

    delete(id: string): void {
        return;
    }

    save(dataObject: Article): Article {
        return dataObject;
    }
}