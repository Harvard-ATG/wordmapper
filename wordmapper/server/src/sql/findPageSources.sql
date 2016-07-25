SELECT
   ps.id        AS page_source_id
  ,ps.page_id   AS page_id
  ,ps.source_id AS source_id
  ,p.url        AS url
  ,s.hash       AS hash
FROM page_source ps
JOIN page p ON (ps.page_id = p.id)
JOIN source s ON (ps.source_id = s.id)
WHERE p.url = ${url}