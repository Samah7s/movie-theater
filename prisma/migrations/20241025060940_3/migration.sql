/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `seats` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[row]` on the table `seats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `seats_number_key` ON `seats`(`number`);

-- CreateIndex
CREATE UNIQUE INDEX `seats_row_key` ON `seats`(`row`);
