# group-chat-be

group chat using websocket

SELECT
g.id AS private_chat_id, ug1.user_id, ug2.user_id
FROM
`group_chat`.groups AS g
JOIN `group_chat`.user_groups AS ug1 ON g.id = ug1.group_id
AND ug1.user_id = 1
JOIN `group_chat`.user_groups AS ug2 ON g.id = ug2.group_id
AND ug2.user_id = 3
WHERE
g.is_group = 0;
