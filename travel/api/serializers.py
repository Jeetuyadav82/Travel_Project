from rest_framework import serializers
from .models import User,travelplan,bookings,UserProfile
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .utils import send_email_to_client


class UserRegistrationSerializer(serializers.ModelSerializer):
  # We are writing this becoz we need confirm password field in our Registratin Request
  password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)

  class Meta:
    model = User
    fields=['email', 'name', 'password', 'password2', 'tc']
    extra_kwargs={
      'password':{'write_only':True}
    }

  # Validating Password and Confirm Password while Registration
  def validate(self, attrs):
    password = attrs.get('password')
    password2 = attrs.get('password2')
    if password != password2:
      raise serializers.ValidationError("Password and Confirm Password doesn't match")
    return attrs

  def create(self, validate_data):
    return User.objects.create_user(**validate_data)


class UserLoginSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(max_length=255)
  role = serializers.CharField(max_length=255)
  class Meta:
    model = User
    fields = ['email', 'password','role']


class UserProfileExtradetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['address', 'contact']


class UserProfileSerializer(serializers.ModelSerializer):
    # profile = UserProfileExtradetailsSerializer(required=False)
    class Meta:
        model = User
        fields = ['id', 'email', 'name']


class UserChangePasswordSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    new_password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    confirm_new_password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['current_password', 'new_password', 'confirm_new_password']

    def validate(self, attrs):
        user = self.instance
        password = attrs.get('new_password')
        password2 = attrs.get('confirm_new_password')
        if not user.check_password(attrs.get('current_password')):
            raise serializers.ValidationError({'current_password': 'Current password is incorrect.'})
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password don't match")
        if user.check_password(attrs.get('new_password')):
            raise serializers.ValidationError({'Current password and new password can not be same'})
        user.set_password(password)
        user.save()
        return attrs



class SendPasswordResetEmailSerializer(serializers.Serializer):
  email = serializers.EmailField(max_length=255)
  class Meta:
    fields = ['email']
  def validate(self, attrs):
      user = self.context.get('user')
      uid = urlsafe_base64_encode(force_bytes(user.id))
      token = PasswordResetTokenGenerator().make_token(user)
      link = f'http://localhost:5173/reset-password/{uid}/{token}/'
      # # Send EMail
      body = 'Click Following Link to Reset Your Password '+link
      data = {
        'subject':'Reset Your Password',
        'body':body,
        'to_email':user.email,
      }
      send_email_to_client(data)
      return attrs


class UserPasswordResetSerializer(serializers.Serializer):
  password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  class Meta:
    fields = ['password']

  def validate(self, attrs):
    try:
      password = attrs.get('password')
      uid = self.context.get('uid')
      token = self.context.get('token')
      id = smart_str(urlsafe_base64_decode(uid))
      user = User.objects.get(id=id)
      if not PasswordResetTokenGenerator().check_token(user, token):
        raise serializers.ValidationError('Token is not Valid or Expired')
      user.set_password(password)
      user.save()
      return attrs
    except DjangoUnicodeDecodeError as identifier:
      PasswordResetTokenGenerator().check_token(user, token)
      raise serializers.ValidationError('Token is not Valid or Expired')





class TravelplanSerializer(serializers.ModelSerializer):
    class Meta:
        model = travelplan
        fields = '__all__'#['destination','cost','description']


class BookingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = bookings
        fields = '__all__'

class BookingDetailByUserId(serializers.ModelSerializer):
    travel_plan = TravelplanSerializer(source='planid',read_only=True)
    class Meta:
        model = bookings
        fields = ['userid','planid','travel_plan']



class BookingDetailsWithPlanSerializer(serializers.ModelSerializer):
    travel_plan = TravelplanSerializer(source='planid', read_only=True)

    class Meta:
        model = bookings
        fields = ['id','travel_plan']

class UserDetailsWithBookingsSerializer(serializers.ModelSerializer):
    bookings = BookingDetailsWithPlanSerializer(source='bookings_set', many=True)

    class Meta:
        model = User
        fields = ['id','name', 'email', 'bookings']


# class UserLoginViewSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['email','password']
