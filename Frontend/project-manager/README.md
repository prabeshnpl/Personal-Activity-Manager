# Run Nginx to test react build
- Run the command:
    ```
    docker run --name my-local-nginx \
    -p 8080:80 \
    -v "$(pwd)/dist:/usr/share/nginx/html:ro" \
    -v "$(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
    -d nginx:alpine
    ```
- If it fails, use this command:
    ```
    MSYS_NO_PATHCONV=1 docker run --name my-local-nginx \
    -p 8080:80 \
    -v "$(pwd -W)/dist:/usr/share/nginx/html:ro" \
    -v "$(pwd -W)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
    -d nginx:alpine
    ```