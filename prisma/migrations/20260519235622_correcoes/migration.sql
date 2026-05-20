/*
  Warnings:

  - You are about to drop the column `data` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Postagem` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Especialista` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clientePerfilId` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataInicio` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voluntarioPerfilId` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perfilId` to the `Postagem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENTE', 'VOLUNTARIO');

-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('AGENDADO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'PAGO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusDocumento" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO');

-- CreateEnum
CREATE TYPE "TipoNotificacao" AS ENUM ('AGENDAMENTO', 'PAGAMENTO', 'CHAT', 'AVALIACAO', 'SISTEMA');

-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_userId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropForeignKey
ALTER TABLE "Postagem" DROP CONSTRAINT "Postagem_userId_fkey";

-- AlterTable
ALTER TABLE "Agendamento" DROP COLUMN "data",
DROP COLUMN "userId",
ADD COLUMN     "clientePerfilId" INTEGER NOT NULL,
ADD COLUMN     "dataFim" TIMESTAMP(3),
ADD COLUMN     "dataInicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "local" TEXT,
ADD COLUMN     "notas" TEXT,
ADD COLUMN     "pago" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "servicoId" INTEGER,
ADD COLUMN     "status" "StatusAgendamento" NOT NULL DEFAULT 'AGENDADO',
ADD COLUMN     "titulo" TEXT,
ADD COLUMN     "voluntarioPerfilId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Postagem" DROP COLUMN "userId",
ADD COLUMN     "perfilId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Servico" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "duracao" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "endereco",
DROP COLUMN "nome",
DROP COLUMN "telefone",
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENTE';

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "Especialista";

-- CreateTable
CREATE TABLE "Perfil" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT,
    "cpf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voluntario" (
    "id" SERIAL NOT NULL,
    "perfilId" INTEGER NOT NULL,
    "categoriaId" INTEGER,
    "formacao" TEXT,
    "bio" TEXT,
    "experiencia" INTEGER,
    "avaliacaoMedia" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voluntario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disponibilidade" (
    "id" SERIAL NOT NULL,
    "voluntarioId" INTEGER NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "intervaloMinutos" INTEGER NOT NULL DEFAULT 30,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disponibilidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" SERIAL NOT NULL,
    "perfilId" INTEGER NOT NULL,
    "voluntarioId" INTEGER,
    "agendamentoId" INTEGER,
    "classificacao" INTEGER NOT NULL,
    "comentario" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "id" SERIAL NOT NULL,
    "agendamentoId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "metodo" TEXT NOT NULL,
    "status" "StatusPagamento" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacao" (
    "id" SERIAL NOT NULL,
    "perfilId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "tipo" "TipoNotificacao" NOT NULL,
    "lido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditoriaLog" (
    "id" SERIAL NOT NULL,
    "perfilId" INTEGER,
    "acao" TEXT NOT NULL,
    "tabela" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditoriaLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" SERIAL NOT NULL,
    "voluntarioId" INTEGER NOT NULL,
    "tipoDocumentoId" INTEGER NOT NULL,
    "caminhoArquivo" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "statusValidacao" "StatusDocumento" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoDocumento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "obrigatorio" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoDocumento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoluntarioServico" (
    "id" SERIAL NOT NULL,
    "voluntarioId" INTEGER NOT NULL,
    "servicoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoluntarioServico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendamentoServico" (
    "id" SERIAL NOT NULL,
    "agendamentoId" INTEGER NOT NULL,
    "servicoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgendamentoServico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_userId_key" ON "Perfil"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_cpf_key" ON "Perfil"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Voluntario_perfilId_key" ON "Voluntario"("perfilId");

-- CreateIndex
CREATE INDEX "Voluntario_categoriaId_idx" ON "Voluntario"("categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Disponibilidade_voluntarioId_diaSemana_key" ON "Disponibilidade"("voluntarioId", "diaSemana");

-- CreateIndex
CREATE INDEX "Avaliacao_voluntarioId_idx" ON "Avaliacao"("voluntarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_perfilId_agendamentoId_key" ON "Avaliacao"("perfilId", "agendamentoId");

-- CreateIndex
CREATE UNIQUE INDEX "Pagamento_agendamentoId_key" ON "Pagamento"("agendamentoId");

-- CreateIndex
CREATE UNIQUE INDEX "TipoDocumento_nome_key" ON "TipoDocumento"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "VoluntarioServico_voluntarioId_servicoId_key" ON "VoluntarioServico"("voluntarioId", "servicoId");

-- CreateIndex
CREATE UNIQUE INDEX "AgendamentoServico_agendamentoId_servicoId_key" ON "AgendamentoServico"("agendamentoId", "servicoId");

-- CreateIndex
CREATE INDEX "Agendamento_clientePerfilId_idx" ON "Agendamento"("clientePerfilId");

-- CreateIndex
CREATE INDEX "Agendamento_voluntarioPerfilId_idx" ON "Agendamento"("voluntarioPerfilId");

-- CreateIndex
CREATE INDEX "Agendamento_servicoId_idx" ON "Agendamento"("servicoId");

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voluntario" ADD CONSTRAINT "Voluntario_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voluntario" ADD CONSTRAINT "Voluntario_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disponibilidade" ADD CONSTRAINT "Disponibilidade_voluntarioId_fkey" FOREIGN KEY ("voluntarioId") REFERENCES "Voluntario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_clientePerfilId_fkey" FOREIGN KEY ("clientePerfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_voluntarioPerfilId_fkey" FOREIGN KEY ("voluntarioPerfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_voluntarioId_fkey" FOREIGN KEY ("voluntarioId") REFERENCES "Voluntario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "Agendamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postagem" ADD CONSTRAINT "Postagem_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaLog" ADD CONSTRAINT "AuditoriaLog_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_voluntarioId_fkey" FOREIGN KEY ("voluntarioId") REFERENCES "Voluntario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "TipoDocumento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoluntarioServico" ADD CONSTRAINT "VoluntarioServico_voluntarioId_fkey" FOREIGN KEY ("voluntarioId") REFERENCES "Voluntario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoluntarioServico" ADD CONSTRAINT "VoluntarioServico_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendamentoServico" ADD CONSTRAINT "AgendamentoServico_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "Agendamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendamentoServico" ADD CONSTRAINT "AgendamentoServico_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE CASCADE ON UPDATE CASCADE;
