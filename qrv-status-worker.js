// Public read endpoint for the QRV status page.
// Editing now lives in the qrv-admin panel (admin.getqrv.com), which writes this
// KV namespace via the Cloudflare API. The old Basic-auth /admin page + ADMIN_PASSWORD
// secret were retired once the panel became the canonical editor.

const DEFAULT_STATUS = {
  status_code: 'operational',
  status_message: 'All systems operating normally.',
  last_updated: new Date().toISOString(),
  components: [
    { name: 'Live Spots', status: 'operational', detail: 'All systems operating normally.' }
  ],
  developer_message: null
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/status.json') {
      return handleStatusGet(env);
    }

    return new Response('Not Found', { status: 404 });
  }
};

async function handleStatusGet(env) {
  const status = await env.STATUS_KV.get('current', 'json') || DEFAULT_STATUS;

  return new Response(JSON.stringify(status, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}
