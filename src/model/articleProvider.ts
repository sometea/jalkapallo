import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { CrudInterface } from "../crudInterface";
import { Article } from "./article";

export class ArticleProvider implements CrudInterface<Article> {
    constructor(private db: DocumentClient) { }

    list(): Article[] {
        return [];
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