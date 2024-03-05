import User from "@datasources/models/user.model";


export const userSearchResponse = (userListWithPagination:any) => {
    return {
        hasNext: userListWithPagination.hasNext,
        pageSize: userListWithPagination.pageSize,
        currentPage: userListWithPagination.currentPage,
        totalResults: userListWithPagination.total,
        result: userListWithPagination.data.map((user: User)=>{
            return userDetailsResponse(user);
        })
    }
}

export const userDetailsResponse = (user:User) => {
    return {
        userId: user.userUniqueId,
        name: user.name,
        email: user.email
    }
}