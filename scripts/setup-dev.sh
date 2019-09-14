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

export AUTH_SERVER="http://accounts.localhost:4210"
export INFRASTRUCTURE_CONSOLE="http://admin.localhost:4220"
export IDENTITY_PROVIDER="http://myaccount.localhost:4420"
export COMMUNICATION_SERVER="http://connect.localhost:4100"
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
