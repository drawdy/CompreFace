#!/usr/bin/env bash

set -eo pipefail

CUR_DIR=`echo $PWD`

function status() {
    echo -e "\e[1;33m ---> $* \e[0m"
}

function build() {
    shift 1

    if [[ $# == 0 ]]
    then
        status 'at least one application name'
        exit 1
    fi

    while [[ $# > 0 ]]
    do
        case $1 in
            ui)
                buildUI
                ;;
            *)
                ;;
        esac
        shift 1
    done
}

function buildUI() {
    cd "${CUR_DIR}/ui" && docker build . -t 'compreface-fe' -f docker-prod/Dockerfile
}

function run() {
    cd "${CUR_DIR}/dev" && docker-compose rm -sf compreface-fe && docker-compose up -d
}

function stop() {
    cd "${CUR_DIR}/dev" && docker-compose down
}

function usage() {
    status "USAGE: $0 build|run|stop [ARGS]"
}

if [[ $# == 0 ]]
then
    usage
    exit 1
fi

case $1 in
    build)
        build $@
        ;;
    run)
        run $@
        ;;
    stop)
        stop
        ;;
    *)
        usage
esac