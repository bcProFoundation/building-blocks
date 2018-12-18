#!/bin/bash

# Check helm chart is installed or create
# reuse installed values and resets data

export CHECK_AS=$(helm ls -q authorization-server-staging --tiller-namespace $KUBE_NAMESPACE)
if [ "$CHECK_AS" = "authorization-server-staging" ]
then
    echo "Updating existing authorization-server-staging . . ."
    helm upgrade authorization-server-staging \
        --tiller-namespace $KUBE_NAMESPACE \
        --namespace $KUBE_NAMESPACE \
        --reuse-values \
        --recreate-pods \
        --set image.tag=edge \
        --wait \
        helm-charts/authorization-server
fi

export CHECK_IC=$(helm ls -q infrastructure-console-staging --tiller-namespace $KUBE_NAMESPACE)
if [ "$CHECK_IC" = "infrastructure-console-staging" ]
then
    echo "Updating existing infrastructure-console-staging . . ."
    helm upgrade infrastructure-console-staging \
        --tiller-namespace $KUBE_NAMESPACE \
        --namespace $KUBE_NAMESPACE \
        --reuse-values \
        --recreate-pods \
        --set image.tag=edge \
        --wait \
        helm-charts/infrastructure-console
fi

export CHECK_IDP=$(helm ls -q identity-provider-staging --tiller-namespace $KUBE_NAMESPACE)
if [ "$CHECK_IDP" = "identity-provider-staging" ]
then
    echo "Updating existing identity-provider-staging . . ."
    helm upgrade identity-provider-staging \
        --tiller-namespace $KUBE_NAMESPACE \
        --namespace $KUBE_NAMESPACE \
        --reuse-values \
        --recreate-pods \
        --set image.tag=edge \
        --wait \
        helm-charts/identity-provider
fi
