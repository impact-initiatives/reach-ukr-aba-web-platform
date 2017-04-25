from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect
from .models import *
from .forms import *

@csrf_protect
def polygon_entry(request):

    if request.method == 'POST':
        form = PolygonForm(request.POST)

        Polygon.objects.create(
            name='Name',
            info='Some Info',
            polygon='{}'
        )

    else:
        form = PolygonForm()

    return render(request, 'custom/aba.html', {'form': form})