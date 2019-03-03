import { Article } from "./article";

export class ArticleMarkdownMapper {
    toArticle(text: string, id: string = ''): Article {
        const separationIndex = text.indexOf('\n\n');
        const jsonPart = text.substring(0, separationIndex);
        const bodyPart = text.substring(separationIndex + 2);
        const dataObject = JSON.parse(jsonPart);
        const metaData = { ...dataObject };
        delete metaData.title;
        delete metaData.date;
        return new Article(
            dataObject.title ? dataObject.title : '',
            bodyPart,
            id,
            dataObject.date ? new Date(dataObject.date) : new Date(),
            'article',
            metaData
        );
    }

    toMarkdown(article: Article): string {
        const jsonPart = JSON.stringify({
            title: article.getTitle(),
            date: article.getDate().toISOString(),
            ...article.getMetaData(),
        }) + '\n\n';
        return jsonPart + article.getBody();
    }
}