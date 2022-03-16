#!/usr/bin/env bash

if [[ -x "../terminusdb" ]]; then
  ../terminusdb "$@"
elif docker image inspect terminusdb/terminusdb-server:local > /dev/null; then
  docker run \
    --rm \
    --user $(id -u):$(id -g) \
    --workdir /app/terminusdb/tests \
    --volume $(pwd)/storage:/app/terminusdb/tests/storage \
    terminusdb/terminusdb-server:local \
    /app/terminusdb/terminusdb \
    "$@"
else
  echo "Error! No way found to run terminusdb."
  exit -1
fi
