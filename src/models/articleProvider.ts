import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { CrudInterface } from "./crudInterface";
import { Article } from "./article";
import { jalkapalloConfig } from "../config";

export class ArticleProvider implements CrudInterface<Article> {
    private tableName = jalkapalloConfig.articlesTable;

    constructor(private db: DocumentClient) { }

    list(): Promise<Article[]> {
        return new Promise((resolve, reject) => {
            this.db.scan({
                TableName: this.tableName,
            }, (err, data) => {
                if (err) {
                    return reject(err);
                } else if (data.Items) {
                    const articles = data.Items.map(item => this.mapItemToArticle(item));
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
                    return resolve(this.mapItemToArticle(data.Item));
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
        const newArticle = Article.copyWithId(dataObject);
        await this.putArticle(newArticle);
        return newArticle;
    }

    async update(id: string, dataObject: Article): Promise<Article> {
        const updatedArticle = Article.copyWithId(dataObject, id);
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
                date: article.getDate().toString(),
                type: article.getType(),
                metaData: article.getMetaData(),
            }
        }).promise();
    }

    private mapItemToArticle(item: DocumentClient.AttributeMap): Article {
        return new Article(item.title, item.body, item.id, new Date(item.date), item.metaData ? item.metaData : {})
    }
}