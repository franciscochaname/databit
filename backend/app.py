from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db_connection
import jwt
import datetime
import bcrypt  # Necesario para encriptar

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'mi_clave_secreta_super_segura'

# --- RUTA DE LOGIN ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    dni = data.get('dni')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM usuarios WHERE dni = %s", (dni,))
    user = cursor.fetchone()
    conn.close()

    # Verificamos contraseña (ahora soportará encriptadas)
    if user:
        # Si la contraseña en DB empieza con $2b$, es un hash de bcrypt
        es_valida = False
        if user['password'].startswith('$2b$'):
            if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                es_valida = True
        elif user['password'] == password: # Soporte para usuarios de prueba sin encriptar
            es_valida = True

        if es_valida:
            token = jwt.encode({
                'id_usuario': user['id_usuario'],
                'rol': user['id_rol'], # 1:Admin, 2:Usuario, 3:Analista
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
            }, app.config['SECRET_KEY'], algorithm="HS256")
            return jsonify({'success': True, 'token': token})

    return jsonify({'success': False, 'message': 'Credenciales incorrectas'}), 401

# --- NUEVA RUTA DE REGISTRO ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    
    # 1. Encriptar la contraseña
    # Convertimos la contraseña a bytes y generamos el hash
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # 2. Insertar en la Base de Datos
        # Asignamos id_rol = 2 por defecto (Usuario)
        sql = """INSERT INTO usuarios 
                 (nombre, apellido, dni, telefono, correo, direccion, password, id_rol) 
                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
        
        val = (data['nombre'], data['apellido'], data['dni'], data['telefono'], 
               data['correo'], data['direccion'], hashed_password, 2)
        
        cursor.execute(sql, val)
        conn.commit() # ¡Importante para guardar cambios!
        conn.close()
        
        return jsonify({'success': True, 'message': 'Usuario registrado exitosamente'})

    except Exception as e:
        conn.close()
        # Si el DNI o Correo ya existen, MySQL dará error
        print(f"Error en registro: {e}")
        return jsonify({'success': False, 'message': 'El DNI o Correo ya están registrados'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)