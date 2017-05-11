from __future__ import unicode_literals

from django.db import models
from django.contrib.postgres.fields import JSONField


class Polygon(models.Model):

    name = models.CharField(max_length=80, blank=True, null=True)
    info = models.CharField(max_length=280, blank=True, null=True)
    polygon = JSONField()

    def __unicode__(self):
        return self.name

    class Meta:
        db_table = 'polygons'