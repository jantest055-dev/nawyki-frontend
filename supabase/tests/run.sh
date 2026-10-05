#!/bin/sh
# Uruchamia migracje + testy bezpieczeństwa na CZYSTEJ bazie testowej.
# Wymaga lokalnego PostgreSQL (15+) z pgcrypto. NIE uruchamiaj na produkcji —
# skrypt usuwa i tworzy bazę $TEST_DB.
#   PGHOST=localhost PGPORT=5432 PGUSER=postgres ./supabase/tests/run.sh
set -e
cd "$(dirname "$0")/../.."
TEST_DB="${TEST_DB:-nawyki_test}"
P="psql -v ON_ERROR_STOP=1 -q -t"
$P -d postgres -c "drop database if exists $TEST_DB" -c "create database $TEST_DB" >/dev/null
$P -d "$TEST_DB" -f supabase/tests/supabase_stub.sql >/dev/null
for f in supabase/migrations/*.sql; do $P -d "$TEST_DB" -f "$f"; done
$P -d "$TEST_DB" -f supabase/tests/rls_test.sql 2>&1 | grep -vE '^\s*$' | sed 's/^psql:[^ ]* //'
