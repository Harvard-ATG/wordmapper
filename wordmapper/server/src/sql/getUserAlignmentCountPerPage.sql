select
p.id,
p.url,
count(distinct a.id) as alignment_count
from page p
join page_source ps on (p.id = ps.page_id)
join source s on (s.id = ps.source_id)
join word w on (w.source_id = s.id)
join alignment a on (w.alignment_id = a.id)
where a.user_id = 1
group by p.id, p.url
