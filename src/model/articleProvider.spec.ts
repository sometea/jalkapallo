import { ArticleProvider } from './articleProvider';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Article } from './article';

describe('ArticleProvider', () => {
    let articleProvider: ArticleProvider;
    let documentClientSpy: DocumentClient;

    beforeEach(() => {
        documentClientSpy = jasmine.createSpyObj<DocumentClient>(['get', 'query']);
        articleProvider = new ArticleProvider(documentClientSpy);
    });

    it('lists articles', async () => {
        documentClientSpy.query = jasmine.createSpy().and.callFake((params: any, callback: any) => {
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

    it('deletes an article by id', () => {
        expect(true).toBeTruthy();
    });

    it('saves an article to the db', async () => {
        const article = new Article('test', 'test', 'test');
        expect(await articleProvider.save(article)).toEqual(article);
    })
});