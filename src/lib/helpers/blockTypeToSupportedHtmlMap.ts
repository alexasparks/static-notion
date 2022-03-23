const blockTypeToSupportedHtmlMap = new Map();

blockTypeToSupportedHtmlMap.set('paragraph', 'p');
blockTypeToSupportedHtmlMap.set('heading_1', 'h1');
blockTypeToSupportedHtmlMap.set('heading_2', 'h2');
blockTypeToSupportedHtmlMap.set('heading_3', 'h3');
blockTypeToSupportedHtmlMap.set('bulleted_list_item', 'ul');
blockTypeToSupportedHtmlMap.set('numbered_list_item', 'ol');

export default blockTypeToSupportedHtmlMap;
