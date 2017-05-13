from .models import *
from rest_framework import serializers


class RQSerializer(serializers.ModelSerializer):

    class Meta:

        model = ResearchQuestion
        fields = '__all__'