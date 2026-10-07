import time
from firebase_admin import messaging # type: ignore
from fcm_django.models import FCMDevice # type: ignore

# # Initialize Firebase app if not already initialized
# def initialize_firebase():
#     try:
#         firebase_admin.get_app()
#     except ValueError:
#         credential_path = os.path.join('firebase', 'serviceAccountKey.json')
#         if not os.path.exists(credential_path):
#             raise FileNotFoundError(f"Firebase credential file not found: {credential_path}")
#         cred = credentials.Certificate(credential_path)
#         firebase_admin.initialize_app(cred)

# Send test notification to active devices or specific device IDs
def send_notification(user_ids=None, title=None, body=None, data=None):
    # initialize_firebase()

    # Filter devices
    print(f"yes we are sending it to: {user_ids}")
    if user_ids:
        devices = FCMDevice.objects.filter(user_id__in=user_ids, active=True)
    else:
        devices = FCMDevice.objects.filter(active=True)

    print(f"Devices are: {devices}")

    if not devices.exists():
        return "No active devices found."

    registration_tokens = list(devices.values_list("registration_id", flat=True))

    print(f"registration_tokens are: {registration_tokens}")

    total_success, total_failure, invalid_tokens = 0, 0, []

    # Send notification to each device
    for idx, token in enumerate(registration_tokens, start=1):
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body
            ),
            data=data,
            token=token,
        )

        try:
            messaging.send(message)
            total_success += 1
        except messaging.UnregisteredError:
            invalid_tokens.append(token)
            total_failure += 1
        except Exception as e:
            print(f"Error sending notification: {e}")
            total_failure += 1

        time.sleep(0.05)  # Throttle to avoid rate limits

        print(f"Sent Successfully for: {token}")

    # Clean up invalid tokens
    if invalid_tokens:
        FCMDevice.objects.filter(registration_id__in=invalid_tokens).delete()
        print(f"Deleted {len(invalid_tokens)} invalid tokens.")

    return f"Test complete: {total_success} sent, {total_failure} failed."