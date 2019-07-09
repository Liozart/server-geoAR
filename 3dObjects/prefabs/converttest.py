import requests
url = 'https://gltfapi.co/v1/models'
file = open('chair.obj', 'rb')
r = requests.post(url=url, files={'file': file})
print(r.text)