## Create ClusterIssuer and Certificates

To install letsencrypt ssl along with cert-manager.
(requires cert-manager and nginx-ingress installed)

### Create ClusterIssuer

```sh
$ kubectl create -f cert-manager-ingress/cluster-issuer.yaml
```

### Create Certificate for domains

```sh
$ kubectl create -f cert-manager-ingress/certificate.yaml
```

The directory `kubernetes/deploy/cert-manager-ingress` has reference files used in production.
