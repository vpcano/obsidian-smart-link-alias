import { App, TFile } from "obsidian";

export function getDisplayName(href: string, displayText: string, app: App) {
	// Get the note instance that best matches the given href
	const noteFile = app.metadataCache.getFirstLinkpathDest(`${href}.md`, "");
	if (!(noteFile instanceof TFile)) return;

	// Get the notes frontmatter from its metadata
	const metadata = app.metadataCache.getFileCache(noteFile);
	const frontmatter = metadata?.frontmatter;
	if (!frontmatter) return;

	// Get "full-title" and "short-title" properties
	const fullTitle = frontmatter["full-title"];
	const shortTitle = frontmatter["short-title"];
	if (!fullTitle || !shortTitle) return;

	// Escape the alias
	if (displayText.startsWith("\\")) {
		return displayText.substring(1);
	}

	switch (displayText) {
		case "long":
			return `${shortTitle} (${fullTitle})`;

		case "full":
			return fullTitle;

		case "short":
			return shortTitle;

		default:
			return;
	}
}
