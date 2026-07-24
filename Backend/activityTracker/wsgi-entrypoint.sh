#!/bin/sh

# Function to wait for PostgreSQL database
wait_for_db() {
    host="$1"
    port="$2"
    timeout="${3:-10}"
    echo "Waiting for PostgreSQL database on $host:$port..."

    # Loop until timeout is reached
    start_time=$(date +%s)
    end_time=$((start_time + timeout))
    while :
    do
        echo "Connecting to database using ${host}:${port} "
        # Try to connect to the database
        if nc -z "$host" "$port"; then
            echo "PostgreSQL is up!"
            break
        fi

        # Check if timeout has been reached
        current_time=$(date +%s)
        if [ "$current_time" -ge "$end_time" ]; then
            echo "Timeout reached, PostgreSQL is not available."
            exit 1
        fi

        # Wait and retry
        sleep 1
    done
}

# Function call to wait for PostgreSQL database
wait_for_db "$DB_HOST" "$DB_PORT"

# Make database migrations
echo "Making database migrations..."
python manage.py makemigrations

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate --force

# Collect static files (optional, if your app uses static files)
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting server..."
# exec gunicorn activityTracker.wsgi:application \
#     --bind 0.0.0.0:8002 \
#     --workers 3 \
#     --log-level=info
exec gunicorn activityTracker.wsgi:application --bind 0.0.0.0:8000 --reload