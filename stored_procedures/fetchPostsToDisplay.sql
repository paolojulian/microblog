DROP PROCEDURE IF EXISTS fetchPostsToDisplay;
DELIMITER ;;
CREATE PROCEDURE fetchPostsToDisplay(IN userId int)
BEGIN
	SELECT posts.*, null as shared_by
    FROM posts
    WHERE user_id = userId
    AND retweet_from IS NULL
    UNION
    SELECT
		b.id,
        a.title,
        a.body,
		a.user_id,
        b.retweet_from,
        b.created,
        b.modified,
		b.user_id as shared_by
	FROM posts a
    LEFT JOIN posts b ON b.retweet_from = a.id
    WHERE b.user_id = userId
    ;
END ;;
DELIMITER ;

