from django import forms
from .models import Voter

class DocumentUploadForm(forms.ModelForm):
    class Meta:
        model = Voter
        fields = ['aadhar_document', 'pan_document', 'voter_id_document']