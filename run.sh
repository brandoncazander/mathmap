#!/usr/bin/env bash
source /vagrant/mathmap/bin/activate
python /vagrant/mathmap_static/mathmap/manage.py runserver 0.0.0.0:8080 &
