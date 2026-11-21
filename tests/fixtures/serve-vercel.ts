import axios from 'axios';
import { createServer } from 'node:http';

let outboundAttempts = 0;
axios.post = (async () => { outboundAttempts++; throw new Error('External axios is forbidden in preview regression tests'); }) as typeof axios.post;
globalThis.fetch = (async () => { outboundAttempts++; throw new Error('External fetch is forbidden in preview regression tests'); }) as typeof fetch;

const { default: app } = await import('../../server.ts');
// An asset-shaped path bypasses the HTML catch-all and exposes only this inert test counter.
app.get('/__test/outbound.json', (_req, res) => res.json({ outboundAttempts }));
const server = createServer(app);
server.listen(Number(process.env.PORT), '127.0.0.1');
process.on('SIGTERM', () => { server.close(); server.closeAllConnections(); });
