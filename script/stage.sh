#!/usr/bin/env bash

ssh -i ~/.ssh/aliyun root@112.74.26.145 "su - app -c /home/app/bin/update.sh"
# ssh -i ~/.ssh/aliyun root@112.74.26.145 "su - app -c /home/app/bin/update.sh db"