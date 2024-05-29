from django.core.mail import send_mail
import os


def send_email_to_client(data):
    subject=data['subject']
    message=data['body']
    from_email=os.environ.get('EMAIL_FROM')
    recipient_list=[data['to_email']]
    send_mail(subject ,message, from_email, recipient_list, fail_silently=False,)