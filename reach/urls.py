# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from cms.sitemaps import CMSSitemap
from django.conf import settings
from django.conf.urls import include, url, patterns
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.static import serve
from .views import *

admin.autodiscover()


urlpatterns = [
    url(r'^draw/$', draw),
    url(r'^submission/$', submission),
    url(r'^sitemap\.xml$', sitemap,
        {'sitemaps': {'cmspages': CMSSitemap}}),
    url(r'^admin/', include(admin.site.urls)),  # NOQA
    url(r'^aba/', include('aba.urls', namespace='aba', app_name='aba')),
    url(r'^questionnaire/', include('questionnaire.urls', namespace='questionnaire', app_name='questionnaire')),
    url(r'^', include('cms.urls')),

]

# i18n_
# urlpatterns += patterns(
#     url(r'^admin/', include(admin.site.urls)),  # NOQA
#     url(r'^', include('cms.urls')),
# )

# This is only needed when using runserver.
if settings.DEBUG:
    urlpatterns = [
        url(r'^media/(?P<path>.*)$', serve,
            {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
        ] + staticfiles_urlpatterns() + urlpatterns
