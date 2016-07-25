DELETE FROM alignment a
WHERE a.user_id = ${userId}
AND EXISTS (
  SELECT 1 FROM word w
  JOIN source s ON (w.source_id = s.id)
  WHERE w.alignment_id = a.id
  AND s.hash in (${sources:csv})
)