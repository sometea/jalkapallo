import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { CrudInterface } from "../crudInterface";
import { Article } from "./article";

export class ArticleProvider implements CrudInterface<Article> {
    private tableName = 'Articles';

    constructor(private db: DocumentClient) { }

    list(): Promise<Article[]> {
        return new Promise((resolve, reject) => {
            this.db.query({
                TableName: this.tableName,
            }, (err, data) => {
                if (err) {
                    return reject(err);
                } else if (data.Items) {
                    const articles = data.Items.map((item) => {
                        return new Article(item.title, item.body, item.id);
                    });
                    return resolve(articles);
                }
                return reject('No items found.');
            });
        });
    }

    get(id: string): Promise<Article> {
        return new Promise((resolve, reject) => {
            this.db.get({
                TableName: this.tableName,
                Key: [{ id: id }],
            }, (err, data) => {
                if (err) {
                    return reject(err);
                } else if (data.Item) {
                    return resolve(new Article(data.Item.title, data.Item.body, data.Item.id));
                }
                return reject('No item found.');
            });
        });
    }

    delete(id: string): Promise<void> {
        return new Promise(resolve => resolve());
    }

    save(dataObject: Article): Promise<Article> {
        return new Promise(resolve => resolve(dataObject));
    }
}