#!/bin/bash

cd /tmp
# Clone building blocks configuration
git clone https://github.com/castlecraft/helm-charts

# Check helm chart is installed or create
# reuse installed values and resets data
export CHECK_AS=$(helm ls -q building-blocks-staging --tiller-namespace staging)
if [ "$CHECK_AS" = "building-blocks-staging" ]
then
    echo "Updating existing building-blocks-staging . . ."
    helm upgrade building-blocks-staging \
        --tiller-namespace staging \
        --namespace staging \
        --reuse-values \
        helm-charts/building-blocks
fi
