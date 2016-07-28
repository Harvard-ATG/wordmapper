SELECT
   ps.id        AS page_source_id
  ,ps.created   AS page_source_created
  ,ps.version   AS page_source_version
  ,ps.page_id   AS page_id
  ,ps.source_id AS source_id
  ,s.hash       AS source_hash
  ,p.url        AS page_url
FROM page_source ps
JOIN page p ON (ps.page_id = p.id)
JOIN source s ON (ps.source_id = s.id)
WHERE p.url = ${url}
ORDER BY ps.version ASC, ps.source_id ASC