import { QuickStartContent } from '../../QuickstartContent'
import { verifyLogs } from '../shared-snippets-logging'
import { frontendInstallSnippet } from '../shared-snippets-monitoring'
import { verifyTraces } from '../shared-snippets-tracing'
import {
	jsGetSnippet,
	verifyError,
} from './shared-snippets-monitoring'

export const JSSvelteKitReorganizedContent: QuickStartContent = {
	title: 'SvelteKit',
	subtitle: 'Learn how to set up highlight.io in your SvelteKit application.',
	logoKey: 'sveltekit',
	products: ['Errors', 'Logs', 'Traces'],
	entries: [
		frontendInstallSnippet,
		jsGetSnippet(['node']),
		{
			title: 'Initialize Highlight in your server hooks',
			content:
				'In SvelteKit, server-side request and error handling are managed via server hooks. ' +
				'Initialize Highlight with your `projectID` in `src/hooks.server.ts` (or `src/hooks.server.js`), ' +
				'and export `handleError` to automatically capture server-side errors.',
			code: [
				{
					text: `// src/hooks.server.ts
import { H } from '@highlight-run/node'
import type { HandleServerError } from '@sveltejs/kit'

H.init({
	projectID: '<YOUR_PROJECT_ID>',
	serviceName: 'sveltekit-app',
})

export const handleError: HandleServerError = ({ error, event }) => {
	const { secureSessionId, requestId } = H.parseHeaders(
		Object.fromEntries(event.request.headers),
	)

	H.consumeError(error as Error, secureSessionId, requestId)
}`,
					language: 'ts',
				},
			],
		},
		{
			title: 'Record logs using console methods',
			content:
				'Logs are automatically recorded by the Highlight SDK. Standard `console.log` and `console.error` calls will be captured and forwarded to Highlight. ' +
				'Arguments passed as an object as the second parameter will be interpreted as structured key-value pairs that logs can be easily searched by.',
			code: [
				{
					text: `console.log('Hello from SvelteKit backend!')
console.error('Something went wrong', { key: 'value' })`,
					language: 'ts',
				},
			],
		},
		verifyError(
			'SvelteKit',
			`// src/routes/+page.server.ts
export const load = async () => {
	throw new Error('Example server error')
}`,
		),
		verifyLogs,
		verifyTraces,
	],
}
