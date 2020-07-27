Kubernetes makes it easy to deploy, monitor and manage microservices.

It is recommended to use kubernetes to deploy / auto deploy the building blocks

This section is set of how-tos and documentation related to kubernetes

Helm Charts : [Github Repo](https://gitlab.com/castlecraft/building-blocks) (`kubernetes/helm-chart`)

Note:

- In case kubernetes ingress-nginx is used set the LoadBalancer service's as `externalTrafficPolicy: Cluster`. Required for in-cluster services to have access to hostname via external ingress.
