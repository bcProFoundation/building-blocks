# Visual Studio Code IDE

To improve development speed while using VS Code you can setup configuration similar to this.
This configuration works on linux machine. You need to make changes as per your OS.

### launch.json

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "authorization-client",
            "url": "http://accounts.localhost:4210",
            "runtimeExecutable": "/usr/bin/chromium",
            "runtimeArgs": ["--remote-debugging-port=9222", "--user-data-dir=/tmp/bb/authorization-client"],
            "webRoot": "${workspaceFolder}/frontends/authorization-client",
            "sourceMapPathOverrides": {
                "webpack:/*": "${webRoot}/*",
                "/./*": "${webRoot}/*",
                "/src/*": "${webRoot}/*",
                "/*": "*",
                "/./~/*": "${webRoot}/node_modules/*"
            }
        },
        {
            "type": "chrome",
            "request": "launch",
            "name": "admin-client",
            "url": "http://admin.localhost:4220",
            "runtimeExecutable": "/usr/bin/chromium",
            "runtimeArgs": ["--remote-debugging-port=9222", "--user-data-dir=/tmp/bb/admin-client"],
            "webRoot": "${workspaceFolder}/frontends/admin-client",
            "sourceMapPathOverrides": {
                "webpack:/*": "${webRoot}/*",
                "/./*": "${webRoot}/*",
                "/src/*": "${webRoot}/*",
                "/*": "*",
                "/./~/*": "${webRoot}/node_modules/*"
            }
        },
        {
            "type": "chrome",
            "request": "launch",
            "name": "identity-client",
            "url": "http://myaccount.localhost:4420",
            "runtimeExecutable": "/usr/bin/chromium",
            "runtimeArgs": ["--remote-debugging-port=9222", "--user-data-dir=/tmp/bb/identity-client"],
            "webRoot": "${workspaceFolder}/frontends/identity-client",
            "sourceMapPathOverrides": {
                "webpack:/*": "${webRoot}/*",
                "/./*": "${webRoot}/*",
                "/src/*": "${webRoot}/*",
                "/*": "*",
                "/./~/*": "${webRoot}/node_modules/*"
            }
        }
    ]
}
```

### settings.json

```
{
    "debug.node.autoAttach": "on"
}
```

### tasks.json

```
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "authorization-server",
            "type": "npm",
            "script": "start:debug",
            "path": "apps/authorization-server/",
            "problemMatcher": []
        },
        {
            "label": "infrastructure-console",
            "type": "npm",
            "script": "start:debug",
            "path": "apps/infrastructure-console/",
            "problemMatcher": []
        },
        {
            "label": "identity-provider",
            "type": "npm",
            "script": "start:debug",
            "path": "apps/identity-provider/",
            "problemMatcher": []
        },
        {
            "label": "communication-server",
            "type": "npm",
            "script": "start:debug",
            "path": "apps/communication-server/",
            "problemMatcher": []
        },
        {
            "label": "authorization-client",
            "type": "npm",
            "script": "start",
            "path": "frontends/authorization-client/",
            "problemMatcher": []
        },
        {
            "label": "admin-client",
            "type": "npm",
            "script": "start",
            "path": "frontends/admin-client/",
            "problemMatcher": []
        },
        {
            "label": "identity-client",
            "type": "npm",
            "script": "start",
            "path": "frontends/identity-client/",
            "problemMatcher": []
        },
        {
            "label": "building-blocks-frontend",
            "dependsOn": [
                "authorization-client",
                "admin-client",
                "identity-client"
            ],
            "problemMatcher": []
        },
        {
            "label": "building-blocks-backend",
            "dependsOn": [
                "authorization-server",
                "infrastructure-console",
                "identity-provider",
                "communication-server"
            ],
            "problemMatcher": []
        },
        {
            "label": "building-blocks-all",
            "dependsOn": [
                "building-blocks-backend",
                "building-blocks-frontend"
            ],
            "problemMatcher": []
        }
    ]
}
```
