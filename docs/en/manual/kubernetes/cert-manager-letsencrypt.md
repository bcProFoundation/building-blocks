## Create ClusterIssuer and Certificates

To install letsencrypt ssl along with cert-manager.
(requires cert-manager and nginx-ingress installed)

### Create ClusterIssuer

```sh
$ kubectl create -f kubernetes/deploy/cert-manager-ingress/cluster-issuer/cluster-issuer-prod.yaml
```

### Create Certificate for domains

Note: Cert manager automatically creates certificate as per labels

```sh
$ kubectl create -f certificate.yaml
```

The directory `kubernetes/deploy/cert-manager-ingress` has reference files used in production.
