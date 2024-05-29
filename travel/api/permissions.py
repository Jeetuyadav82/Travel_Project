from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)



class IsNormalUser(BasePermission):
    """
    Allows access only to normal users (not admin).
    """
    def has_permission(self, request, view):
        return bool(request.user and not request.user.is_staff)