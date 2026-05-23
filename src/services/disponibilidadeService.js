const prisma = require('../lib/prisma');

class DisponibilidadeService {
  async criar(voluntarioId, dados) {
    const { diaSemana, horaInicio, horaFim, intervaloMinutos } = dados;

    if (diaSemana === undefined || !horaInicio || !horaFim) {
      throw new Error('diaSemana, horaInicio e horaFim são obrigatórios');
    }
    if (diaSemana < 0 || diaSemana > 6) {
      throw new Error('diaSemana deve ser entre 0 (domingo) e 6 (sábado)');
    }

    const voluntario = await prisma.voluntario.findUnique({ where: { id: parseInt(voluntarioId) } });
    if (!voluntario) throw new Error('Voluntário não encontrado');

    const existente = await prisma.disponibilidade.findUnique({
      where: { voluntarioId_diaSemana: { voluntarioId: parseInt(voluntarioId), diaSemana: parseInt(diaSemana) } },
    });
    if (existente) throw new Error('Já existe uma disponibilidade para este dia da semana');

    return prisma.disponibilidade.create({
      data: {
        voluntarioId: parseInt(voluntarioId),
        diaSemana: parseInt(diaSemana),
        horaInicio,
        horaFim,
        intervaloMinutos: intervaloMinutos ? parseInt(intervaloMinutos) : 30,
        ativo: true,
      },
    });
  }

  async listarPorVoluntario(voluntarioId, apenasAtivas = false) {
    const where = { voluntarioId: parseInt(voluntarioId) };
    if (apenasAtivas) where.ativo = true;

    return prisma.disponibilidade.findMany({
      where,
      orderBy: { diaSemana: 'asc' },
    });
  }

  async obterPorId(id) {
    const disponibilidade = await prisma.disponibilidade.findUnique({ where: { id: parseInt(id) } });
    if (!disponibilidade) throw new Error('Disponibilidade não encontrada');
    return disponibilidade;
  }

  async atualizar(id, dados) {
    const { horaInicio, horaFim, intervaloMinutos, ativo } = dados;

    const disponibilidade = await prisma.disponibilidade.findUnique({ where: { id: parseInt(id) } });
    if (!disponibilidade) throw new Error('Disponibilidade não encontrada');

    return prisma.disponibilidade.update({
      where: { id: parseInt(id) },
      data: {
        horaInicio: horaInicio || undefined,
        horaFim: horaFim || undefined,
        intervaloMinutos: intervaloMinutos ? parseInt(intervaloMinutos) : undefined,
        ativo: ativo !== undefined ? ativo : undefined,
      },
    });
  }

  async deletar(id) {
    const disponibilidade = await prisma.disponibilidade.findUnique({ where: { id: parseInt(id) } });
    if (!disponibilidade) throw new Error('Disponibilidade não encontrada');

    await prisma.disponibilidade.delete({ where: { id: parseInt(id) } });
    return { mensagem: 'Disponibilidade removida com sucesso' };
  }
}

module.exports = new DisponibilidadeService();
