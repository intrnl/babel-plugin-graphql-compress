import { declare } from '@babel/helper-plugin-utils';

/** @type {import('graphql')} */
let graphql;

try {
	graphql = await import('graphql');
}
catch {
	try {
		graphql = await import('graphql-web-lite');
	}
	catch (error) {
		throw new Error(`failed to import graphql, do you have it installed?`, { cause: error });
	}
}

export default declare((api, config) => {
	const { types: t } = api

	const tagName = config.tagName ?? 'gql';

	return {
		name: '@intrnl/babel-plugin-graphql-compress',
		visitor: {
			TaggedTemplateExpression (path) {
				if (!t.isIdentifier(path.node.tag, {name: tagName})) {
					return;
				}

				const quasis = path.get('quasi.quasis');

				if (quasis.length > 1) {
					return;
				}

				const [content] = quasis;
				const value = content.node.value.raw;

				const minified = graphql.stripIgnoredCharacters(value);

				content.replaceWith(t.templateElement({ raw: minified }));
			},
		},
	};
});
