SELECT
  a.id AS alignment_id
  ,a.user_id AS user_id
  ,a.comment AS comment
  ,w.word_index AS word_index
  ,w.word_value AS word_value
  ,w.source_hash AS source_hash
FROM alignments a
JOIN word w ON w.alignment_id = a.id
