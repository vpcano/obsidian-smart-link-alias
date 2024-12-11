import { Plugin } from 'obsidian';
import { getDisplayName } from 'src/smart-link-alias.functions';
import { getLinkDecorationsStateField } from './link-decorations.field';


export class SmartLinkAliasPlugin extends Plugin {

	async onload() {

		// Register StateField Code Mirror extension for showing links on edit mode
		this.registerEditorExtension(getLinkDecorationsStateField(this));
		
		// Register Markdown Post Processor to update links on reading mode
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

