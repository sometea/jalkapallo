import { ImageProvider } from "./imageProvider";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Image } from "./image";

describe('ImageProvider', () => {
    let imageProvider: ImageProvider;
    let documentClientSpy: DocumentClient;

    beforeEach(() => {
        documentClientSpy = jasmine.createSpyObj<DocumentClient>('DocumentClient', ['get', 'scan', 'delete', 'put']);
        imageProvider = new ImageProvider(documentClientSpy);
    });

    it('lists images', async () => {
        documentClientSpy.scan = jasmine.createSpy().and.callFake((params: any, callback: any) => {
            callback('', { Items: []});
        });
        const result = await imageProvider.list();
        expect(result).toEqual([]);
    });

    it('gets an image by id', async () => {
        documentClientSpy.get = jasmine.createSpy().and.callFake((params: any, callback: any) => {
            callback('', { Item: { title: 'title', filename: 'filename', url: 'url', id: 'id' }});
        });
        const image = await imageProvider.get('testId');
        expect(image.getFilename()).toEqual('filename');
        expect(image.getUrl()).toEqual('url');
        expect(image.getTitle()).toEqual('title');
        expect(image.getId()).toEqual('id');
    });

    it('deletes an image by id', async () => {
        documentClientSpy.delete = jasmine.createSpy('delete').and.returnValue({ promise: () => {} });
        await imageProvider.delete('testId');
        expect(documentClientSpy.delete).toHaveBeenCalled();
    });

    it('saves an image to the db', async () => {
        documentClientSpy.put = jasmine.createSpy('put').and.returnValue({ promise: () => {} });
        const image = new Image('test', 'test', 'test', 'test');
        const result = await imageProvider.create(image);
        expect(result.getFilename()).toEqual(image.getFilename());
        expect(result.getUrl()).toEqual(image.getUrl());
        expect(result.getTitle()).toEqual(image.getTitle());
        expect(result.getId()).not.toEqual(image.getId());
        expect(documentClientSpy.put).toHaveBeenCalled();
    });

    it('updates an image', async () => {
        documentClientSpy.put = jasmine.createSpy('put').and.returnValue({ promise: () => {} });
        const image = new Image('test', 'test', 'test', 'test');
        const result = await imageProvider.update('testId', image);
        expect(result.getFilename()).toEqual(image.getFilename());
        expect(result.getUrl()).toEqual(image.getUrl());
        expect(result.getTitle()).toEqual(image.getTitle());
        expect(result.getId()).toEqual('testId');
        expect(documentClientSpy.put).toHaveBeenCalled();
    });
});