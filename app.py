import os, signal
from waitress import serve
from werkzeug.middleware.proxy_fix import ProxyFix
from flask import Flask, render_template, redirect, request

app = Flask(__name__,
    static_folder='static',
    template_folder='templates')

app.config['SECRET_KEY'] = os.urandom(24)
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 31536000
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

@app.after_request
def add_security_headers(response):
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; font-src 'self' https://cdnjs.cloudflare.com; img-src 'self' data:;"

    if request.is_secure:
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

@app.route('/')
def index():
    return render_template('index.html')

@app.errorhandler(500)
def server_error(e):
    return redirect('/')

@app.errorhandler(404)
def page_not_found(e):
    return redirect('/')

@app.route('/<path:path>')
def catch_all(path):
    return redirect('/')

def shutdown_handler(signal_received, frame): exit(0)
signal.signal(signal.SIGTERM, shutdown_handler)
signal.signal(signal.SIGINT, shutdown_handler)

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=1337)
