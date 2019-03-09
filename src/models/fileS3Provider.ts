import { S3 } from "aws-sdk/clients/all";
import { S3File } from "./s3file";
import { CrudInterface } from "./crudInterface";

export class FileS3Provider implements CrudInterface<S3File> {
    list(): Promise<S3File[]> {
        throw new Error("Method not implemented.");
    }
    get(id: string): Promise<S3File> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    create(dataObject: S3File): Promise<S3File> {
        throw new Error("Method not implemented.");
    }
    update(id: string, dataObject: S3File): Promise<S3File> {
        throw new Error("Method not implemented.");
    }

    constructor(private s3: S3) { }
}