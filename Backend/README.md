# Pull image from GHCR and run directly
- Pull (If public):
     
    1. Log into GHCR(if private)
        - `echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u prabeshnpl --password-stdin`
    2. Create docker-compose.yml file
        ```
        services:
            backend:
                image: ghcr.io/your-github-username/tracker-backend:latest
                ports:
                    - "8000:8000"
        ```          
    3. Start the app
        - `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`

# Pull repo from Github and run
- First restore the data if needed. Command is provided below.
- Development(default loads override): 
    - `docker compose up`
    - `docker compose down`

# Create or check-out specific version of the project using tag

- Create and push a tag
```powershell
git tag -a v1.0.0 -m "Meta Data for the tag."
git push origin v1.0.0
```

- Retrieve specific version
```powershell
git clone https://github.com/username/repo.git
cd repo
git tag
git tag -n v1
git checkout v1.0.0
```

## Backup Postgres-db
- Run it strictly on `git bash` or `cmd` not in `powershell`
```
docker exec -t postgres-db pg_dumpall -U admin > backup_all.sql
```

## Restore db
```
docker exec -i postgres-db psql -U admin -d postgres < backup_all.sql
```

## If backing up to different db
```
docker exec -it postgres17-db psql -U new_admin -c "CREATE DATABASE tracker(or db name);"
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
