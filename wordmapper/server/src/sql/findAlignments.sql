SELECT
  a.id AS alignment_id
  ,a.user_id AS user_id
  ,a.comment AS comment
  ,w.word_index AS word_index
  ,w.word_value AS word_value
  ,s.hash AS source_hash
  ,s.id AS source_id
FROM alignment a
JOIN word w ON w.alignment_id = a.id
JOIN source s ON s.id = w.source_id