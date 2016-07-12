DELETE FROM alignment a
WHERE a.user_id = ${userId}
AND EXISTS (
  SELECT 1 FROM word w
  WHERE w.alignment_id = a.id
  AND w.source_id in (${sources:csv})
)