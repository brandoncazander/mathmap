#!/usr/bin/env bash
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get --yes --force-yes install python-setuptools wget curl build-essential python-dev
cd /vagrant
sudo easy_install pip
pip install virtualenv
pip install markdown
virtualenv mathmap
source mathmap/bin/activate
pip install -r requirements.txt
echo "/vagrant/webapps/extensions/" >> /vagrant/mathmap/lib/python2.7/site-packages/mathjax.pth
chmod +x ./run.sh
