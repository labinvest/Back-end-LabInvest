/*
  Warnings:

  - You are about to drop the column `pago` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `perfilId` on the `Postagem` table. All the data in the column will be lost.
  - You are about to drop the `Pagamento` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `voluntarioId` to the `Postagem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusSolicitacaoVoluntario" AS ENUM ('PENDENTE', 'APROVADA', 'REJEITADA');

-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_agendamentoId_fkey";

-- DropForeignKey
ALTER TABLE "Postagem" DROP CONSTRAINT "Postagem_perfilId_fkey";

-- AlterTable
ALTER TABLE "Agendamento" DROP COLUMN "pago";

-- AlterTable
ALTER TABLE "AuditoriaLog" ADD COLUMN     "dados" JSONB;

-- AlterTable
ALTER TABLE "Postagem" DROP COLUMN "perfilId",
ADD COLUMN     "voluntarioId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Pagamento";

-- DropEnum
DROP TYPE "StatusPagamento";

-- CreateTable
CREATE TABLE "SolicitacaoVoluntario" (
    "id" SERIAL NOT NULL,
    "perfilId" INTEGER NOT NULL,
    "categoriaId" INTEGER,
    "formacao" TEXT,
    "bio" TEXT,
    "experiencia" INTEGER,
    "documentos" JSONB,
    "status" "StatusSolicitacaoVoluntario" NOT NULL DEFAULT 'PENDENTE',
    "observacaoAdmin" TEXT,
    "aprovadoEm" TIMESTAMP(3),
    "aprovadoPorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolicitacaoVoluntario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SolicitacaoVoluntario_perfilId_key" ON "SolicitacaoVoluntario"("perfilId");

-- CreateIndex
CREATE INDEX "SolicitacaoVoluntario_status_idx" ON "SolicitacaoVoluntario"("status");

-- CreateIndex
CREATE INDEX "SolicitacaoVoluntario_categoriaId_idx" ON "SolicitacaoVoluntario"("categoriaId");

-- CreateIndex
CREATE INDEX "AuditoriaLog_perfilId_idx" ON "AuditoriaLog"("perfilId");

-- CreateIndex
CREATE INDEX "Notificacao_perfilId_idx" ON "Notificacao"("perfilId");

-- CreateIndex
CREATE INDEX "Postagem_voluntarioId_idx" ON "Postagem"("voluntarioId");

-- AddForeignKey
ALTER TABLE "SolicitacaoVoluntario" ADD CONSTRAINT "SolicitacaoVoluntario_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitacaoVoluntario" ADD CONSTRAINT "SolicitacaoVoluntario_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postagem" ADD CONSTRAINT "Postagem_voluntarioId_fkey" FOREIGN KEY ("voluntarioId") REFERENCES "Voluntario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
