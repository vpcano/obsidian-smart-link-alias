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
import { getDisplayName } from 'acronym-link.functions';
import AcronymLinksPlugin from 'main';
import { App } from 'obsidian';


export default function getAcronymLinksStateField(plugin: AcronymLinksPlugin) {

	const acronymLinkField = StateField.define<DecorationSet>({
		create(): DecorationSet {
			return Decoration.none;
		},
		update(oldState: DecorationSet, transaction: Transaction): DecorationSet {

			const builder = new RangeSetBuilder<Decoration>();

			let linkWithAliasStart: number | null = null;
			let hrefContent: string | null = null;
			let aliasContent: string | null = null;

			syntaxTree(transaction.state).iterate({
				enter(node) {
					if (node.type.name == 'formatting-link_formatting-link-start') {
						linkWithAliasStart = node.from;
						hrefContent = null;
						aliasContent = null;
						return;
					}
					if (node.type.name == 'formatting-link_formatting-link-end') {
						if (linkWithAliasStart != null &&
							hrefContent != null &&
							aliasContent != null
						) {
							builder.add(
								linkWithAliasStart,
								node.to,
								Decoration.replace({
									widget: new AcronymLinkWidget(hrefContent, aliasContent, plugin.app),
								})
							);
						}
						linkWithAliasStart = null;
						hrefContent = null;
						aliasContent = null;
						return;
					}
					if (linkWithAliasStart != null) {
						const content = transaction.state.doc.sliceString(node.from, node.to);
						if (node.type.name == 'hmd-internal-link_link-has-alias') {
							hrefContent = content;
						}
						else if (node.type.name == 'hmd-internal-link_link-alias') {
							aliasContent = content;
						}
					}
				},
			});

			const cursor = transaction.state.selection.main;
			const decorations = builder.finish();
			return decorations.update({
				filter: (from, to) => from > cursor.to || to < cursor.from
			});
		},
		provide(field: StateField<DecorationSet>): Extension {
			return EditorView.decorations.from(field);
		},
	});

	return acronymLinkField;
}

class AcronymLinkWidget extends WidgetType {
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
		})

		span.appendChild(a);
		return span;
	}

}
