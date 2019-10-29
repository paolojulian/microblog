DELIMITER //
CREATE PROCEDURE fetchPostsToDisplay(
	IN userId int,
    IN perPage int,
    IN pageOffset int
)
BEGIN
SELECT * FROM (
SELECT
	a.*,
	users.username,
    null as shared_by,
    null as shared_by_username
FROM posts a
LEFT JOIN users
ON users.id = a.user_id
WHERE user_id IN (
	SELECT following_id FROM followers
    WHERE user_id = userId
    AND followers.deleted IS NULL
)
AND retweet_post_id IS NULL
AND a.deleted IS NULL

UNION

SELECT
	b.id,
	orig.title,
    orig.body,
    b.retweet_post_id,
    orig.user_id,
    b.created,
    b.modified,
    b.deleted,
    b.likes_count,
    users.username,
    b.user_id as shared_by,
    shared_user.username as shared_by_username
FROM posts b
INNER JOIN posts orig
ON b.retweet_post_id = orig.id
LEFT JOIN users
ON users.id = orig.user_id
LEFT JOIN users shared_user
ON shared_user.id = b.user_id
WHERE b.user_id IN (
	SELECT following_id FROM followers
    WHERE user_id = userId
    AND followers.deleted IS NULL
)
AND b.retweet_post_id IS NOT NULL
and orig.deleted IS NULL
) Post
ORDER BY created DESC
LIMIT perPage
OFFSET pageOffset;
END
DELIMITER ;