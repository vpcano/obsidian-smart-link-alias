import { Plugin, TFile } from 'obsidian';


export default class AcronymLinksPlugin extends Plugin {

	async onload() {
		this.registerMarkdownPostProcessor((el, ctx) => {
			const internalLinks = el.querySelectorAll("a.internal-link");

			internalLinks.forEach(async (link) => {
				const href = link.getAttribute("href");
				if (!href) return;

				const noteFile = this.app.vault.getAbstractFileByPath(`${href}.md`);
				if (!(noteFile instanceof TFile)) return;

				const metadata = this.app.metadataCache.getFileCache(noteFile);
				const frontmatter = metadata?.frontmatter;
				if (!frontmatter) return;

				const fullTitle = frontmatter["full-title"];
				const acronym = frontmatter["acronym"];
				if (!fullTitle || !acronym) return;

				if (link.textContent?.startsWith("\\")) {
					link.textContent = link.textContent.substring(1);
					return;
				}

				switch (link.textContent) {
					case "long":
						link.textContent = `${acronym} (${fullTitle})`;
						break;
					
					case "full":
						link.textContent = fullTitle;
						break;

					case "short":
					case href:
						link.textContent = acronym;
						break;

					default:
						break;
				}

			});
		});
	}

}
