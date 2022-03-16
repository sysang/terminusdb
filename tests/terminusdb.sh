#!/usr/bin/env bash

if [[ -x "../terminusdb" ]]; then
  ../terminusdb "$@"
elif docker image inspect terminusdb/terminusdb-server:local > /dev/null; then
  docker run \
    --name terminusdb \
    --workdir /app/terminusdb/tests \
    terminusdb/terminusdb-server:local \
    /app/terminusdb/terminusdb \
    "$@"
else
  echo "Error! No way found to run terminusdb."
  exit -1
fi
