import getAcronymLinksStateField from 'acronym-link.field';
import { getDisplayName } from 'acronym-link.functions';
import { Plugin } from 'obsidian';


export default class AcronymLinksPlugin extends Plugin {

	async onload() {
		this.registerEditorExtension(getAcronymLinksStateField(this));
		
		this.registerMarkdownPostProcessor((el, ctx) => {
			const internalLinks = el.querySelectorAll("a.internal-link");

			internalLinks.forEach(async (link) => {
				const href = link.getAttribute("href");
				if (!href) return;
				if (!link.textContent) return;

				link.textContent = getDisplayName(href, link.textContent, this.app) ?? link.textContent;
			});
		});
	}

}
