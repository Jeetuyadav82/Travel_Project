from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .permissions import IsAdminUser,IsNormalUser
from .models import User, travelplan, bookings, BlacklistedAccessToken
from .renderers import UserRenderer
from .serializers import UserRegistrationSerializer,UserLoginSerializer,UserProfileSerializer,UserChangePasswordSerializer, SendPasswordResetEmailSerializer, UserPasswordResetSerializer, TravelplanSerializer, BookingsSerializer,BookingDetailByUserId,UserDetailsWithBookingsSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
import logging
from django.contrib.auth import logout
from django.contrib.auth import authenticate
logger = logging.getLogger(__name__)



def get_tokens_for_user(user):
  refresh = RefreshToken.for_user(user)
  return {
      'refresh': str(refresh),
      'access': str(refresh.access_token),
  }

class UserRegistrationView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({'token':token, 'msg':'Registration Successful'}, status=status.HTTP_201_CREATED)

    return Response({'errors': {'non_field_errors': ['Email or Password is not Valid']}},
                    status=status.HTTP_404_NOT_FOUND)


class UserLoginView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.data.get('email')
    password = serializer.data.get('password')
    role = serializer.data.get('role')
    user = authenticate(email=email, password=password)
    if user is not None:
        if user.is_admin or user.is_staff:
            user_type = "admin"
        else:
            user_type = "normal_user"
        if role == user_type:
          token = get_tokens_for_user(user)
          response_data = {
              'token': token,
              'msg': 'Login Success',
              'user_type': user_type,
              'user_id': user.id  # Include user ID in the response
          }
          return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'errors': {'non_field_errors': ['Email or Password is not Valid']}},
                            status=status.HTTP_404_NOT_FOUND)

    else:
      return Response({'errors':{'non_field_errors':['Email or Password is not Valid']}}, status=status.HTTP_404_NOT_FOUND)

class UserProfileView(APIView):
    renderer_classes = [UserRenderer]

    def get(self, request, format=None,pk=None):
        user = User.objects.get(id = pk)
        serializer = UserProfileSerializer(user)
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None,pk=None):
        user = User.objects.get(id = pk)
        serializer = UserChangePasswordSerializer(user, data=request.data)
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'detail': 'Password has been changed successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        if User.objects.filter(email=request.data.get('email')).exists():
            user = User.objects.get(email=request.data.get('email'))
            serializer = SendPasswordResetEmailSerializer(data=request.data,context={'user':user})
            serializer.is_valid(raise_exception=True)
            return Response({'msg': 'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)
        return Response({"msg" : 'email is not registered'})

class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, uid, token, format=None):
        print(uid,token,"================")
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid': uid, 'token': token})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset Successfully'}, status=status.HTTP_200_OK)





    # def put(self, request, format = None, pk= None):
    #     data = request.data
    #     usr = User.objects.get(id=pk)
    #     serializer = UserSerializer(usr, data=data)
    #     self.permission_classes = [IsAuthenticated]
    #     self.check_permissions(request)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({"msg : user updated"})
    #     return Response(serializer.errors)
    #
    # def patch(self, request, format=None, pk=None):
    #     data = request.data
    #     usr = User.objects.get(id=pk)
    #     serializer = UserSerializer(usr, data=data, partial=True)
    #     self.permission_classes = [IsAuthenticated]
    #     self.check_permissions(request)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({"msg :partial user updated"})
    #     return Response(serializer.errors)
    #
    # def delete(self, request, format = None, pk = None):
    #     usr = User.objects.get(id=pk)
    #     self.permission_classes = [IsAuthenticated]
    #     self.check_permissions(request)
    #     usr.delete()
    #     return Response({"msg : user deleted"})


class TravelPlanApi(APIView):
    def get(self, request, format = None, pk = None):
        id = pk
        if id:
            plan = travelplan.objects.get(id= id)
            serializer = TravelplanSerializer(plan)
            return Response(serializer.data)

        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        plan = travelplan.objects.all()
        serializer = TravelplanSerializer(plan,many=True)
        return Response(serializer.data)

    def post(self, request, format = None):
        data = request.data
        serializer = TravelplanSerializer(data = data)
        self.permission_classes = [IsAuthenticated, IsAdminUser]
        self.check_permissions(request)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg : plan added"})
        return Response(serializer.errors)

    def put(self, request, format = None, pk= None):
        data = request.data
        id = pk
        plan = travelplan.objects.get(id= id)
        serializer = TravelplanSerializer(plan, data=data)
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg : plan updated"})
        return Response(serializer.errors)

    def patch(self, request, format=None, pk=None):
        data = request.data
        id = pk
        plan = travelplan.objects.get(id=id)
        serializer = TravelplanSerializer(plan, data=data, partial=True)
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg : partial plan updated"})
        return Response(serializer.errors)

    def delete(self, request, format = None, pk = None):
        id = pk
        plan = travelplan.objects.get(id=id)
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        plan.delete()
        return Response({"msg : plan deleted"})

class BookingApi(APIView):
    def get(self, request, format = None, pk = None):
        # self.permission_classes = [IsAuthenticated]
        # self.check_permissions(request)
        id = pk
        if id:
            book = bookings.objects.get(id= id)
            serializer = BookingsSerializer(book)
            return Response(serializer.data)

        book = bookings.objects.all()
        serializer = BookingsSerializer(book,many=True)
        return Response(serializer.data)

    def post(self, request, format = None):
        data = request.data
        serializer = BookingsSerializer(data = data)
        self.permission_classes = [IsAuthenticated,IsNormalUser]
        self.check_permissions(request)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg : booking added"})
        return Response(serializer.errors)

    def put(self, request, format = None, pk= None):
        data = request.data
        id = pk
        book = BookingsSerializer.objects.get(id= id)
        serializer = BookingsSerializer(book, data=data)
        # self.permission_classes = [IsAuthenticated]
        # self.check_permissions(request)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg : booking updated"})
        return Response(serializer.errors)

    def patch(self, request, format=None, pk=None):
        data = request.data
        id = pk
        book = bookings.objects.get(id=id)
        serializer = BookingsSerializer(book, data=data, partial=True)
        # self.permission_classes = [IsAuthenticated]
        # self.check_permissions(request)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg : partial booking updated"})
        return Response(serializer.errors)

    def delete(self, request, format = None, pk = None):
        id = pk
        book = bookings.objects.get(id=id)
        serializer = BookingsSerializer(book)
        self.permission_classes = [IsAuthenticated, IsNormalUser]
        self.check_permissions(request)
        book.delete()
        return Response({"msg : booking deleted"})

class BookedUserApi(APIView):
    def get(self,request, format=None, pk=None):
        id = pk
        if id:
            booked_for_user = bookings.objects.filter(userid=id)
            serializer = BookingDetailByUserId(booked_for_user,many=True)
            return Response(serializer.data)
        booked_for_user = bookings.objects.all()
        serializer = BookingDetailByUserId(booked_for_user,many=True)
        return Response(serializer.data)


class UserDetailsWithBookings(APIView):
    def get(self, request, format=None,pk=None):
        datas,dct=[],{}
        if pk:
            usr = User.objects.get(id=pk)
            serializer = UserDetailsWithBookingsSerializer(usr)
            self.permission_classes = [IsAuthenticated, IsNormalUser]
            self.check_permissions(request)
            dct = {'id': serializer.data['id'],'name': serializer.data['name'], 'email': serializer.data['email'], 'bookings': []}
            for bookng in serializer.data['bookings']:
                if bookng:
                    bookng['travel_plan']['id'] = bookng['id'] # here i am replacing the plan id with booking id
                    dct['bookings'].append(bookng['travel_plan'])

            datas.append(dct)
            return Response(datas)

        all_users = User.objects.all()
        serializer = UserDetailsWithBookingsSerializer(all_users, many=True)
        self.permission_classes = [IsAuthenticated,IsAdminUser]
        self.check_permissions(request)
        for user_data in serializer.data:
            dct = {'id':user_data['id'], 'name': user_data['name'], 'email': user_data['email'], 'bookings': []}
            for booking in user_data['bookings']:
                if booking:
                    booking['travel_plan']['id'] = booking['id'] # here i am replacing the plan id with booking id
                    dct['bookings'].append(booking['travel_plan'])
            datas.append(dct)
        return Response(datas)


# Backend View

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            access_token = request.data.get("access_token")

            # Blacklist refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            # Blacklist access token
            BlacklistedAccessToken.objects.create(token=access_token)

            # Log out the user from the session
            logout(request)

            return Response({'message': 'Logged out successfully'}, status=200)

        except Exception as e:
            logger.error(f"Logout error: {e}")
            return Response({f"error: An error occurred during logout,{e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class UserLoginView(APIView):
#     def post(self, request, format=None):
#         serializer = UserLoginViewSerializer(data=request.data)
#         if serializer.is_valid():
#             email = serializer.data.get('email')
#             password = serializer.data.get('password')
#             user = authenticate(email=email, password=password)
#             print("user",user,email,password)
#             if user:
#                 return Response({"msg : Login successfull"})
#             else:
#                 return Response({"email or password do not match"})
#         else:
#             return Response(serializer.errors)








# class LoginAPIView(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')
#         role = request.data.get('role')
#
#         if role == 'superuser':
#             # Authenticate against the superuser model
#             usr = authenticate(request, email=email, password=password)
#             if usr is not None:
#                 # Authentication successful
#                 return Response({'success': True, 'message': 'Login successful', 'role': role})
#             else:
#                 # Authentication failed
#                 return Response({'success': False, 'message': 'Invalid credentials'},
#                                 status=status.HTTP_400_BAD_REQUEST)
#
#
#         else:
#             # Authenticate against the custom user model
#             users = user.objects.filter(email=email)
#             serializer = UserSerializer(users,many=True)
#             logger.info(serializer.data)
#             for usr in serializer.data:
#                 if usr is not None and usr['password'] == password:
#                     # Authentication successful
#                     return Response({'success': True, 'message': 'Login successful', 'role': role})
#             else:
#                     # Authentication failed
#                     return Response({'success': False, 'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
#



