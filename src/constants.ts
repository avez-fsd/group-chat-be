export const TEXT = {
    OK: 'OK'
}

export const EVENTS = {
    JOIN_GRP: 'join_group',
    SEND_GRP_MSG: 'send_grp_msg',
    GRP_MSG_RECIEVED: 'grp_msg_received'
}

export enum WS_CONNECTION_CLOSE_REASON {
    NORMAL_CLOSURE=1000,
    POLICY_VIOLATION=1008,
    INVALID_DATA=1007
}

export const ALLOWED_ORIGINS = [
    'http://localhost:3000',
];
  