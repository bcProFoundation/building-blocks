{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "blocks.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "blocks.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "blocks.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "blocks.labels" -}}
helm.sh/chart: {{ include "blocks.chart" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Auth Server Selector labels
*/}}
{{- define "blocks.authServerSelectorLabels" -}}
app.kubernetes.io/name: {{ include "blocks.name" . }}-auth-server
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Com Server Selector labels
*/}}
{{- define "blocks.comServerSelectorLabels" -}}
app.kubernetes.io/name: {{ include "blocks.name" . }}-com-server
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Id Provider Selector labels
*/}}
{{- define "blocks.idProviderSelectorLabels" -}}
app.kubernetes.io/name: {{ include "blocks.name" . }}-id-provider
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Infra Console Selector labels
*/}}
{{- define "blocks.infraConsoleSelectorLabels" -}}
app.kubernetes.io/name: {{ include "blocks.name" . }}-infra-console
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "blocks.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "blocks.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/*
Create the name referring mongodb fullname
*/}}
{{- define "mongodb.fullname" -}}
{{- $.Release.Name }}-mongodb
{{- end -}}