import os

services = {
    'mysql': {
        'url': os.getenv('MYSQL_URL'),
        'port': os.getenv('MYSQL_PORT'),
    },
    'backend': {
        'url': os.getenv('BACKEND_URL'),
        'port': os.getenv('BACKEND_PORT'),
    },
    'frontend': {
        'url': os.getenv('FRONTEND_URL'),
        'port': os.getenv('FRONTEND_PORT'),   
    }
}

for name, info in services.items():
    if name == 'mysql':
        print(f"To connect to the MySQL database, you can use the command:\nmysql -u root -p --port {info['port']} --protocol tcp")
    print(f'{name} can be found at {info["url"]}:{info["port"]}')

