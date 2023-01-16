import { transformAsync } from '@babel/core';
import gqlCompressPlugin from './src/index.js'

const source = `
	const getUsers = gql\`
		query getPlacements ($search: String, $limit: Int, $offset: Int) {
			total: users_aggregate(where: {name: {_ilike: $search}}) {
				aggregate {
					count
				}
			}
			users(where: {name: {_ilike: $search}}, limit: $limit, offset: $offset) {
				id
				name
				avatar
			}
		}
	\`;
`

const result = await transformAsync(source, {
	plugins: [
		[gqlCompressPlugin],
	],
});

console.log(result.code);
