export interface CreateGroupRequest {
    name: string;
    groupId?:string;
    createdBy?:number;
}

export interface SocketMessageEvent<DataType> {
    headers: HeaderMessageEvent;
    event: string;
    data: DataType
}

export interface MessageReceivedEvent {
    message: string;
}

export interface HeaderMessageEvent {
    authorization: string;
}

export interface StoreMessageDTO {
    userId: number;
    groupId: number;
    message: string;
}