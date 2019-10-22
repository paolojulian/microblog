DROP PROCEDURE IF EXISTS fetchPostsToDisplay;
DELIMITER ;;
CREATE PROCEDURE fetchPostsToDisplay(
	IN userId int,
    IN perPage int,
    IN pageOffset int
)
BEGIN
	SELECT post.*, creator.username as creator, shared.username as shared_by_username FROM
    (
		SELECT posts.*, null as shared_by
		FROM posts
		WHERE user_id IN (
			SELECT following_id
            FROM followers
            WHERE user_id = userId
		)
        OR user_id = userId
		AND retweet_from IS NULL
		UNION
		SELECT
			b.id,
			a.title,
			a.body,
			b.retweet_from,
			a.user_id,
			b.created,
			b.modified,
			b.user_id as shared_by
		FROM posts a
		LEFT JOIN posts b ON b.retweet_from = a.id
		WHERE b.user_id IN (
			SELECT following_id
            FROM followers
            WHERE user_id = userId
		)
        OR b.user_id = userId
        LIMIT perPage
        OFFSET pageOffset
	) post
    LEFT JOIN users creator
    ON creator.id = post.user_id
    LEFT JOIN users shared
    ON shared.id = post.shared_by
;
END ;;
DELIMITER ;



