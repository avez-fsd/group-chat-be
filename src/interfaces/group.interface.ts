export interface CreateGroupRequest {
    name: string;
    isGroup: boolean;
    users: string[];
    groupUniqueId?:string;
    createdBy?:number;
}
