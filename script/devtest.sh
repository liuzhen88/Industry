#!/usr/bin/env bash

ssh -i ~/.ssh/aliyun root@120.25.69.229 "su - app -c /home/app/bin/update.sh"
# ssh -i ~/.ssh/aliyun root@120.25.69.229 "su - app -c /home/app/bin/update.sh db"