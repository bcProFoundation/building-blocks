## Configuring and initializing Helm Tiller

Run following commands

```sh
helm init --service-account namespace-user --tiller-namespace namespace

# If your cluster previously had Helm/Tiller installed
helm init --upgrade --service-account namespace-user --tiller-namespace namespace
```

### Secure Tiller

```sh
kubectl -n namespace delete service tiller-deploy

kubectl -n namespace patch deployment tiller-deploy --patch '
spec:
  template:
    spec:
      containers:
        - name: tiller
          ports: []
          command: ["/tiller"]
          args: ["--listen=localhost:44134"]
'
```
