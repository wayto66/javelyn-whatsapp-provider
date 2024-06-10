# erro importante

{
"message": "Error retrieving item",
"error": {},
"msg": "Cannot access 'instanceId' before initialization",
"event": {
"version": "2.0",
"routeKey": "POST /request",
"rawPath": "/request",
"rawQueryString": "",
"headers": {
"accept": "_/_",
"accept-encoding": "gzip, deflate, br",
"content-length": "83",
"content-type": "application/json",
"host": "mulo5xpjs1.execute-api.sa-east-1.amazonaws.com",
"user-agent": "Thunder Client (https://www.thunderclient.com)",
"x-amzn-trace-id": "Root=1-666605bc-397eebf6283b7bae378df404",
"x-forwarded-for": "187.39.124.12",
"x-forwarded-port": "443",
"x-forwarded-proto": "https"
},
"requestContext": {
"accountId": "686169939187",
"apiId": "mulo5xpjs1",
"domainName": "mulo5xpjs1.execute-api.sa-east-1.amazonaws.com",
"domainPrefix": "mulo5xpjs1",
"http": {
"method": "POST",
"path": "/request",
"protocol": "HTTP/1.1",
"sourceIp": "187.39.124.12",
"userAgent": "Thunder Client (https://www.thunderclient.com)"
},
"requestId": "ZHXVfhF1mjQEJUQ=",
"routeKey": "POST /request",
"stage": "$default",
"time": "09/Jun/2024:19:42:52 +0000",
"timeEpoch": 1717962172490
},
"body": "{\n \"userId\": 34,\n \"endpoint\": \"/check\",\n \"requestData\": {\n \"userId\": 34\n }\n}",
"isBase64Encoded": false
}
}

# explicação

> quando um request de check é feito pra uma maquian recem-criada, que esta inicializando.
> precisa retornar no front uma resposta de carregamento da maquina

**\*\***!\* ---------------------------------------------------**\*\***
