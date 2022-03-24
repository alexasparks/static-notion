import fs from 'fs';
import path from 'path';
import { wrapPageContentWithHtmlTags } from './lib/wrapPageContentWithHtmlTags';
import { getPagesWithContentBlocks } from './lib/getPagesWithContentBlocks';
import {
	constructBodyTagTemplate,
	constructHtmlTagTemplate,
	constructHeadTagTemplate,
} from './lib/helpers/htmlTemplateConstructors';

const siteDirPath = path.join(__dirname, '..', 'site');
const postsDirPath = path.join(__dirname, '..', 'site', 'posts');

const init = async () => {
	const notionPagesWithContent = (await getPagesWithContentBlocks()) ?? [];

	// we want a fresh site dir every time!
	if (fs.existsSync(siteDirPath)) {
		fs.rmSync(siteDirPath, { recursive: true });
	}

	fs.mkdirSync(siteDirPath);
	fs.mkdirSync(postsDirPath);

	for (const pageWithContentBlock of notionPagesWithContent) {
		const htmlBodyContent =
			wrapPageContentWithHtmlTags(pageWithContentBlock.pageContent) ?? '';

		// @ts-ignore
		const pageProps = pageWithContentBlock.page.properties;
		const title = pageProps.Title[pageProps.Title.type][0].plain_text;
		const slug = `${pageProps.slug[pageProps.slug.type][0].plain_text}.html`;

		const head = constructHeadTagTemplate(title);

		const body = constructBodyTagTemplate(title, htmlBodyContent);

		const htmlTemplate = constructHtmlTagTemplate(`${head}${body}`);
		fs.writeFileSync(path.join(postsDirPath, slug), htmlTemplate);
	}
};

init();
