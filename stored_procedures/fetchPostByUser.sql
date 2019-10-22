DROP PROCEDURE IF EXISTS fetchPostByUser;
DELIMITER ;;
CREATE PROCEDURE fetchPostByUser(IN userId int)
BEGIN
	SELECT p.id, title, body, retweet_from, user_id, p.created, p.modified, u.username
    FROM posts p
	LEFT JOIN users u
    ON u.id = p.user_id
    WHERE user_id = userId;
END ;;
DELIMITER ;
