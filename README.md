# google_deno_integration

Google Integration and Authentication for Deno.

## How to use

### Example:

```typescript
import { GoogleAPI } from "https://deno.land/x/google_deno_integration/mod.ts";
//Expiration and aud are optional. Change the options below to yours:
const api = new GoogleAPI({
    email: "my-email-example@chama-la.iam.gserviceaccount.com",
    scope: ["https://www.googleapis.com/auth/androidpublisher"],
    key: "-----BEGIN PRIVATE KEY-----\nXXXXXXXXXXXX",
}
//NOW, YOU CAN USE:
//await api.get(url), await api.post(url, data), await api.delete(url), etc.
```

## About

Author: Henrique Emanoel Viana, a Brazilian computer scientist, enthusiast of
web technologies, cel: +55 (41) 99999-4664. URL:
https://sites.google.com/view/henriqueviana

Improvements and suggestions are welcome!
