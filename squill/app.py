from flask import Flask, request
import base64, json,random 

app = Flask(__name__)


@app.route('/upload-image', methods=['POST'])
def upload_image():
    data = request.data.decode('utf-8')
    encoded_image = json.loads(data).get('image')

    image = base64.b64decode(encoded_image)
    filename = 'img'+str(random.randint(0,100000))+'.png'  # Temporary way to save & preview images 

    with open(filename, 'wb') as f:
        f.write(image)
    
    return 'Raw data received'



if __name__ == '__main__':
    app.run()


# Commands to test the app 



# In case you want to test the api from cli, you can use curl like below: 
# curl -X POST -H "Content-Type: application/json" -d '{"image": "your_base64_image_data"}' http://127.0.0.1:5000/upload-image


# ** FOR LOCAL TESTING ** run this command to start backend, copy the ipv4 and paste into the POST request handler on the frontend (e.g http://??.?.?.???:8000/upload-image) 

#flask run --host=0.0.0.0 --port=8000
