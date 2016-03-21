#!/bin/bash

http POST :5000/client name="Beta Corp"
http POST :5000/client name="Novo Inc"
http POST :5000/client name="PixelJunk"
http POST :5000/client name="OnlineCity"
http POST :5000/project name="Topedo App" client:=1
http POST :5000/project name="FoobarZoo" client:=1
http POST :5000/project name="Project X" client:=1
http POST :5000/project name="Firtal Brands" client:=2
http POST :5000/project name="Matas integration" client:=2
http POST :5000/project name="AppFrame" client:=4
http POST :5000/project name="PushNotification System" client:=4
http POST :5000/work_entry project:=1 duration:=120 message="Error handling" start:='{"$date": 1457915005926}'
http POST :5000/work_entry project:=1 duration:=180 message="Made flake8 linting" start:='{"$date": 1457915005926}'
http POST :5000/work_entry project:=6 duration:=30 message="Bug fix #132423" start:='{"$date": 1457915005926}'
http POST :5000/work_entry project:=4 duration:=120 message="Added cli interface" start:='{"$date": 1457915005926}'
http POST :5000/work_entry project:=3 duration:=120 message="Made tests for db" start:='{"$date": 1457915005926}'
http POST :5000/work_entry project:=1 duration:=90 message="Clean up after mem leak" start:='{"$date": 1457915005926}'
http POST :5000/work_entry project:=5 duration:=120 message="Review and QA" start:='{"$date": 1457915005926}'
http POST :5000/work_entry project:=7 duration:=180 message="Meeting about ABC" start:='{"$date": 1457915005926}'
http POST :5000/work_entry project:=5 duration:=120 message="changed framework" start:='{"$date": 1457915005926}'
http POST :5000/work_entry project:=6 duration:=240 message="Evaluated Flask vs Potion for rest" start:='{"$date": 1457915005926}'
http POST :5000/work_entry project:=7 duration:=120 message="Added TP to lead generator" start:='{"$date": 1457915005926}'
