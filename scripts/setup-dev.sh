#!/usr/bin/env bash
if [[ -z "$ADMIN_FULL_NAME" ]]; then
    echo "ADMIN_FULL_NAME is not set"
    exit 1
fi
if [[ -z "$ADMIN_EMAIL" ]]; then
    echo "ADMIN_EMAIL is not set"
    exit 1
fi
if [[ -z "$ADMIN_PASSWORD" ]]; then
    echo "ADMIN_PASSWORD is not set"
    exit 1
fi
if [[ -z "$ADMIN_PHONE" ]]; then
    echo "ADMIN_PHONE is not set"
    exit 1
fi
if [[ -z "$ORGANIZATION_NAME" ]]; then
    echo "ORGANIZATION_NAME is not set"
    exit 1
fi

if [[ -z "$AUTH_SERVER" ]]; then
    export AUTH_SERVER="http://accounts.localhost:4210"
fi

if [[ -z "$INFRASTRUCTURE_CONSOLE" ]]; then
    export INFRASTRUCTURE_CONSOLE="http://admin.localhost:4220"
fi

if [[ -z "$IDENTITY_PROVIDER" ]]; then
    export IDENTITY_PROVIDER="http://myaccount.localhost:4420"
fi

if [[ -z "$COMMUNICATION_SERVER" ]]; then
    export COMMUNICATION_SERVER="http://connect.localhost:4100"
fi

export script_dir="$(dirname "$0")"

echo "Setting Up Authorization Server and Infrastructure Console"
$script_dir/setupwiz.py setup-as\
    $AUTH_SERVER\
    "$ADMIN_FULL_NAME"\
    $ADMIN_EMAIL\
    $ADMIN_PASSWORD\
    $ADMIN_PHONE\
    $INFRASTRUCTURE_CONSOLE\
    "$ORGANIZATION_NAME"

echo "Setting Up Identity Provider"
$script_dir/setupwiz.py add-client\
    $ADMIN_EMAIL\
    $ADMIN_PASSWORD\
    $INFRASTRUCTURE_CONSOLE\
    "Identity Provider"\
    $IDENTITY_PROVIDER

echo "Setting Up Communication Server"
$script_dir/setupwiz.py add-client\
    $ADMIN_EMAIL\
    $ADMIN_PASSWORD\
    $INFRASTRUCTURE_CONSOLE\
    "Communication Server"\
    $COMMUNICATION_SERVER
