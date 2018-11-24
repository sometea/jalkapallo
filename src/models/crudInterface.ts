export interface CrudInterface<DataObject> {
    list(): Promise<DataObject[]>;
    get(id: string): Promise<DataObject>;
    delete(id: string): Promise<void>;
    create(dataObject: DataObject): Promise<DataObject>;
    update(id: string, dataObject: DataObject): Promise<DataObject>;
}