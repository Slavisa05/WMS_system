from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        try:
            return request.user.zaposleni.pozicija.naziv == 'Admin'
        except:
            return False
    

class IsMenadzer(BasePermission):
    def has_permission(self, request, view):
        try:
            return request.user.zaposleni.pozicija.naziv in ['Admin', 'Menadzer']
        except: 
            return False
        

class IsZaposlen(BasePermission):
    def has_permission(self, request, view):
        try:
            return request.user.zaposleni is not None
        except:
            return False