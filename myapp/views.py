from django.shortcuts import render
import requests
import sys
import csv
from subprocess import run,PIPE
import pandas as pd
import json
import numpy as np
from django.utils.safestring import SafeString

# Create your views here.


def index(request):
    baseDataFrame = pd.read_csv('statedata.csv')
    CropsArray = baseDataFrame['Crop'].unique()
    YearsArray = baseDataFrame['Year'].unique()
    StatesArray = baseDataFrame['State'].unique()

    if request.POST.get('cmbYear') and request.POST.get('cmbCrop'):
        year = int(request.POST.get('cmbYear'))
        crop = str(request.POST.get('cmbCrop'))
    else:
        year = 2016
        crop = 'Arhar/Tur'

#intial Loading for State
    tableDistrict = baseDataFrame.loc[(baseDataFrame['Year'] == year) & (baseDataFrame['Crop'] == crop)]

    
    
    #initial Assignment for District
    tableState = tableDistrict.groupby(by=['State']).sum()
    tableCrop = baseDataFrame.loc[(baseDataFrame['Crop'] == crop)]
    tableCropSummary = tableCrop.groupby(['Year'])['Production'].sum()
    print(tableCropSummary)

    #JSON for States
    JSONState = tableState.reset_index().to_json(orient ='records')
    JSONStateData = []
    JSONStateData = json.loads(JSONState)

    #JSON for Districts
    JSONDistrict = tableDistrict.reset_index().to_json(orient ='records')
    JSONDistrictData = []
    JSONDistrictData = json.loads(JSONDistrict)

    #JSON For CropSummary
    JSONCrop = tableCropSummary.reset_index().to_json(orient ='records')
    JSONCropData = []
    JSONCropData = json.loads(JSONCrop)

    #dashboard numbers
    TotalProduction = tableDistrict['Production'].sum()
    CountDistricts = len(pd.unique(tableDistrict['District']))
    MaxProduction = tableDistrict['Production'].max()
    AverageProductionPerDistrict = int(MaxProduction)/int(CountDistricts)
    CountRecords = baseDataFrame['District'].count()
    CountUniqueDistricts = baseDataFrame['District'].unique().shape
        
    return render(request, 'dashboard.html',{'CD':CountUniqueDistricts[0],'CountRecords':CountRecords,'AP':float(AverageProductionPerDistrict),'MaxProduction':MaxProduction,'CountDistricts':CountDistricts,'TotalProduction':TotalProduction,'JSONCropData':JSONCropData,'JSONDistrictData':JSONDistrictData,'JSONStateData':JSONStateData, 'CropsArray': CropsArray, 'YearsArray':YearsArray,'StatesArray':StatesArray,'year':year,'crop':crop,'tableDistrict':tableDistrict,'tableState':tableState})

    
