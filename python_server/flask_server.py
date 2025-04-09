from flask import Flask, jsonify, request
from flask_cors import CORS
from bot import run_bot
import re

app = Flask(__name__)
CORS(app)

@app.route("/obtener-codigo", methods=['POST'])
def obtener_codigo():
    data = request.get_json()
    service = data.get('service')
    email = data.get('email')

    # Definir el regex para identificar "Disney" o "Star"
    disney_star_regex = re.compile(r'(Disney|Star)', re.IGNORECASE)

    # Mapear los servicios a códigos
    service_codes = {
        'Star Plus': 'star+',
        'Disney Plus': 'disney+'
    }

    # Validar si el servicio contiene "Disney" o "Star"
    match = disney_star_regex.search(service)
    if match:
        if "star" in service.lower():
            service = service_codes.get('Star Plus')
        elif "disney" in service.lower():
            service = service_codes.get('Disney Plus')

    # Ejecutar el bot con el servicio mapeado y el email
    verification_code = run_bot(service, email)

    return jsonify({'text': '{}'.format(verification_code)})

if __name__ == '__main__':
    app.run(port=5000)
    # app.run(ssl_context='adhoc') en caso de ser https y que genere error
