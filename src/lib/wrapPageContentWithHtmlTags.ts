import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints';
import blockTypeToSupportedHtmlMap from './helpers/blockTypeToSupportedHtmlMap';
import { createTag } from './helpers/htmlTemplateConstructors';

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
		try {
			// @TODO: look into types for contentBlock, seems BlockObjectResponse is not being exported correctly from notion API
			const contentBlockTag = blockTypeToSupportedHtmlMap.get(
				// @ts-ignore
				contentBlock.type,
			);

			// @ts-ignore
			const contentBlockTypeDetails = contentBlock[contentBlock.type];

			const richTextBlocks = contentBlockTypeDetails.rich_text ?? [];

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
						contentBlockContent += createTag({
							el: tag,
							attr: `href=${richTextBlock[richTextBlock.type].link.url}`,
							content: richTextBlock[richTextBlock.type].content,
						});
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
				const prevTag = blockTypeToSupportedHtmlMap.get(prevBlock?.type);
				// @ts-ignore
				const nextTag = blockTypeToSupportedHtmlMap.get(nextBlock?.type);

				const listItem = createTag({ el: 'li', content: contentBlockContent });

				if (prevTag !== contentBlockTag) {
					template += `<${contentBlockTag}>${listItem}`;
					return;
				}

				if (nextTag !== contentBlockTag) {
					template += `${listItem}</${contentBlockTag}>`;
					return;
				}

				template += listItem;
			} else if (contentBlockTag === 'img') {
				const caption = contentBlockTypeDetails.caption[0]?.plain_text;

				if (!caption) {
					return;
				}

				template += createTag({
					el: contentBlockTag,
					attr: `src=${contentBlockTypeDetails.file.url}`,
					content: caption,
				});
			} else {
				template += createTag({
					el: contentBlockTag,
					content: contentBlockContent,
				});
			}
		} catch (error) {
			console.error('Error wrapping page content with HTML tags: ', error);
		}
	});

	return template;
};
