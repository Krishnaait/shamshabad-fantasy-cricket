ALTER TABLE `contests` MODIFY COLUMN `matchId` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `leaderboards` MODIFY COLUMN `contestId` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `leaderboards` MODIFY COLUMN `contestId` int;--> statement-breakpoint
ALTER TABLE `user_teams` MODIFY COLUMN `contestId` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `user_teams` MODIFY COLUMN `contestId` int;--> statement-breakpoint
ALTER TABLE `user_teams` MODIFY COLUMN `matchId` varchar(255) NOT NULL;