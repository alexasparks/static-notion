import { wrapPageContentWithHtmlTags } from './lib/wrapPageContentWithHtmlTags';
import { getPagesWithContentBlocks } from './lib/getPagesWithContentBlocks';

const init = async () => {
	const notionPagesWithContent = await getPagesWithContentBlocks();

	for (const page of notionPagesWithContent) {
		const htmlBodyContent = await wrapPageContentWithHtmlTags(page.pageContent);
	}
};

init();
