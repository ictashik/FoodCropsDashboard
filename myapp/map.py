import geopandas as gpd
import matplotlib.pyplot as plt
import folium

import os
for dirname, _, filenames in os.walk('/kaggle/input'):
    for filename in filenames:
        print(os.path.join(dirname, filename))
dist = gpd.read_file('C:/Users/hp/PycharmProjects/pythonProject6/output.shp')
dist.head()
dist.isna().sum()
# Handling NA values
dist.distarea.fillna(dist.distarea.mean(), inplace=True)
dist.totalpopul.fillna(dist.totalpopul.mean(), inplace=True)
dist.totalhh.fillna(dist.totalhh.mean(), inplace=True)
dist.totpopmale.fillna(dist.totpopmale.mean(), inplace=True)
dist.totpopfema.fillna(dist.totpopfema.mean(), inplace=True)
dist.isna().sum()
dist.plot(figsize=(10,10))
plt.show()
