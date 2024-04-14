handling timeout errors

```javascript
{
    "status": "Error",
    "error": {
        "statusCode": 500,
        "status": "Error"
    },
    "message": "Operation `users.find()` buffering timed out after 10000ms",
    "stack": "MongooseError: Operation `users.find()` buffering timed out after 10000ms\n    at Timeout.<anonymous> (C:\\-Programming\\udemy-courses\\nodeJs\\starterFiles\\4-natours\\starter\\node_modules\\mongoose\\lib\\drivers\\node-mongodb-native\\collection.js:185:23)\n    at listOnTimeout (node:internal/timers:569:17)\n    at process.processTimers (node:internal/timers:512:7)"
}
```

organizing files

changing the commonjs into modules

using ts

