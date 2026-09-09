-- Keep every original line as text. HTML-looking text and JSON-looking text remain literal.
BEGIN;
ALTER TABLE "Note" ALTER COLUMN "content" DROP DEFAULT;
CREATE FUNCTION pg_temp.flownote_document(value TEXT) RETURNS JSONB
LANGUAGE SQL IMMUTABLE AS $$
  SELECT jsonb_build_object('type', 'doc', 'content',
    jsonb_agg(CASE WHEN line = '' THEN jsonb_build_object('type', 'paragraph')
      ELSE jsonb_build_object('type', 'paragraph', 'content',
        jsonb_build_array(jsonb_build_object('type', 'text', 'text', line))) END ORDER BY position))
  FROM unnest(regexp_split_to_array(value, E'\r\n|\r|\n')) WITH ORDINALITY AS lines(line, position);
$$;
ALTER TABLE "Note" ALTER COLUMN "content" TYPE JSONB USING pg_temp.flownote_document("content");
ALTER TABLE "Note" ALTER COLUMN "content" SET DEFAULT '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb;
COMMIT;
