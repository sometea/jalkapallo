export interface ExportInterface<DataObject> {
    delete(id: string): Promise<void>;
    createOrUpdate(dataObject: DataObject): Promise<DataObject>;
}