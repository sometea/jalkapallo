export interface CrudInterface<DataObject> {
    list(): Promise<DataObject[]>;
    get(id: string): Promise<DataObject>;
    delete(id: string): Promise<void>;
    save(dataObject: DataObject): Promise<DataObject>;
}