from django.conf.urls import url, include
from .views import *

urlpatterns = [
    url(r'^$', aba_map),
    url(r'^interviews/', aba_interviews)
]
