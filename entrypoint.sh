#!/bin/sh
set -e

# Only run migrations if SKIP_MIGRATIONS is not set to true
if [ "$SKIP_MIGRATIONS" != "true" ]; then
  echo "Running migrations..."
  node ace migration:run --force
  echo "Migrations completed"
else
  echo "Skipping migrations (SKIP_MIGRATIONS=true)"
fi

# Execute the command passed to the container (or default server start)
exec dumb-init "$@"