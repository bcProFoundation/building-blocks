### Letsencrypt Certificates

To install letsencrypt ssl along with cert-manager. (requires cert-manager and nginx-ingress installed)

```
# Create ClusterIssuer for domain

$ wget -c https://gitlab.com/castlecraft/building-blocks/raw/develop/helm-charts/deploy/cert-manager-ingress/cluster-issuer/cluster-issuer-prod.yaml

# Edit cluster-issuer-prod.yaml

$ kubectl apply -f cluster-issuer-prod.yaml

# Create Example Certificate
$ wget -c https://gitlab.com/castlecraft/building-blocks/raw/develop/helm-charts/deploy/cert-manager-ingress/certificates/admin.castlecraft.in/certificate-prod.yaml

# Edit certificate-prod.yaml

$ kubectl apply -f certificate-prod.yaml
```
