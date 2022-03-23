import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints';
import blockTypeToSupportedHtmlMap from './helpers/blockTypeToSupportedHtmlMap';

/** Handles most supported html tags, including p, li, ul, ol, h1, h2, h3 */
const genericTagWrapper = (tag: string, content: string) =>
	`<${tag}>${content}</${tag}>`;

const aTagWrapper = (content: string, href: string) =>
	`<a href=${href}>${content}</a>`;

/**
 *
 * @param contentBlocks Array<PartialBlockObjectResponse | BlockObjectResponse>
 * @returns string of content wrapped with HTML tags
 */
export const wrapPageContentWithHtmlTags = async (
	contentBlocks: ListBlockChildrenResponse['results'],
) => {
	let template = '';

	for (const contentBlock of contentBlocks) {
		// @ts-ignore
		// @TODO: look into types for contentBlock, seems BlockObjectResponse is not being exported correctly from notion API
		const sectionTag = blockTypeToSupportedHtmlMap.get(contentBlock.type);

		// @ts-ignore
		const richTextBlocks = contentBlock[contentBlock.type].rich_text;

		let pageContent = '';
		for (const richTextBlock of richTextBlocks) {
			// @ts-ignore
			let tag = blockTypeToSupportedHtmlMap.get(contentBlock.type);

			// links have a type "paragraph" from the API, but should
			// be wrapped in anchor tags instead of p
			if (tag === 'p' && richTextBlock.href) {
				tag = 'a';
			}

			// The section will specify list type, but we want the children to
			// be wrapped in li tags
			if (sectionTag === 'ul' || sectionTag === 'ol') {
				tag = 'li';
			}

			switch (tag) {
				case 'p':
					pageContent += richTextBlock[richTextBlock.type].content;
					break;
				case 'a':
					pageContent += aTagWrapper(
						richTextBlock[richTextBlock.type].content,
						richTextBlock[richTextBlock.type].link.url,
					);
					break;
				case 'li':
					pageContent += genericTagWrapper(
						'li',
						richTextBlock[richTextBlock.type].content,
					);
				default:
					pageContent += richTextBlock[richTextBlock.type].content;
			}
		}

		if (sectionTag) {
			template += genericTagWrapper(sectionTag, pageContent);
		}
	}

	return template;
};
