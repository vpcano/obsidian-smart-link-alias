import { App, TFile } from "obsidian";

export function getDisplayName(href: string, displayText: string, app: App) {
	const noteFile = app.metadataCache.getFirstLinkpathDest(`${href}.md`, "");
	if (!(noteFile instanceof TFile)) return;

	const metadata = app.metadataCache.getFileCache(noteFile);
	const frontmatter = metadata?.frontmatter;
	if (!frontmatter) return;

	const fullTitle = frontmatter["full-title"];
	const acronym = frontmatter["acronym"];
	if (!fullTitle || !acronym) return;

	if (displayText.startsWith("\\")) {
		return displayText.substring(1);
	}

	switch (displayText) {
		case "long":
			return `${acronym} (${fullTitle})`;

		case "full":
			return fullTitle;

		case "short":
			return acronym;

		default:
			return;
	}
}
