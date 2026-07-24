# Pull image from GHCR and run directly
- Pull (If public):
    1. Create docker-compose.yml file
        ```
        version: '3.8'

        services:
        frontend:
            image: ghcr.io/your-github-username/tracker-frontend:latest
            ports:
            - "80:80"

        backend:
            image: ghcr.io/your-github-username/tracker-backend:latest
            ports:
            - "8000:8000"
        ```       
    2. Log into GHCR(if private)
        - `echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u prabeshnpl --password-stdin`

    3. Start the app
        - `docker compose up -d`


# Pull repo from Github and run

- Development(default loads override): 
    - `docker compose up`
    - `docker compose down`
- Production: 
    - `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
    - `docker-compose -f docker-compose.yml -f docker-compose.prod.yml down`

This is because `-f` is used to define which compose file to execute.

For Example: 

- This docker-compose will be overrided by override.yml since it comes later. 
    - `docker compose -f docker-compose.yml docker-compose.override.yml up`

- This override.yml will be overrided by docker-compose since it comes later. 
    - `docker compose -f docker-compose.override.yml up docker-compose.yml `

## Backup Postgres-db
```
docker run --rm `
-v postgres_data:/volume `
-v ${pwd}:/backup `
ubuntu `
tar czf /backup/backup.tar.gz /volume
```

## Restore db
```
docker run --rm -v postgres_data:/volume -v ${PWD}:/backup ubuntu tar xzf /backup/backup.tar.gz -C /volume
```

## Transfer from db.sqlite3 into postgres

1. Dump the data from sqlite into data.json

    ```
    python manage.py dumpdata `
    --natural-primary --natural-foreign `
    --indent 2 > data.json
    ```
2. Switch to postgres database in settings.py

    ```
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv("POSTGRES_DB"),
            'USER': os.getenv("POSTGRES_USER"),
            'PASSWORD': os.getenv("POSTGRES_PASSWORD"),
            'HOST': 'postgres-db',
            'PORT': '5432',
        }
    }
    ```

3. Run migrations

4. Load the dumped data from json file into postgres data:
    - `docker compose exec api python manage.py loaddata data.json`
