#!/bin/bash

cd /tmp
# Clone building blocks configuration
git clone https://github.com/castlecraft/helm-charts

# Check helm chart is installed or create
# reuse installed values and resets data
export CHECK_AS=$(helm ls -q building-blocks-dev --tiller-namespace develop)
if [ "$CHECK_AS" = "building-blocks-dev" ]
then
    echo "Updating existing building-blocks-dev . . ."
    helm upgrade building-blocks-dev \
        --tiller-namespace develop \
        --namespace develop \
        --reuse-values \
        --recreate-pods \
        helm-charts/building-blocks
fi
