import { ArticleProvider } from './articleProvider';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Article } from './article';

describe('ArticleProvider', () => {
    let articleProvider: ArticleProvider;
    let documentClientSpy: DocumentClient;

    beforeEach(() => {
        documentClientSpy = jasmine.createSpyObj<DocumentClient>('DocumentClient', ['get', 'scan', 'delete', 'put']);
        articleProvider = new ArticleProvider(documentClientSpy);
    });

    it('lists articles', async () => {
        documentClientSpy.scan = jasmine.createSpy().and.callFake((params: any, callback: any) => {
            callback('', { Items: []});
        });
        const result = await articleProvider.list();
        expect(result).toEqual([]);
    });

    it('gets an article by id', async () => {
        documentClientSpy.get = jasmine.createSpy().and.callFake((params: any, callback: any) => {
            callback('', { Item: { title: 'title', body: 'body', id: 'id' }});
        });
        const article = await articleProvider.get('testId');
        expect(article.getBody()).toEqual('body');
        expect(article.getTitle()).toEqual('title');
        expect(article.getId()).toEqual('id');
    });

    it('deletes an article by id', async () => {
        documentClientSpy.delete = jasmine.createSpy('delete').and.returnValue({ promise: () => {} });
        await articleProvider.delete('testId');
        expect(documentClientSpy.delete).toHaveBeenCalled();
    });

    it('saves an article to the db', async () => {
        documentClientSpy.put = jasmine.createSpy('put').and.returnValue({ promise: () => {} });
        const article = new Article('test', 'test', 'test');
        const result = await articleProvider.create(article);
        expect(result.getBody()).toEqual(article.getBody());
        expect(result.getTitle()).toEqual(article.getTitle());
        expect(result.getId()).not.toEqual(article.getId());
        expect(documentClientSpy.put).toHaveBeenCalled();
    });

    it('updates an article', async () => {
        documentClientSpy.put = jasmine.createSpy('put').and.returnValue({ promise: () => {} });
        const article = new Article('test', 'test', 'test');
        const result = await articleProvider.update('testId', article);
        expect(result.getBody()).toEqual(article.getBody());
        expect(result.getTitle()).toEqual(article.getTitle());
        expect(result.getId()).toEqual('testId');
        expect(documentClientSpy.put).toHaveBeenCalled();
    });
});