export interface Pagination<T> {
    data: T[]
    hasNext: boolean,
    pageSize: number,
    currentPage: number,
    total: number
}