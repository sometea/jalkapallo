import { CrudInterface } from "./crudInterface";
import { Image } from "./image";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import uuidv4 from 'uuid';
import { jalkapalloConfig } from "../config";

export class ImageProvider implements CrudInterface<Image> {
    private tableName = jalkapalloConfig.imagesTable;

    constructor(private db: DocumentClient) { }

    list(): Promise<Image[]> {
        return new Promise((resolve, reject) => {
            this.db.scan({
                TableName: this.tableName,
            }, (err, data) => {
                if (err) {
                    return reject(err);
                } else if (data.Items) {
                    const images = data.Items.map((item) => {
                        return new Image(item.title, item.filename, item.url, item.id);
                    });
                    return resolve(images);
                }
                return reject('No items found.');
            });
        });
    }

    get(id: string): Promise<Image> {
        return new Promise((resolve, reject) => {
            this.db.get({
                TableName: this.tableName,
                Key: { 'id': id },
            }, (err, data) => {
                if (err) {
                    return reject(err);
                } else if (data.Item) {
                    return resolve(new Image(data.Item.title, data.Item.filename, data.Item.url, data.Item.id));
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

    async create(dataObject: Image): Promise<Image> {
        const newImage = new Image(
            dataObject.getTitle(),
            dataObject.getFilename(),
            dataObject.getUrl(),
            uuidv4()
        );
        await this.putArticle(newImage);
        return newImage;
    }

    async update(id: string, dataObject: Image): Promise<Image> {
        const updatedImage = new Image(
            dataObject.getTitle(),
            dataObject.getFilename(),
            dataObject.getUrl(),
            id
        );
        await this.putArticle(updatedImage);
        return updatedImage;
    }

    private async putArticle(image: Image) {
        return this.db.put({
            TableName: this.tableName,
            Item: {
                id: image.getId(),
                title: image.getTitle(),
                filename: image.getFilename(),
                url: image.getUrl(),
            }
        }).promise();
    }
}