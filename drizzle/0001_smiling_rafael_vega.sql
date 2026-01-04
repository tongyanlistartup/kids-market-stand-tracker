CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `customRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(200) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(50),
	`itemType` varchar(100),
	`description` text NOT NULL,
	`colors` text,
	`budget` decimal(10,2),
	`status` enum('pending','reviewing','accepted','in_progress','completed','declined') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `galleryImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200),
	`description` text,
	`imageUrl` varchar(500) NOT NULL,
	`category` varchar(100),
	`displayOrder` int DEFAULT 0,
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `galleryImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletterSubscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(200),
	`isActive` boolean NOT NULL DEFAULT true,
	`subscribedAt` timestamp NOT NULL DEFAULT (now()),
	`unsubscribedAt` timestamp,
	CONSTRAINT `newsletterSubscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletterSubscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int,
	`productName` varchar(200) NOT NULL,
	`productPrice` decimal(10,2) NOT NULL,
	`quantity` int NOT NULL,
	`subtotal` decimal(10,2) NOT NULL,
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`customerName` varchar(200) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(50),
	`shippingAddress` text,
	`totalAmount` decimal(10,2) NOT NULL,
	`status` enum('pending','paid','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`paymentIntentId` varchar(255),
	`paymentStatus` enum('pending','succeeded','failed') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`categoryId` int,
	`materials` text,
	`colors` text,
	`images` text NOT NULL,
	`stockQuantity` int NOT NULL DEFAULT 0,
	`isAvailable` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`createdBy` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(200) NOT NULL,
	`customerEmail` varchar(320),
	`rating` int NOT NULL,
	`comment` text NOT NULL,
	`productId` int,
	`orderId` int,
	`isApproved` boolean NOT NULL DEFAULT false,
	`isPublished` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `orderItems` ADD CONSTRAINT `orderItems_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orderItems` ADD CONSTRAINT `orderItems_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `testimonials` ADD CONSTRAINT `testimonials_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `testimonials` ADD CONSTRAINT `testimonials_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;