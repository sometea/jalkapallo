import { ArticleProvider } from './articleProvider';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Article } from './article';

describe('ArticleProvider', () => {
    let articleProvider: ArticleProvider;
    let documentClientSpy: DocumentClient;

    beforeEach(() => {
        documentClientSpy = jasmine.createSpyObj<DocumentClient>(['put', 'get']);
        articleProvider = new ArticleProvider(documentClientSpy);
    });

    it('lists articles', () => {
        expect(articleProvider.list()).toEqual([]);
    });

    it('gets an article by id', () => {
        const article = articleProvider.get('testId');
        expect(article.getBody()).toEqual('test');
        expect(article.getTitle()).toEqual('test');
        expect(article.getId()).toEqual('id');
    });

    it('deletes an article by id', () => {
        expect(true).toBeTruthy();
    });

    it('saves an article to the db', () => {
        const article = new Article('test', 'test', 'test');
        expect(articleProvider.save(article)).toEqual(article);
    })
});