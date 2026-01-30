[Task Deadline Approaching]
        ↓
Create Notification
        ↓
Create Schedule (due_at - X)
        ↓
Celery worker picks schedule
        ↓
Create Delivery records
        ↓
Send via channel
        ↓
Update delivery status
