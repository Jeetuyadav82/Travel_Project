"""
URL configuration for travel project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views
from django.urls import path, include
from django.urls import path
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('user/register/', views.UserRegistrationView.as_view(), name='register'),
    path('user/login/', views.UserLoginView.as_view(), name='login'),
    path('user/profile/<int:pk>/', views.UserProfileView.as_view(), name='profile'),
    path('user/changepassword/<int:pk>/', views.UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/',views.SendPasswordResetEmailView.as_view(),name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', views.UserPasswordResetView.as_view(), name='reset-password'),
    # path("user/", views.UserApi.as_view()),
    # path("users/<int:pk>/", views.UserApi.as_view()),
    path("travelplans/", views.TravelPlanApi.as_view()),
    path("travelplans/<int:pk>/", views.TravelPlanApi.as_view()),
    path("bookings/", views.BookingApi.as_view()),
    path("bookings/<int:pk>/", views.BookingApi.as_view()),
    path("bookings/user/", views.BookedUserApi.as_view()),
    path("bookings/user/<int:pk>/", views.BookedUserApi.as_view()),
    path("useralldetails/",views.UserDetailsWithBookings.as_view()),
    path("useralldetails/<int:pk>/",views.UserDetailsWithBookings.as_view()),
    path("userlogin/",views.UserLoginView.as_view()),
    #path("login/",views.LoginAPIView.as_view()),
    path('logout/', views.LogoutView.as_view(), name ='logout')
    # path("logout/",views.Logout.as_view()),
    # #path("api-auth/logout/", views.PatchLogoutView.as_view(), name="logout"),
    # path('api/auth/logout/', views.LogoutView.as_view(), name='logout'),
    # path("api/auth/", include("rest_framework.urls", namespace="rest_framework")),
]



