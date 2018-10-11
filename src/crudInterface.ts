export interface CrudInterface<DataObject> {
    list(): DataObject[];
    get(id: string): DataObject;
    delete(id: string): void;
    save(dataObject: DataObject): DataObject;
}