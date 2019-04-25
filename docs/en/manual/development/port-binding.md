# Port binding

For backend apps

- Authorization Server exposes port `3000`
- Communication Server exposes port `4100`
- Infrastructure Console exposes port `5000`
- Identity Provider exposes port `3200`

For frontend clients

- Authorization Client serves on `4210` during development, production nginx serves on `8080`
- Admin Client serves on `4220` during development, production nginx serves on `8080`
- Identity Client serves on `4420` during development, production nginx serves on `8080`
