import marked from "marked"

const renderer = new marked.Renderer();
renderer.heading = function(text, level, raw) {
  return '<h'
    + level
    + '>'
    + text
    + '</h'
    + level
    + '>\n';
};

marked.setOptions({renderer, breaks: true})

const markdown = function(content, config) {
	content = marked(content)

	const allowed_markups = {
		"%SHOWNOTES_ALLOWED_MARKUPS%": `
			a b abbr blockquote br cite code dd del dfn dl dt em kbd li mark ol p pre q s
	        samp small strike strong i ins sub sup time u ul var h1 h2 h3 h4 h5 h6 hr img
		`,
		"%PODCLOUD_ALLOWED_MARKUPS%": `
			a abbr address b bdi bdo blockquote br caption cite code col center colgroup dd
			del dfn div dl dt em figcaption figure form h1 h2 h3 h4 h5 h6 hgroup hr i iframe img input ins
			kbd li mark ol p pre q rp rt ruby s samp small span strike strong sub summary
			sup table tbody td tfoot th thead time tr u ul var wbr
		`
	}

	Object.keys(allowed_markups).forEach((key) => {
		content = content.replace(
			key, 
			allowed_markups[key].match(/\w+/g).map((markup) => {
				"<code>"+markup+"</code>"
			})
		)
	})

	return content
}

const notEmpty = function(obj) {
    return (typeof obj === "string" && obj.trim().length > 0);
};

export { notEmpty, markdown }