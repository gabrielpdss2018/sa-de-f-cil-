-- AlterTable
ALTER TABLE "User" 
ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "cep" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "neighborhood" TEXT,
ADD COLUMN "number" TEXT,
ADD COLUMN "state" TEXT,
ADD COLUMN "street" TEXT,
DROP COLUMN "address";

-- AlterTable
ALTER TABLE "Institution" 
ADD COLUMN "cep" TEXT NOT NULL,
ADD COLUMN "city" TEXT NOT NULL,
ADD COLUMN "cnpj" TEXT NOT NULL,
ADD COLUMN "neighborhood" TEXT NOT NULL,
ADD COLUMN "number" TEXT NOT NULL,
ADD COLUMN "state" TEXT NOT NULL,
ADD COLUMN "street" TEXT NOT NULL,
DROP COLUMN "address";

-- CreateIndex
CREATE UNIQUE INDEX "Institution_cnpj_key" ON "Institution"("cnpj");
