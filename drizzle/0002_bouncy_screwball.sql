ALTER TABLE `orders` ADD `customerFirstName` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `customerLastName` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `shippingStreet` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `shippingCity` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `shippingState` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `shippingZipCode` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `customerName`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `shippingAddress`;