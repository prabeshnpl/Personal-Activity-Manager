# Choose base image
FROM python:3.15.0a7-slim-bookworm

# Set working directory inside container
WORKDIR /app

# Copy files into container
COPY Backend/activityTracker/requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of the app
COPY Backend/activityTracker/ ./

# Expose port
EXPOSE 8000

# Command to run server
CMD ["python", "-u", "manage.py", "runserver", "0.0.0.0:8000"]
