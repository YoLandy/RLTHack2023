from flask import Flask
from route import app_route
from flask_cors import CORS

app = Flask(__name__)
app.register_blueprint(app_route)
CORS(app)

if __name__ == '__main__':
    app.run(host='localhost', port=8080)


@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res
