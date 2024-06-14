from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from django.contrib.auth import get_user_model
from ..models import bookings, travelplan  # Replace with actual import path if different

User = get_user_model()

class TestUserRegistration(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_registration_success(self):
        url = reverse('register')
        data = {
            'email': 'newuser@example.com',
            'password': 'password123',
            'password2': 'password123',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertIn('msg', response.data)
        self.assertEqual(response.data['msg'], 'Registration Successful')


    def test_registration_invalid_data(self):
        url = reverse('register')
        data = {
            'email': 'newuser@example.com',
            'password': 'password123',
            'password2': 'password456'  # Passwords do not match
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TestUserLogin(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='testuser@example.com', password='password123')

    def test_login_success(self):
        url = reverse('login')
        data = {
            'email': 'testuser@example.com',
            'password': 'password123',
            'role': 'normal_user'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('msg', response.data)
        self.assertEqual(response.data['msg'], 'Login Success')

    def test_login_invalid_credentials(self):
        url = reverse('login')
        data = {
            'email': 'testuser@example.com',
            'password': 'wrongpassword',
            'role': 'normal_user'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('non_field_errors', response.data)

class TestUserProfile(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='testuser@example.com', password='password123')

    def test_get_user_profile(self):
        url = reverse('profile', args=[self.user.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.user.id)

    def test_get_user_profile_unauthenticated(self):
        url = reverse('profile', args=[self.user.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class TestUserChangePassword(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='testuser@example.com', password='password123')

    def test_change_password_success(self):
        url = reverse('changepassword', args=[self.user.id])
        self.client.force_authenticate(user=self.user)
        data = {
            'old_password': 'password123',
            'new_password1': 'newpassword123',
            'new_password2': 'newpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Password has been changed successfully')

    def test_change_password_invalid(self):
        url = reverse('changepassword', args=[self.user.id])
        self.client.force_authenticate(user=self.user)
        data = {
            'old_password': 'wrongpassword',
            'new_password1': 'newpassword123',
            'new_password2': 'newpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class TestPasswordReset(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='testuser@example.com', password='password123')

    def test_send_reset_email(self):
        url = reverse('send-reset-password-email')
        data = {'email': 'testuser@example.com'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('msg', response.data)

    def test_send_reset_email_not_found(self):
        url = reverse('send-reset-password-email')
        data = {'email': 'nonexistent@example.com'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('msg', response.data)

    def test_password_reset(self):
        # Simulate getting the token first
        url = reverse('send-reset-password-email')
        data = {'email': 'testuser@example.com'}
        self.client.post(url, data, format='json')

        reset_url = reverse('reset-password', args=['uid', 'token'])
        reset_data = {
            'new_password1': 'newpassword123',
            'new_password2': 'newpassword123'
        }
        response = self.client.post(reset_url, reset_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('msg', response.data)

class TestTravelPlanApi(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(email='admin@example.com', password='adminpass')

    def test_get_all_travel_plans(self):
        url = reverse('travelplans')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_travel_plan(self):
        url = reverse('travelplans')
        self.client.force_authenticate(user=self.admin_user)
        data = {
            'title': 'Test Plan',
            'description': 'Test Description',
            'start_date': '2024-01-01',
            'end_date': '2024-01-10'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('msg', response.data)

    def test_update_travel_plan(self):
        plan = travelplan.objects.create(title='Old Plan', description='Old Description')
        url = reverse('travelplans', args=[plan.id])
        self.client.force_authenticate(user=self.admin_user)
        data = {'title': 'Updated Plan', 'description': 'Updated Description'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Plan')

    def test_delete_travel_plan(self):
        plan = travelplan.objects.create(title='Plan to Delete', description='Delete Me')
        url = reverse('travelplans', args=[plan.id])
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('msg', response.data)

class TestBookingApi(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='testuser@example.com', password='password123')

    def test_get_all_bookings(self):
        url = reverse('bookings')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_booking(self):
        url = reverse('bookings')
        self.client.force_authenticate(user=self.user)
        data = {
            'travel_plan': 1,
            'user': self.user.id,
            'date': '2024-01-01'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('msg', response.data)

    def test_update_booking(self):
        booking = bookings.objects.create(travel_plan_id=1, user=self.user, date='2024-01-01')
        url = reverse('bookings', args=[booking.id])
