import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { CrudInterface } from "./crudInterface";
import { Article } from "./article";
import { jalkapalloConfig } from "../config";

export class ArticleProvider implements CrudInterface<Article> {
    private tableName = jalkapalloConfig.articlesTable;

    constructor(private db: DocumentClient) { }

    async list(): Promise<Article[]> {
        const data = await this.db.scan({ TableName: this.tableName }).promise();
        return data.Items ? data.Items.map(item => this.mapItemToArticle(item)) : [];
    }

    async get(id: string): Promise<Article> {
        const data = await this.db.get({
            TableName: this.tableName,
            Key: { 'id': id },
        }).promise();
        if (data.Item) {
            return this.mapItemToArticle(data.Item);
        }
        throw new Error('No item with id ' + id + ' found.');
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
        return new Article(item.title, item.body, item.id, new Date(item.date), item.type, item.metaData ? item.metaData : {})
    }
}