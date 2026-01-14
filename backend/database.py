import mysql.connector
import os
from dotenv import load_dotenv

# 1. Cargar las variables del archivo .env
load_dotenv()

def get_db_connection():
    
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),      # Lee del archivo .env
            user=os.getenv('DB_USER'),      # Lee del archivo .env
            password=os.getenv('DB_PASSWORD'), # Lee del archivo .env
            database=os.getenv('DB_NAME')   # Lee del archivo .env
        )
        return connection

    except mysql.connector.Error as err:
        print(f"❌ Error crítico de Base de Datos: {err}")
        return None

# Solo para probar si este archivo funciona individualmente
if __name__ == "__main__":
    conn = get_db_connection()
    if conn and conn.is_connected():
        print("✅ Conexión exitosa usando Variables de Entorno")
        conn.close()