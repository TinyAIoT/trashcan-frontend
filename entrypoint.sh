#!/bin/sh

echo "Check that we have NEXT_PUBLIC_BACKEND_URL var"
test -n "$NEXT_PUBLIC_BACKEND_URL"

find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#http://localhost:5001/#$NEXT_PUBLIC_BACKEND_URL#g"

if [ "$MIGRATE_DATABASE" = true ]
then
  echo "Running database migrations"
  npx --yes prisma migrate deploy
  npx --yes prisma db seed
else
  echo 'No Database migrations will be applied.'
  echo 'If there are missing Database migrations set environment variable MIGRATE_DATABASE to true'
fi

echo "Starting PVP App"
exec "$@"