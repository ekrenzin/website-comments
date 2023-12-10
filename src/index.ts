export interface Env {
	DB: D1Database;
	EAN_API_KEY: string;
}

export default {
	/**
	 * Handles the fetch event
	 * @param {Request} request - The incoming request
	 * @param {Env} env - The environment containing the database connection
	 * @returns {Promise<Response>} A response with the query results
	 */
	async fetch(request: Request, env: Env) {
		const body = JSON.parse(await request.text());
		//if the headers is missing the api key (EAN_API_KEY) then return 401
		const EAN_API_KEY = env.EAN_API_KEY;
		if (request.headers.get('x-api-key') !== EAN_API_KEY) {
			return new Response('Unauthorized', { status: 401 });
		}
		
		const { method } = body;
		if (!method) {
			// Handle the case where 'source' parameter is missing
			return new Response('method parameter is required', { status: 400 });
		}	
		if (method === 'list') {
			return handleFetchComments(body, env);
		} else if (method === 'upload') {
			return handleUploadComment(body, env);
		}
	},
};

async function handleFetchComments(body: any, env: Env) {
	const { source } = body;

	if (!source) {
		// Handle the case where 'source' parameter is missing
		return new Response('source parameter is required', { status: 400 });
	}

	try {
		// Prepare and execute the SQL query
		const stmt = await env.DB.prepare("SELECT * FROM Comments WHERE SourceID = ?");
		const results = await stmt.bind(source).all();

		// Return the results in JSON format
		return new Response(JSON.stringify(results), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		// Handle any errors that occur during the database query
		return new Response(`Database error: ${error.message}`, { status: 500 });
	}
}

async function handleUploadComment(body: any, env: Env) {
	const { source, comment, user } = body;

	if (!source || !comment || !user) {
		// Handle the case where 'source' parameter is missing
		return new Response('source user and comment parameters are required', { status: 400 });
	}
	
	try {
		// Prepare and execute the SQL query
		const stmt = await env.DB.prepare("INSERT INTO Comments (SourceID, CommentText, User) VALUES (?, ?, ?)");
		const results = await stmt.bind(source, comment, user).run();

		// Return the results in JSON format
		return new Response(JSON.stringify(results), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		// Handle any errors that occur during the database query
		return new Response(`Database error: ${error.message}`, { status: 500 });
	}
}