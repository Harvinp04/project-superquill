# project-superquill
STEM-Focused Notetaking App developed by the MacAI 2024 Competitive Team.

## Requirements to build project and run locally:
  - Node.js (LTS Version)
  - Expo Go ( Installed on the device being used to preview the app )
  - Python 

## Building & Running Frontend UI 


- cd into squill-ui directory then run:
```sh
npm install
```

- Starting Expo: will produce a QR code, when scanned on a device with the Expo Go app will load preview mode of app.
- cd into squill-ui directory then run: 
```sh
npx expo start --tunnel
```

## Building & Running Backend 
- cd into squill directory then run:


```sh
flask run --host=0.0.0.0 --port=8000
```
- Flask will display the http url where it is running, update the post request in squill-ui with this url in order to communicate with the backend.

- ensure Flask is installed with:

```sh
 pip install Flask
```




