#!/bin/bash

# Check ClusterIssuer letsencrypt-staging or create
export CHECKCLUSTERISSUER=$(kubectl get ClusterIssuer letsencrypt-staging -o name)
if [ "$CHECKCLUSTERISSUER" = "clusterissuer.certmanager.k8s.io/letsencrypt-staging" ]
then
    echo "ClusterIssuer Already Exists"
else
    kubectl apply -f ./helm-charts/authorization-server/cert-manager-ingress/cluster-issuer-staging.yaml
fi

# Check Certificate accounts-castlecraft-in-staging or create
export CHECKCERTIFICATE=$(kubectl get Certificate accounts-castlecraft-in-staging -o name)
if [ "$CHECKCERTIFICATE" = "certificate.certmanager.k8s.io/accounts-castlecraft-in-staging" ]
then
    echo "Certificate Already Exists"
else
    kubectl apply -f ./helm-charts/authorization-server/cert-manager-ingress/certificate-staging.yaml
fi

# Check helm chart is installed or create
export CHECKINSTALL=$(helm ls -q authorization-server-staging)
if [ "$CHECKINSTALL" = "authorization-server-staging" ]
then
    echo "Updating existing deployment . . ."
    helm upgrade authorization-server-staging \
        --reuse-values \
        --set image.tag=edge \
        helm-charts/authorization-server
else
    echo "Installing new deployment . . ."
    helm install --name authorization-server-staging \
        --set sessionSecret=SuperSecretString \
        --set persistence.enabled=false \
        --set authorization-server-redis.persistence.enabled=false \
        --set mongodb.persistence.enabled=false \
        --set image.tag=edge \
        --set ingress.annotations."certmanager\.k8s\.io/cluster-issuer"=letsencrypt-staging \
        --set ingress.hosts={staging-accounts.castlecraft.in} \
        --set ingress.tls[0].secretName=accounts-castlecraft-in-staging-tls \
        --set ingress.tls[0].hosts={staging-accounts.castlecraft.in} \
        helm-charts/authorization-server
fi
