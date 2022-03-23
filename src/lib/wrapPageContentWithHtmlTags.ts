import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints';
import blockTypeToSupportedHtmlMap from './helpers/blockTypeToSupportedHtmlMap';

/** Handles most supported html tags, including p, li, ul, ol, h1, h2, h3 */
const genericTagWrapper = (tag: string, content: string) =>
	`<${tag}>${content}</${tag}>`;

const aTagWrapper = (content: string, href: string) =>
	`<a href=${href} target="_blank">${content}</a>`;

/**
 *
 * @param contentBlocks Array<PartialBlockObjectResponse | BlockObjectResponse>
 * @returns string of content wrapped with HTML tags
 */
export const wrapPageContentWithHtmlTags = (
	contentBlocks: ListBlockChildrenResponse['results'],
) => {
	let template = '';

	contentBlocks.forEach((contentBlock, i) => {
		// @ts-ignore
		// @TODO: look into types for contentBlock, seems BlockObjectResponse is not being exported correctly from notion API
		const contentBlockTag = blockTypeToSupportedHtmlMap.get(contentBlock.type);

		// @ts-ignore
		const richTextBlocks = contentBlock[contentBlock.type].rich_text;

		let contentBlockContent = '';
		for (const richTextBlock of richTextBlocks) {
			// @ts-ignore
			let tag = blockTypeToSupportedHtmlMap.get(contentBlock.type);

			// links have a type "paragraph" from the API, but should
			// be wrapped in anchor tags instead of p
			if (tag === 'p' && richTextBlock.href) {
				tag = 'a';
			}
			switch (tag) {
				case 'p':
					contentBlockContent += richTextBlock[richTextBlock.type].content;
					break;
				case 'a':
					contentBlockContent += aTagWrapper(
						richTextBlock[richTextBlock.type].content,
						richTextBlock[richTextBlock.type].link.url,
					);
					break;
				default:
					contentBlockContent += richTextBlock[richTextBlock.type].content;
			}
		}

		// We need to wrap lists in ul or ol, this logic checks for list items
		if (contentBlockTag === 'ul' || contentBlockTag === 'ol') {
			const prevBlock = contentBlocks[i - 1];
			const nextBlock = contentBlocks[i + 1];
			// @ts-ignore
			const prevTag = blockTypeToSupportedHtmlMap.get(prevBlock.type);
			// @ts-ignore
			const nextTag = blockTypeToSupportedHtmlMap.get(nextBlock.type);

			const listItem = genericTagWrapper('li', contentBlockContent);

			if (prevTag !== contentBlockTag) {
				template += `<${contentBlockTag}>${listItem}`;
				return;
			}

			if (nextTag !== contentBlockTag) {
				template += `${listItem}</${contentBlockTag}>`;
				return;
			}

			template += listItem;
		} else {
			template += genericTagWrapper(contentBlockTag, contentBlockContent);
		}
	});

	return template;
};
