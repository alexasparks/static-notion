export const constructHeadTagTemplate = (title: string) =>
	`<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>${title}</title><link rel="stylesheet" href="style.css"></head>`;

export const constructBodyTagTemplate = (title: string, content: string) =>
	`<body><h1>${title}</h1>${content}</body>`;

export const constructHtmlTagTemplate = (content: string) =>
	`<!DOCTYPE html><html lang="en">${content}</html>`;

/** Handles most supported html tags, including p, li, ul, ol, h1, h2, h3 */
export const constructGenericTagTemplate = (
	tag: string,
	content: string,
	href?: string,
) => {
	if (href) {
		return `<a href=${href} target="_blank">${content}</a>`;
	}

	return `<${tag}>${content}</${tag}>`;
};
