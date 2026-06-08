# Project

- Development: 
    `docker compose up`
- Production: 
    `docker compose -f docker-compose.yml up`

This is because -f is used to define which compose file to execute.

For Example: 

- This docker-compose will be overrided by override.yml since it comes later. `docker compose -f docker-compose.yml docker-compose.override.yml up`

- This override.yml will be overrided by docker-compose since it comes later. `docker compose -f docker-compose.override.yml up docker-compose.yml `

## Backup Postgres-db
```
    docker run --rm `
    -v postgres_data:/volume `
    -v ${PWD}:/backup `
    ubuntu `
    tar czf /backup/backup.tar.gz /volume
```

## Restore db
```
    docker run --rm \ `
    -v postgres_data:/volume \ `
    -v $(pwd):/backup \
    ubuntu \ `
    tar xzf /backup/backup.tar.gz -C /
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
