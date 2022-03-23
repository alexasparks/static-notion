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

const init = async () => {
	const notionPagesWithContent = await getPagesWithContentBlocks();

	// we want a fresh site dir every time!
	if (fs.existsSync(siteDirPath)) {
		fs.rmSync(siteDirPath, { recursive: true });
	}

	fs.mkdirSync(siteDirPath);

	for (const pageWithContentBlock of notionPagesWithContent) {
		const htmlBodyContent = await wrapPageContentWithHtmlTags(
			pageWithContentBlock.pageContent,
		);

		// @ts-ignore
		const pageProps = pageWithContentBlock.page.properties;

		const head = constructHeadTagTemplate(
			//@ts-ignore
			pageProps.Title[pageProps.Title.type][0].plain_text,
		);

		const body = constructBodyTagTemplate(htmlBodyContent);

		const htmlTemplate = constructHtmlTagTemplate(`${head}${body}`);
		fs.writeFileSync(
			path.join(
				siteDirPath,
				`${pageProps.slug[pageProps.slug.type][0].plain_text}.html`,
			),
			htmlTemplate,
		);
	}
};

init();
