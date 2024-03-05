export function getOffset(page: string | number, limit: string | number) {
    const intPage = (typeof page === 'string') ? parseInt(page) : page;
    const intLimit = (typeof limit === 'string') ? parseInt(limit) : limit;
    return intLimit * (intPage - 1);
}
  
export function paginate<T>(result: { rows: T[]; count: number }, page: number, limit: number) {
    return {
        data: result.rows,
        hasNext: page * limit < result.count,
        pageSize: limit,
        currentPage: page,
        total: result.count
    }
}