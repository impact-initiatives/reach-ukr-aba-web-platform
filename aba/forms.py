import re
from django import forms


class PolygonForm(forms.Form):

    name = forms.CharField(
        widget=forms.TextInput(attrs={'required': True, 'max_length': 10, 'class': 'form-control', 'placeholder': 'Name'}), label = ("Name"))
    info = forms.CharField(
        widget=forms.TextInput(attrs={'required': True, 'max_length': 200, 'class': 'form-control', 'placeholder': 'Info'}), label=("Info"))
    polygon = forms.CharField(
        widget=forms.Textarea(attrs={'required': True, 'class': 'form-control'}), label=("Polygon"))