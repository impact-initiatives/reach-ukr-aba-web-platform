from django.shortcuts import render
from .models import *
from aba.models import *
from aba.forms import PolygonForm
from django.views.decorators.csrf import csrf_protect
import json

def draw(request):
    return render(
        request,
        'custom/draw.html'
    )

@csrf_protect
def points(request):

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