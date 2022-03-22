import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

/**
 * Notion represents content as JSON blocks
 *
 * Query the notion db for published pages & page content blocks
 *
 * @return Array<{ page, pageContent }>
 */
export const getPagesWithContentBlocks = async () => {
	const pagesWithContentBlocks = [];

	const databaseId = process.env.NOTION_DB_ID;

	const dbQueryResponse = await notion.databases.query({
		database_id: databaseId!,
		filter: {
			property: 'Publish',
			checkbox: {
				equals: true,
			},
		},
	});

	const pages = dbQueryResponse.results;

	for (const page of pages) {
		const pageContentResponse = await notion.blocks.children.list({
			block_id: page.id,
		});

		const pageContent = pageContentResponse.results;

		pagesWithContentBlocks.push({
			page,
			pageContent,
		});
	}

	return pagesWithContentBlocks;
};
