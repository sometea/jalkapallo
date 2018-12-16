import { Article } from './article';

describe('article', () => {
    let article: Article;
    const testDate = new Date();

    beforeEach(() => {
        article = new Article('title', 'body', 'id', testDate);
    });

    it('has a title', () => {
        expect(article.getTitle()).toBe('title');
    });

    it('has a body', () => {
        expect(article.getBody()).toBe('body');
    });

    it('has an id', () => {
        expect(article.getId()).toBe('id');
    });

    it('has a date', () => {
        expect(article.getDate()).toBe(testDate);
    });
})