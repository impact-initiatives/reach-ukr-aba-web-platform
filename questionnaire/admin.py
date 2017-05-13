from django.contrib import admin
from .models import *


class Indicatorsinline(admin.TabularInline):
    model = Indicator

class ResearchQuestionAdmin(admin.ModelAdmin):

    inlines = [
        Indicatorsinline,
    ]

    model = ResearchQuestion

admin.site.register(ResearchQuestion,ResearchQuestionAdmin)

admin.site.register([
    Question,
    IndicatorType
])