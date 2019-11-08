CREATE PROCEDURE `getMutualFriends`(
	IN userId INT,
    IN friendId INT
)
BEGIN
SELECT
	`User`.id,
    `User`.username,
    `User`.first_name,
    `User`.last_name,
    `User`.avatar_url,
	(CASE WHEN friend.id IS NULL THEN '' ELSE 'Mutual' END) as mutual
FROM followers me
LEFT OUTER JOIN (SELECT * FROM followers WHERE followers.user_id = friendId) friend ON me.following_id = friend.following_id 
INNER JOIN users `User` on me.following_id = `User`.id
WHERE me.user_id = userId
AND me.deleted IS NULL
and friend.deleted IS NULL
and `User`.deleted IS NULL
GROUP BY `User`.id
HAVING mutual = 'Mutual'
ORDER BY me.created DESC, friend.created DESC
LIMIT perPage
OFFSET pageOffset;

END