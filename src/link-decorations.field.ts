import { syntaxTree } from '@codemirror/language';
import {
  Extension,
  RangeSetBuilder,
  StateField,
  Transaction,
} from '@codemirror/state';
import {
  Decoration,
  DecorationSet,
  EditorView,
  WidgetType,
} from '@codemirror/view';
import { App } from 'obsidian';
import { getDisplayName } from './smart-link-alias.functions';
import SmartLinkAliasPlugin from './main';


export function getLinkDecorationsStateField(plugin: SmartLinkAliasPlugin) {
	let isMouseDown = false;

	const linkDecorationsField = StateField.define<DecorationSet>({
		create(): DecorationSet {
			return Decoration.none;
		},
		update(oldState: DecorationSet, transaction: Transaction): DecorationSet {

			oldState = oldState.map(transaction.changes);

			const cursor = transaction.state.selection.main;
			const editorView = plugin.app.workspace.activeEditor?.editor;

			// Create new set of decorations
			const builder = new RangeSetBuilder<Decoration>();

			let linkWithAliasStart: number | null = null;
			let hrefContent: string | null = null;
			let aliasContent: string | null = null;

			// Capture internal links that have an alias
			syntaxTree(transaction.state).iterate({
				enter(node) {
					if (node.type.name.startsWith('formatting-link_formatting-link-start')) {
						linkWithAliasStart = node.from;
						hrefContent = null;
						aliasContent = null;
						return;
					}
					if (node.type.name.startsWith('formatting-link_formatting-link-end')) {
						if (linkWithAliasStart != null &&
							hrefContent != null &&
							(
								aliasContent === 'short' ||
								aliasContent === 'long' ||
								aliasContent === 'full'
							)
						) {
							if (editorView?.hasFocus()) {

								// Check if the link was previously decorated
								let wasDecorated = false;
								oldState.between(linkWithAliasStart, node.to, () => {
									wasDecorated = true;
									return false; // Stop iterating
								});

								if (linkWithAliasStart > cursor.to || node.to < cursor.from) {
									builder.add(
										linkWithAliasStart,
										node.to,
										Decoration.replace({
											widget: new LinkPreviewWidget(hrefContent, aliasContent, plugin.app),
										})
									);
								}
								else {
									if (isMouseDown && wasDecorated) {
										builder.add(
											linkWithAliasStart,
											node.to,
											Decoration.replace({
												widget: new LinkPreviewWidget(hrefContent, aliasContent, plugin.app),
											})
										);
									}
								}
							}
							else {
								builder.add(
									linkWithAliasStart,
									node.to,
									Decoration.replace({
										widget: new LinkPreviewWidget(hrefContent, aliasContent, plugin.app),
									})
								);
							}
						}
						linkWithAliasStart = null;
						hrefContent = null;
						aliasContent = null;
						return;
					}
					if (linkWithAliasStart != null) {
						// Get the content of the link and the alias
						const content = transaction.state.doc.sliceString(node.from, node.to);
						if (node.type.name.startsWith('hmd-internal-link_link-has-alias')) {
							hrefContent = content;
						}
						else if (node.type.name.startsWith('hmd-internal-link_link-alias')) {
							aliasContent = content;
						}
					}
				},
			});

			return builder.finish();
		},
		provide(field: StateField<DecorationSet>): Extension {
			return EditorView.decorations.from(field);
		},
	});

	document.addEventListener('mousedown', () => {
        isMouseDown = true;
    }, true);
	document.addEventListener('mouseup', () => {
        isMouseDown = false;
    }, true);

	return linkDecorationsField;
}

class LinkPreviewWidget extends WidgetType {
	href: string;
	content: string;
	app: App;

	constructor(href: string, alias: string, app: App) {
		super();
		this.href = href;
		this.app = app;
		this.content = getDisplayName(this.href, alias, this.app) ?? alias;
	}

	toDOM(view: EditorView): HTMLElement {
		const span = document.createElement('span');
		span.className = "cm-hmd-internal-link";

		const a = document.createElement('a');
		a.className = "cm-underline";
		a.innerText = this.content;
		a.addEventListener('click', () => {
			this.app.workspace.openLinkText(this.href, "");
		});

		span.appendChild(a);
		return span;
	}

}
