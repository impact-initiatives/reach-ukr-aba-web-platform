from __future__ import unicode_literals

from django.db import models
from django.contrib.postgres.fields import JSONField


class ResearchQuestion(models.Model):

    rq_id = models.CharField(max_length=30, blank=True, null=True)
    research_question = models.CharField(max_length=280, blank=True, null=True)

    def __unicode__(self):
        return self.research_question

    class Meta:
        db_table = 'research_questions'

class IndicatorType(models.Model):

    indicator_type = models.CharField(max_length=80, blank=True, null=True)

    def __unicode__(self):
        return self.indicator_type

    class Meta:
        db_table = 'indicator_types'

class Indicator(models.Model):

    indicator_id = models.CharField(max_length=30, blank=True, null=True)
    indicator = models.CharField(max_length=280, blank=True, null=True)
    disaggregated_by = models.CharField(max_length=280, blank=True, null=True)
    indicator_type = models.ForeignKey(IndicatorType)
    research_question = models.ForeignKey(ResearchQuestion)

    def __unicode__(self):
        return self.research_question

    class Meta:
        db_table = 'indicators'

class QuestionType(models.Model):

    type = models.CharField(max_length=80, blank=True, null=True)

    def __unicode__(self):
        return self.type

    class Meta:
        db_table = 'question_types'

class Question(models.Model):

    question_id = models.CharField(max_length=80, blank=True, null=True)
    question = models.CharField(max_length=80, blank=True, null=True)
    question_rus = models.CharField(max_length=280, blank=True, null=True)
    type = models.ForeignKey(QuestionType)

    def __unicode__(self):
        return self.question

    class Meta:
        db_table = 'questions'


class Settlements(models.Model):

    admin4 = models.BigIntegerField(blank=True, null=True)
    admin4_name = models.CharField(max_length=80, blank=True, null=True)
    # admin4_prev_name = models.CharField(max_length=80, blank=True, null=True)
    admin1_name = models.CharField(max_length=80, blank=True, null=True)
    admin2_name = models.CharField(max_length=80, blank=True, null=True)
    admin2_type = models.CharField(max_length=80, blank=True, null=True)

    def __unicode__(self):
        return '%s (%s %s)' % (self.admin4_name, self.admin2_name, self.admin2_type)

    class Meta:
        db_table = 'Settlements'


class ABAEducation(models.Model):

    admin4 = models.BigIntegerField(blank=True, null=True)
    admin4_name = models.CharField(max_length=80, blank=True, null=True)
    admin1_name = models.CharField(max_length=80, blank=True, null=True)
    admin2_name = models.CharField(max_length=80, blank=True, null=True)

    name_KI = models.CharField(max_length=80, blank=True, null=True)
    phone = models.CharField(max_length=80, blank=True, null=True)

    info = models.CharField(max_length=500, blank=True, null=True)

    question = models.CharField(max_length=500, blank=True, null=True)



    def __unicode__(self):
        return '%s (%s %s)' % (self.admin4_name, self.admin2_name, self.admin2_type)

    class Meta:
        db_table = 'ABA_Education'