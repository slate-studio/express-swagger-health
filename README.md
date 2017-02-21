# Express Swagger Helath

Health endpoint checker helper with option check swagger spec versions and slack notifications for Express

## Usage


Mimimum setup:

```
const health = require('express-swagger-health')
const healthParams = {
    name: 'microservice',
    version: '1.0.0'
}

app.get('/health', health(healthParams) )
```

This will return status 200 with 

```
{'name':'microservice','version':'1.0.0','status':'ok'}
```


Full setup:

```
const healthParams = {
    name: 'microservice',
    version: '1.0.0',
    swaggerCheck: {
        swaggerSchemaUri: 'http://service_with_swagger_spec_using.com',
        swaggerMockSpec: 'swaggerSpecWithTestUsing.json'
    },
    slack: {
        token: 'slackToken',
        channel: 'slackChannelID',
        iconUrl: 'http://example.com/ava.jpg'
    }
}

app.get('/health', health(healthParams) )
```


This will return status 200 with 

```
{'name':'microservice','version':'1.0.0','status':'ok'}
```

If server available and swagger schema mathch

OR

200 with 

```
{'name':'microservice','version':'1.0.0','status':'Swagger Versions Mistmatched'}
```

and also will send notification to slack:
 
Swagger Versions Mismatched for microservice, tests run against swagger schema v.0.3.5, but actual api version of schema is: 0.3.8


Slate Studio @ 2017