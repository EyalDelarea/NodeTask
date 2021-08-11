# BackendExercise
Backend Exercise querying API with NodeJS-Express.

Deployed via Docker container on a local machine with static IP :

http://185.23.175.119:8080/



![7qjjeinaev4703fiurwh](https://user-images.githubusercontent.com/23456142/128731562-7eea04a2-7a17-4566-bd31-1c3b0bf9bccd.jpeg)




End-points:

/actors : Which Marvel movies did each actor play in.
http://185.23.175.119:8080/actors

/actors/:name - Query only specific actor to see which Marvel movies did he act on.
http://185.23.175.119:8080/actors:name

/moreThanOne - Actors who played more than one Marvel character
http://185.23.175.119:8080/morethanone

/actingcollision Are there 2 different actors who played the same role
http://185.23.175.119:8080/actingcollision











![docker_codeception-07](https://user-images.githubusercontent.com/23456142/128731571-5c23ee82-d4fc-42a7-b905-142d75d98d98.jpg)
Docker image URL: 
https://hub.docker.com/layers/161819618/eyaldelarea/app/latest/images/sha256-cb24259636779b6f7e1ee31466667e8dbfca59fe0ab614c3e874baeec53c42d9?context=repo
