class PaginationHelper {
    static validate(limit, page) {
      const allowedLimits = [5, 10, 30];
      const parsedLimit = Number(limit);
      const parsedPage = Number(page);
  
      if (!allowedLimits.includes(parsedLimit)) {
        throw new AppError('Limite inválido. Valores permitidos: 5, 10 ou 30', 400);
      }
  
      if (parsedPage < 1) {
        throw new AppError('Número da página deve ser maior que 0', 400);
      }
  
      return { parsedLimit, parsedPage };
    }
  
    static calculateOffset(page, limit) {
      return (page - 1) * limit;
    }
  
    static getPaginationData(total, currentPage, limit) {
      return {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage,
        limit
      };
    }
  }
  
  module.exports = PaginationHelper;