export const TEXT = {
    OK: 'OK'
}

export const EVENTS = {
    JOIN_GRP_ROOM: 'join_room',
    SEND_GRP_MSG: 'send_grp_msg'
}

export enum WS_CONNECTION_CLOSE_REASON {
    NORMAL_CLOSURE=1000,
    POLICY_VIOLATION=1008,
    INVALID_DATA=1007
}