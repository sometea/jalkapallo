import { ArticleMarkdownMapper } from "./articleMarkdownMapper";
import { Article } from "./article";

describe('ArticleMarkdownMapper', () => {
    let articleMarkdownMapper: ArticleMarkdownMapper;

    beforeEach(() => {
        articleMarkdownMapper = new ArticleMarkdownMapper();
    });

    it('should map a string with meta data to an article', () => {
        const testString = `
{"title":"testTitle","date":"1980-12-11T23:00:00.000Z","something":"something else"}

A test body`;
        const expectedArticle = new Article(
            'testTitle',
            'A test body',
            'testId',
            new Date('12.12.1980'),
            'article',
            { something: 'something else' }
        );

        expect(articleMarkdownMapper.toArticle(testString, 'testId')).toEqual(expectedArticle);
    });

    it('should map an article to a markdown string with json meta data', () => {
        const testArticle = new Article('testTitle', 'testBody', 'testId', new Date('12.12.1980'), 'article', { something: 'something else' });
        const expected = `{"title":"testTitle","date":"1980-12-11T23:00:00.000Z","something":"something else"}

testBody`;

        expect(articleMarkdownMapper.toMarkdown(testArticle)).toEqual(expected);
    });
});