from django.conf.urls import url, include
from .views import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'questions', RQViewSet)

urlpatterns = [
    url(r'^$', upload),
    url(r'^import/$', import_sheet),
    url(r'^', include(router.urls))
]

