#!/bin/bash

# Check helm chart is installed or create
# reuse installed values and resets data

export CHECK_AS=$(helm ls -q authorization-server-staging)
if [ "$CHECK_AS" = "authorization-server-staging" ]
then
    echo "Updating existing authorization-server-staging . . ."
    helm upgrade authorization-server-staging \
        --reuse-values \
        --recreate-pods \
        --set image.tag=edge \
        helm-charts/authorization-server
fi

export CHECK_IC=$(helm ls -q infrastructure-console-staging)
if [ "$CHECK_IC" = "infrastructure-console-staging" ]
then
    echo "Updating existing infrastructure-console-staging . . ."
    helm upgrade infrastructure-console-staging \
        --reuse-values \
        --recreate-pods \
        --set image.tag=edge \
        helm-charts/infrastructure-console
fi

export CHECK_IDP=$(helm ls -q identity-provider-staging)
if [ "$CHECK_IDP" = "identity-provider-staging" ]
then
    echo "Updating existing identity-provider-staging . . ."
    helm upgrade identity-provider-staging \
        --reuse-values \
        --recreate-pods \
        --set image.tag=edge \
        helm-charts/identity-provider
fi
