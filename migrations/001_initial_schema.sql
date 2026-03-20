-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_partman;

-- Enum types
CREATE TYPE connector_status AS ENUM ('draft', 'active', 'inactive', 'error');
CREATE TYPE marketplace_listing_status AS ENUM ('pending', 'approved', 'rejected', 'unlisted');
CREATE TYPE stream_status AS ENUM ('active', 'paused', 'closed');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE ai_job_status AS ENUM ('queued', 'running', 'completed', 'failed', 'cancelled');
CREATE TYPE finding_severity AS ENUM ('info', 'low', 'medium', 'high', 'critical');
CREATE TYPE audit_action AS ENUM ('create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'share');
CREATE TYPE connector_file_type AS ENUM ('schema', 'handler', 'config', 'test', 'doc', 'other');

-- users
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  display_name    TEXT,
  avatar_url      TEXT,
  password_hash   TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  is_superadmin   BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);

-- organizations
CREATE TABLE organizations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  logo_url        TEXT,
  plan            TEXT NOT NULL DEFAULT 'free',
  owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  settings        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_organizations_owner_id ON organizations (owner_id);
CREATE INDEX idx_organizations_slug ON organizations (slug);

-- org membership junction
CREATE TABLE org_members (
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role            TEXT NOT NULL DEFAULT 'member',
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (org_id, user_id)
);

CREATE INDEX idx_org_members_user_id ON org_members (user_id);

-- connectors
CREATE TABLE connectors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL,
  description     TEXT,
  status          connector_status NOT NULL DEFAULT 'active',
  version         TEXT NOT NULL DEFAULT '1.0.0',
  config_schema   JSONB NOT NULL DEFAULT '{}',
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_by      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (org_id, slug)
);

CREATE INDEX idx_connectors_org_id ON connectors (org_id);
CREATE INDEX idx_connectors_status ON connectors (status);
CREATE INDEX idx_connectors_org_id_status ON connectors (org_id, status);

-- connector_drafts
CREATE TABLE connector_drafts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id    UUID REFERENCES connectors(id) ON DELETE CASCADE,
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  config_schema   JSONB NOT NULL DEFAULT '{}',
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_by      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_connector_drafts_org_id ON connector_drafts (org_id);
CREATE INDEX idx_connector_drafts_connector_id ON connector_drafts (connector_id);

-- connector_files
CREATE TABLE connector_files (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id    UUID NOT NULL REFERENCES connectors(id) ON DELETE CASCADE,
  draft_id        UUID REFERENCES connector_drafts(id) ON DELETE SET NULL,
  file_type       connector_file_type NOT NULL DEFAULT 'other',
  filename        TEXT NOT NULL,
  content         TEXT NOT NULL,
  content_hash    TEXT GENERATED ALWAYS AS (encode(digest(content, 'sha256'), 'hex')) STORED,
  size_bytes      INTEGER,
  created_by      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_connector_files_connector_id ON connector_files (connector_id);
CREATE INDEX idx_connector_files_draft_id ON connector_files (draft_id);

-- marketplace_listings
CREATE TABLE marketplace_listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id    UUID NOT NULL REFERENCES connectors(id) ON DELETE CASCADE,
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  status          marketplace_listing_status NOT NULL DEFAULT 'pending',
  title           TEXT NOT NULL,
  description     TEXT,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  price_cents     INTEGER NOT NULL DEFAULT 0,
  install_count   INTEGER NOT NULL DEFAULT 0,
  rating_avg      NUMERIC(3,2),
  rating_count    INTEGER NOT NULL DEFAULT 0,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_listings_org_id ON marketplace_listings (org_id);
CREATE INDEX idx_marketplace_listings_status ON marketplace_listings (status);
CREATE INDEX idx_marketplace_listings_connector_id ON marketplace_listings (connector_id);
CREATE INDEX idx_marketplace_listings_tags ON marketplace_listings USING GIN (tags);

-- streams
CREATE TABLE streams (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  connector_id    UUID NOT NULL REFERENCES connectors(id) ON DELETE RESTRICT,
  name            TEXT NOT NULL,
  description     TEXT,
  status          stream_status NOT NULL DEFAULT 'active',
  config          JSONB NOT NULL DEFAULT '{}',
  seq_counter     BIGINT NOT NULL DEFAULT 0,
  retention_days  INTEGER NOT NULL DEFAULT 30,
  created_by      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_streams_org_id ON streams (org_id);
CREATE INDEX idx_streams_connector_id ON streams (connector_id);
CREATE INDEX idx_streams_org_id_status ON streams (org_id, status);

-- stream_tokens
CREATE TABLE stream_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id       UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  token_hash      TEXT NOT NULL UNIQUE,
  scopes          TEXT[] NOT NULL DEFAULT '{read}',
  expires_at      TIMESTAMPTZ,
  last_used_at    TIMESTAMPTZ,
  created_by      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at      TIMESTAMPTZ
);

CREATE INDEX idx_stream_tokens_stream_id ON stream_tokens (stream_id);
CREATE INDEX idx_stream_tokens_org_id ON stream_tokens (org_id);
CREATE INDEX idx_stream_tokens_token_hash ON stream_tokens (token_hash);

-- stream_events (partitioned by day on received_at)
CREATE TABLE stream_events (
  id              UUID NOT NULL DEFAULT gen_random_uuid(),
  stream_id       UUID NOT NULL,
  org_id          UUID NOT NULL,
  seq             BIGINT NOT NULL,
  event_type      TEXT,
  payload         JSONB NOT NULL DEFAULT '{}',
  source_ip       INET,
  received_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, received_at)
) PARTITION BY RANGE (received_at);

CREATE INDEX idx_stream_events_stream_id_received_at ON stream_events (stream_id, received_at DESC);
CREATE INDEX idx_stream_events_stream_id_seq ON stream_events (stream_id, seq);
CREATE INDEX idx_stream_events_org_id ON stream_events (org_id);
CREATE INDEX idx_stream_events_event_type ON stream_events (event_type);

-- tickets
CREATE TABLE tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  status          ticket_status NOT NULL DEFAULT 'open',
  priority        ticket_priority NOT NULL DEFAULT 'medium',
  assignee_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  reporter_id     UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  metadata        JSONB NOT NULL DEFAULT '{}',
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tickets_org_id ON tickets (org_id);
CREATE INDEX idx_tickets_org_id_status ON tickets (org_id, status);
CREATE INDEX idx_tickets_assignee_id ON tickets (assignee_id);
CREATE INDEX idx_tickets_reporter_id ON tickets (reporter_id);
CREATE INDEX idx_tickets_priority ON tickets (priority);

-- ticket_comments
CREATE TABLE ticket_comments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id       UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  author_id       UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  body            TEXT NOT NULL,
  is_internal     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ticket_comments_ticket_id ON ticket_comments (ticket_id);
CREATE INDEX idx_ticket_comments_org_id ON ticket_comments (org_id);
CREATE INDEX idx_ticket_comments_author_id ON ticket_comments (author_id);

-- ai_jobs
CREATE TABLE ai_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  initiated_by    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  job_type        TEXT NOT NULL,
  status          ai_job_status NOT NULL DEFAULT 'queued',
  input           JSONB NOT NULL DEFAULT '{}',
  output          JSONB,
  error_message   TEXT,
  model           TEXT,
  tokens_used     INTEGER,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_jobs_org_id ON ai_jobs (org_id);
CREATE INDEX idx_ai_jobs_org_id_status ON ai_jobs (org_id, status);
CREATE INDEX idx_ai_jobs_initiated_by ON ai_jobs (initiated_by);
CREATE INDEX idx_ai_jobs_job_type ON ai_jobs (job_type);

-- findings
CREATE TABLE findings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  stream_id       UUID REFERENCES streams(id) ON DELETE SET NULL,
  ai_job_id       UUID REFERENCES ai_jobs(id) ON DELETE SET NULL,
  ticket_id       UUID REFERENCES tickets(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  severity        finding_severity NOT NULL DEFAULT 'info',
  fingerprint     TEXT,
  is_resolved     BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at     TIMESTAMPTZ,
  resolved_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  details         JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_findings_org_id ON findings (org_id);
CREATE INDEX idx_findings_org_id_severity ON findings (org_id, severity);
CREATE INDEX idx_findings_stream_id ON findings (stream_id);
CREATE INDEX idx_findings_ai_job_id ON findings (ai_job_id);
CREATE INDEX idx_findings_ticket_id ON findings (ticket_id);
CREATE INDEX idx_findings_fingerprint ON findings (fingerprint);
CREATE INDEX idx_findings_is_resolved ON findings (is_resolved);

-- memory_nodes
CREATE TABLE memory_nodes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  node_type       TEXT NOT NULL,
  label           TEXT NOT NULL,
  properties      JSONB NOT NULL DEFAULT '{}',
  embedding       VECTOR(1536),
  source_type     TEXT,
  source_id       UUID,
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memory_nodes_org_id ON memory_nodes (org_id);
CREATE INDEX idx_memory_nodes_org_id_node_type ON memory_nodes (org_id, node_type);
CREATE INDEX idx_memory_nodes_source ON memory_nodes (source_type, source_id);

-- memory_edges
CREATE TABLE memory_edges (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  from_node_id    UUID NOT NULL REFERENCES memory_nodes(id) ON DELETE CASCADE,
  to_node_id      UUID NOT NULL REFERENCES memory_nodes(id) ON DELETE CASCADE,
  relation_type   TEXT NOT NULL,
  weight          NUMERIC(5,4) NOT NULL DEFAULT 1.0,
  properties      JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memory_edges_org_id ON memory_edges (org_id);
CREATE INDEX idx_memory_edges_from_node_id ON memory_edges (from_node_id);
CREATE INDEX idx_memory_edges_to_node_id ON memory_edges (to_node_id);
CREATE INDEX idx_memory_edges_from_node_relation ON memory_edges (from_node_id, relation_type);

-- audit_events
CREATE TABLE audit_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID REFERENCES organizations(id) ON DELETE SET NULL,
  actor_id        UUID REFERENCES users(id) ON DELETE SET NULL,
  action          audit_action NOT NULL,
  resource_type   TEXT NOT NULL,
  resource_id     TEXT,
  old_value       JSONB,
  new_value       JSONB,
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_events_org_id ON audit_events (org_id);
CREATE INDEX idx_audit_events_actor_id ON audit_events (actor_id);
CREATE INDEX idx_audit_events_org_id_created_at ON audit_events (org_id, created_at DESC);
CREATE INDEX idx_audit_events_resource ON audit_events (resource_type, resource_id);
CREATE INDEX idx_audit_events_action ON audit_events (action);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users','organizations','connectors','connector_drafts',
    'connector_files','marketplace_listings','streams','stream_tokens',
    'tickets','ticket_comments','ai_jobs','findings',
    'memory_nodes','memory_edges'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%I_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      t, t
    );
  END LOOP;
END;
$$;

-- Configure pg_partman to manage stream_events partitions by day
SELECT partman.create_parent(
  p_parent_table  => 'public.stream_events',
  p_control       => 'received_at',
  p_type          => 'range',
  p_interval      => '1 day',
  p_premake       => 7,
  p_start_partition => to_char(NOW(), 'YYYY-MM-DD')
);

-- Retention: auto drop partitions older than retention_days (default 30 days)
UPDATE partman.part_config
SET
  retention            = '30 days',
  retention_keep_table = FALSE,
  infinite_time_partitions = TRUE,
  automatic_maintenance = 'on'
WHERE parent_table = 'public.stream_events';
