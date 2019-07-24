### CromJob to backup MongoDB and upload to Bucket

Download `kubernetes/deploy/mongodb-backup-cronjob/mongo-backup-cronjob.yaml` and make appropriate changes

Create resources

```sh
kubectl create -f mongo-backup-cronjob.yaml
```

Cron Job should be created with s3-secrets
