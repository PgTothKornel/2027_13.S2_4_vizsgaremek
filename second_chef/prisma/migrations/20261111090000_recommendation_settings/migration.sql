-- Additive only: existing accounts, pantry contents and recipes are retained.
ALTER TABLE "fiok" ADD COLUMN "makrocelok" JSON;
ALTER TABLE "huto" ADD COLUMN "mennyiseg" DOUBLE PRECISION,
                   ADD COLUMN "egyseg" VARCHAR(32),
                   ADD COLUMN "kategoria" VARCHAR(64);
