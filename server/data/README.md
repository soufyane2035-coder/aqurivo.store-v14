# Runtime data directory

This directory is reserved for the application's local Firestore-compatible data mirror.

The mirror file `aqurivostor-data.json` is generated and updated by the application at runtime. It may contain account profiles, administrator records, contact messages, issue reports, and analytics. It is intentionally excluded from Git.

Do not commit production data, user records, backups, or runtime snapshots. Use the configured Firebase or Turso database for persistent data and keep secrets in environment variables.
