from django.shortcuts import render
from django import forms

from django.http import HttpResponseBadRequest, HttpResponse
import django_excel as excel
from .models import *

from .serializers import *

from rest_framework import viewsets
from rest_framework.permissions import AllowAny

class UploadFileForm(forms.Form):
    file = forms.FileField()

# Create your views here.
def upload(request):
    if request.method == "POST":
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            filehandle = request.FILES['file']
            return excel.make_response(filehandle.get_sheet(), "csv", file_name="download")
    else:
        form = UploadFileForm()
    return render(request, 'upload_form.html', {'form': form})


def import_sheet(request):
    if request.method == "POST":
        form = UploadFileForm(request.POST,
                              request.FILES)
        if form.is_valid():
            request.FILES['file'].save_to_database(
                name_columns_by_row=2,
                model=Settlements,
                mapdict=['admin4', 'admin4_name', 'admin1_name', 'admin2_name', 'admin2_type'])
            return HttpResponse("OK")
        else:
            return HttpResponseBadRequest()
    else:
        form = UploadFileForm()
    return render(
        request,
        'upload_form.html',
        {'form': form})

class RQViewSet(viewsets.ModelViewSet):
    queryset = ResearchQuestion.objects.all()
    serializer_class = RQSerializer
    # permission_classes = (AllowAny,)
    pagination_class = None
