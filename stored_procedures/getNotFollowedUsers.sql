CREATE PROCEDURE `getNotFollowedUsers`(
	IN userId int,
    IN perPage int,
    IN pageOffset int
    )
BEGIN
SELECT
	users.id,
    users.username,
    users.first_name,
    users.last_name,
    users.avatar_url,
    Sum(IF(users.id = friend_following.following_id, 1, 0)) As mutual
FROM users
INNER JOIN (
	followers me_following INNER JOIN followers friend_following
    ON me_following.following_id = friend_following.user_id
) ON me_following.user_id = userId AND users.id <> userId
WHERE friend_following.deleted IS NULL
AND me_following.deleted IS NULL
GROUP BY users.id
HAVING
  Sum(IF(users.id = me_following.following_id, 1, 0))=0
ORDER BY mutual DESC ,users.created DESC
LIMIT perPage
OFFSET pageOffset;
END