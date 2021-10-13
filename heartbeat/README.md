# [Heartbeat](./heartbeat)

Used to ensure the function app has deployed.

## Use 1: Verify everything works & display environment settings.

### Request

```http
HTTP GET https://[..].azurewebsites.net/api/heartbeat?code=[..]
```

### Response

```http
HTTP 200
The HTTP trigger executed successfully. APP_VERSION=staging && COMMIT_HASH=a144c0c939c07929344377f63053432deb6765c5.
```

## Use 2: Test two arguments return HTTP 200/400

Send to values, `operandA` & `operandB` as URL parameters via HTTP GET or via JSON in the body body with HTTP POST to add two numbers together.

If either value is not a number, returns a HTTP 500.

### Request

```http
HTTP GET https://[..].azurewebsites.net/api/heartbeat?code=[..]&operandA=2&operandB=3
```

### Response

```http
HTTP 200
The result of 2 + 3 = 5
```
