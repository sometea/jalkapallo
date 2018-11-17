import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { CrudInterface } from "../crudInterface";
import { Article } from "./article";
import uuidv4 from 'uuid';

export class ArticleProvider implements CrudInterface<Article> {
    private tableName = 'Articles';

    constructor(private db: DocumentClient) { }

    list(): Promise<Article[]> {
        return new Promise((resolve, reject) => {
            this.db.scan({
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
                Key: { 'id': id },
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

    async delete(id: string): Promise<void> {
        await this.db.delete({
            TableName: this.tableName,
            Key: { 'id': id },
        }).promise();
        return;
    }

    async create(dataObject: Article): Promise<Article> {
        const newArticle = new Article(
            dataObject.getTitle(),
            dataObject.getBody(),
            uuidv4()
        );
        await this.putArticle(newArticle);
        return newArticle;
    }

    async update(id: string, dataObject: Article): Promise<Article> {
        const updatedArticle = new Article(
            dataObject.getTitle(),
            dataObject.getBody(),
            id
        );
        await this.putArticle(updatedArticle);
        return updatedArticle;
    }

    private async putArticle(article: Article) {
        return this.db.put({
            TableName: this.tableName,
            Item: {
                id: article.getId(),
                title: article.getTitle(),
                body: article.getBody(),
            }
        }).promise();
    }
}