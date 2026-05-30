# qrv-status

Cloudflare Worker that serves the **public status page** data for QRV at
`status.getqrv.com`. The apps and website poll it to show whether the live-spots backend
and other components are operational.

## How it works

- `GET /status.json` returns the current status document from the `STATUS_KV` namespace
  (falling back to a hardcoded "operational" default if the key is unset). Any other path
  returns 404.
- The document has a top-level `status_code` / `status_message`, a per-`components` list,
  and an optional `developer_message`.
- The response is sent with `Cache-Control: no-cache` and permissive CORS so clients always
  see the latest state.

## Editing the status

**The [qrv-admin](https://github.com/QRV-App/qrv-admin) panel (`admin.getqrv.com`) is the
canonical editor.** It writes the `STATUS_KV` namespace directly via the Cloudflare API.
The old Basic-auth `/admin` page (and its `ADMIN_PASSWORD` secret) have been retired — this
Worker is now read-only.

## Files

| File | Purpose |
|---|---|
| `qrv-status-worker.js` | The Worker (read endpoint + default doc) |
| `wrangler.toml` | Worker config + `STATUS_KV` namespace binding |
| `CNAME` | `status.getqrv.com` |
| `status.json` | Sample/seed status document |

## Deploy

```bash
wrangler deploy
```
