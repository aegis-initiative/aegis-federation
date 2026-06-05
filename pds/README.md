# AEGIS Governance Federation — Personal Data Server (PDS)

The Personal Data Server is the AT Protocol data origin for the AEGIS Governance Federation Network. It hosts the DID
document, stores governance records, and participates in the AT Protocol relay network.

## What is a PDS?

A PDS (Personal Data Server) is the core data storage component in the AT Protocol architecture. It:

- **Hosts user repositories** — Stores signed data records (governance signals, attestations, etc.)
- **Serves the DID document** — Provides the `did:web` resolution endpoint
- **Syncs with relays** — Pushes repository updates to the AT Protocol relay network
- **Handles authentication** — Manages sessions and JWT tokens for API access

## DID Resolution

The AEGIS Federation uses `did:web` for identity resolution. The DID `did:web:aegis-federation.com` resolves to:

```
https://aegis-federation.com/.well-known/did.json
```

This DID document declares the PDS service endpoint and the feed generator service, allowing other AT Protocol
participants to discover and interact with AEGIS governance data.

## Deployment

### Prerequisites

- A server with Docker support
- Domain `aegis-federation.com` with DNS configured
- TLS certificate (Let's Encrypt recommended)
- Minimum 2GB RAM, 20GB storage

### Quick Start

1. Copy the environment template:

   ```bash
   cp config/pds.env.example config/pds.env
   ```

2. Fill in the required values in `config/pds.env`:
   - `PDS_ADMIN_PASSWORD` — Admin panel password
   - `PDS_JWT_SECRET` — Secret for JWT token signing (generate with `openssl rand -hex 32`)

3. Deploy using the official AT Protocol PDS installer:

   ```bash
   # Using the official AT Protocol PDS Docker image
   docker run -d \
     --name aegis-pds \
     --env-file config/pds.env \
     -v /data/pds:/data/pds \
     -p 3000:3000 \
     ghcr.io/bluesky-social/pds:latest
   ```

4. Configure your reverse proxy (nginx/Caddy) to route traffic to port 3000.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PDS_HOSTNAME` | Public hostname for the PDS | Yes |
| `PDS_DATA_DIRECTORY` | Path to data storage | Yes |
| `PDS_BLOBSTORE_DISK_LOCATION` | Path to blob storage | Yes |
| `PDS_DID_PLC_URL` | DID PLC directory URL | Yes |
| `PDS_INVITE_REQUIRED` | Require invite codes for new accounts | Yes |
| `PDS_ADMIN_PASSWORD` | Admin panel password | Yes |
| `PDS_JWT_SECRET` | JWT signing secret | Yes |

## Publishing Governance Records

Once the PDS is running, governance records can be published using the AT Protocol XRPC API:

```bash
# Create a governance signal record
curl -X POST https://aegis-federation.com/xrpc/com.atproto.repo.createRecord \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "did:web:aegis-federation.com",
    "collection": "com.aegisfederation.governance.signal",
    "record": {
      "type": "advisory",
      "severity": "medium",
      "summary": "New governance policy effective 2026-04-01",
      "createdAt": "2026-03-23T00:00:00Z"
    }
  }'
```

## Architecture

```
Internet
  │
  ▼
┌─────────────────┐     ┌──────────────┐
│  Reverse Proxy  │────▶│   PDS        │
│  (Caddy/nginx)  │     │  Port 3000   │
└─────────────────┘     └──────┬───────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
              ┌─────▼─────┐        ┌─────▼─────┐
              │  SQLite   │        │   Blobs   │
              │  Database │        │  Storage  │
              └───────────┘        └───────────┘
```

## Related

- [Lexicon Schemas](../lexicons/) — Record type definitions
- [Feed Generator](../feed-generator/) — Curates governance signal feeds
- [AT Protocol PDS Documentation](https://atproto.com/guides/self-hosting)
