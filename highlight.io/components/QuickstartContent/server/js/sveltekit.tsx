import { QuickStartContent } from '../../QuickstartContent'
import { verifyLogs } from '../shared-snippets-logging'
import { frontendInstallSnippet } from '../shared-snippets-monitoring'
import { verifyTraces } from '../shared-snippets-tracing'
import {
	jsGetSnippet,
	manualError,
	verifyError,
} from './shared-snippets-monitoring'

export const JSSvelteKitReorganizedContent: QuickStartContent = {
	title: 'SvelteKit',
	subtitle: 'Learn how to set up highlight.io on the backend in SvelteKit.',
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
				'and export `handleError` and `handle` to automatically capture server-side errors and traces.',
			code: [
				{
					text: `// src/hooks.server.ts
import { H } from '@highlight-run/node'
import type { Handle, HandleServerError } from '@sveltejs/kit'

H.init({
	projectID: '<YOUR_PROJECT_ID>',
	serviceName: 'my-sveltekit-app',
	environment: 'production',
})

export const handle: Handle = async ({ event, resolve }) => {
	// Optional: correlate incoming request headers
	const response = await resolve(event)
	return response
}

export const handleError: HandleServerError = ({ error, event }) => {
	const headers = Object.fromEntries(event.request.headers)
	const parsed = H.parseHeaders(headers)
	H.consumeError(error as Error, parsed?.secureSessionId, parsed?.requestId)
}`,
					language: 'ts',
				},
			],
		},
		manualError,
		verifyError(
			'SvelteKit',
			`// src/routes/+page.server.ts
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	console.log('Testing Highlight logging in SvelteKit server load')
	// Uncaught errors in load functions are passed directly to handleError in hooks.server.ts
	throw new Error('Test server error for Highlight.io')
}`,
		),
		verifyLogs,
		verifyTraces,
	],
}
