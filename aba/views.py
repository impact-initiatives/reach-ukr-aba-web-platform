from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect
from .models import *
from .forms import *
import json

@csrf_protect
def aba_interviews(request):

    if request.method == 'POST':
        form = PolygonForm(request.POST)
        if form.is_valid():
            polygon = Polygon.objects.create(
                name=form.cleaned_data['name'],
                info=form.cleaned_data['info'],
                polygon=json.loads(form.cleaned_data['polygon'])
            )

    else:
        form = PolygonForm()

    return render(request, 'custom/aba-interviews.html', {'form': form})


@csrf_protect
def aba_map(request):

    if request.method == 'POST':
        form = PolygonForm(request.POST)
        if form.is_valid():
            polygon = Polygon.objects.create(
                name=form.cleaned_data['name'],
                info=form.cleaned_data['info'],
                polygon=json.loads(form.cleaned_data['polygon'])
            )

    else:
        form = PolygonForm()

    return render(request, 'custom/aba.html', {'form': form})