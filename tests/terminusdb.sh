#!/usr/bin/env bash

if [[ -x "../terminusdb" ]]; then
  ../terminusdb "$@"
else if docker image inspect terminusdb/terminusdb-server:local > /dev/null; then
  docker run \
    --name terminusdb \
    --workdir /app/terminusdb/tests \
    terminusdb/terminusdb-server:local \
    /app/terminusdb/terminusdb \
    "$@"
fi
