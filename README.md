# Express Swagger Health

Health endpoint checker helper for Express that validates dependant swagger
schema version against the mocked one and send notification to slack if there
is an inconsistency.


## Configuration

Example below relies on `config` variables as follow:

```yaml
app:
  name: service-name
slack:
  token: xoxp-**********-5111332199-11970959559-**********
  channel: XXXOOOYYY
```

Feel free to adjust them for your convenience.


## Example

```javascript
const health = require('express-swagger-health')
const healthOptions = {
  name: C.app.name,
  version: require('../package.json').version,
  slack: C.slack,
  apis: [
    {
      name: 'api1',
      uri: C.app.api1SwaggerUri,
      localSchema: require('../test/factories/api1Swagger.json')
    },
    {
      name: 'api2',
      uri: C.app.api2SwaggerUri,
      localSchema: require('../test/factories/api2Swagger.json')
    }
  ]
}

app.get('/health', health(healthOptions) )
```

Successful response:

```javascript
{
    'name': 'service-name',
    'version': '1.0.0',
    'status': 'ok',
    'errors': []
}
```

Failure response:

```javascript
{
    'name': 'service-name',
    'version': '1.0.0',
    'status': 'error',
    'errors': [
        "api1: Swagger version mismatch, expected: v0.2.5, returned: v0.3.15",
        "api2: Swagger version mismatch, expected: v0.3.5, returned: v0.3.11"
    ]
}
```


Slate Studio @ 2017