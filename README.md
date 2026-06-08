# Project

- Development: 
    `docker compose up`
- Production: 
    `docker compose -f docker-compose.yml up`

This is because -f is used to define which compose file to execute.

For Example: 

- This docker-compose will be overrided by override.yml since it comes later. `docker compose -f docker-compose.yml docker-compose.override.yml up`

- This override.yml will be overrided by docker-compose since it comes later. `docker compose -f docker-compose.override.yml up docker-compose.yml `