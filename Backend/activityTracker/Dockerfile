# -----------------------------------------------------------------------------
# STAGE 1: Base Image
# -----------------------------------------------------------------------------
FROM python:3.14-slim-bookworm

# Set the working directory inside the container.
WORKDIR /app

# Copy dependency files into container
COPY Backend/activityTracker/requirements.txt ./

# Install Python dependencies.
# --no-cache-dir reduces image size by removing pip cache.
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django application source code.
COPY Backend/activityTracker/ ./

# Reduces unnecessary .pyc file generation inside containers.
ENV PYTHONDONTWRITEBYTECODE=1

# Send Python logs directly to stdout/stderr instead of buffering.
ENV PYTHONUNBUFFERED=1


# -----------------------------------------------------------------------------
# STAGE 2: Development Environment
# -----------------------------------------------------------------------------
# Typical usage:
# docker build --target development -t activity-tracker-dev .
# -----------------------------------------------------------------------------
FROM base AS development

# Django development server port.
EXPOSE 8000

# Start Django development server.
# -u ensures unbuffered output for real-time logs.
CMD ["python", "-u", "manage.py", "runserver", "0.0.0.0:8000"]


# -----------------------------------------------------------------------------
# STAGE 3: Production Environment
# -----------------------------------------------------------------------------
# Used for deployment.
# Installs Gunicorn and serves the Django application using a production-grade
# WSGI server instead of Django's development server.
#
# Typical usage:
# docker build --target production -t activity-tracker-prod .
# -----------------------------------------------------------------------------
FROM base AS production

# Install Gunicorn WSGI server.
RUN pip install --no-cache-dir gunicorn

# Application port.
EXPOSE 8000

# Create a non-root user For better security:
RUN adduser --disabled-password appuser
USER appuser

# Collecting static files during build
RUN python manage.py collectstatic --noinput

# Start Gunicorn and bind it to all network interfaces.
#
# Workers:
#   3 worker processes handle incoming requests.
#   Adjust based on CPU resources and application workload.
#
# WSGI module:
#   activityTracker.wsgi:application
#   -> project_name/wsgi.py
#

CMD ["gunicorn", "activityTracker.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]