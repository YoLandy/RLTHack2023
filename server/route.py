from flask import Blueprint
from flask import Flask, request, Response
import flask
import json
from handler import handler


app_route = Blueprint('route', __name__)


@app_route.route('/', methods=['POST'])
async def handle():
    data = json.loads(request.data)
    print(data)

    result = await handler.result_handler(data)
    print(result)

    return result

