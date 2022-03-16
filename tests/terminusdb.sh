#!/usr/bin/env bash

# This is a script used to test the command-line interface (CLI).
# It should be run in this directory.

# 1. Try to use the locally built executable. This is for development.
# 2. Try to use the Docker image. This is for continuous integration.

if [[ -x "../terminusdb" ]]; then
  set -ex
  ../terminusdb "$@"
elif docker image inspect terminusdb/terminusdb-server:local > /dev/null; then
  user="$(id -u):$(id -g)"
  set -ex
  docker run \
    --rm \
    --user $user \
    --volume $PWD:/app/terminusdb/tests \
    --workdir /app/terminusdb/tests \
    terminusdb/terminusdb-server:local \
    /app/terminusdb/terminusdb \
    "$@"
else
  echo "Error! I'm not sure how to run the CLI (terminusdb)."
  exit -1
fi
