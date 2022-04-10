import path from 'path';
import {
	constructHeadTagTemplate,
	constructBodyTagTemplate,
	constructHtmlTagTemplate,
	createTag,
} from './helpers/htmlTemplateConstructors';
import monthMap from './helpers/monthMap';
import { PageProperties } from './types/Notion';
import { getOrdinalDate } from './helpers/getOrdinalDate';

export const createHomePageTemplate = (
	pagePropsList: PageProperties[],
	postsDirPath: string,
) => {
	const title = 'Alexa Sparks';

	const postLinks: { [year: string]: { [month: string]: string[] } } = {};

	pagePropsList.forEach((pageProp) => {
		const slug = pageProp.Slug.rich_text[0].plain_text;
		const date = new Date(pageProp.Date.date.start);
		const href = path.join(postsDirPath, `${slug}.html`);

		const month = monthMap.get(date.getMonth());
		const year = date.getFullYear().toString();

		const postTitleHtml = createTag({
			el: 'p',
			content: pageProp.Title.title[0].plain_text,
		});

		const dateHtml = `<time datetime=${date}>${getOrdinalDate(
			date.getDate(),
		)}</time>`;

		const link = createTag({
			el: 'a',
			attr: `href=${href}`,
			content: `${postTitleHtml}${dateHtml}`,
		});

		postLinks[year] = {
			...postLinks[year],
			[month]: [...(postLinks[year]?.[month] ?? []), link],
		};
	});

	console.log(postLinks);
	const head = constructHeadTagTemplate(title);
	// const body = constructBodyTagTemplate(title, postLinks.join(''));
	// return constructHtmlTagTemplate(`${head}${body}`);

	const years = Object.keys(postLinks);

	years.forEach((year) => {
		const months = Object.keys(postLinks[year]);

		months.forEach((month) => {
			console.log('month', month);
		});
	});
};
