# Base image with dependencies installed
FROM python:3.15.0a7-slim-bookworm AS base

WORKDIR /app

COPY Backend/activityTracker/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY Backend/activityTracker/ ./

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

FROM base AS development
EXPOSE 8000
CMD ["python", "-u", "manage.py", "runserver", "0.0.0.0:8000"]

FROM base AS production
RUN pip install --no-cache-dir gunicorn
EXPOSE 8000
CMD ["gunicorn", "activityTracker.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
