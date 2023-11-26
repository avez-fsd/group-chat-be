import express from 'express'
var expressWs = require('express-ws')(express());

const router = expressWs.app;

router.ws("/",function(ws: any, req: Request){
    ws.on('message', function(msg:any){
        
        console.log(msg)

    })
})

export default router;