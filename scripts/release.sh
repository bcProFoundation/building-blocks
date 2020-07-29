#!/bin/bash

release_script_dir="$(dirname "$0")"
$release_script_dir/release/setup.sh

. ./env/bin/activate

cd $release_script_dir/..

lerna version --no-push

./scripts/release/wizard $1
