import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Access individual environment variables
mysql_host = os.getenv("MYSQL_HOST")
mysql_user = os.getenv("MYSQL_USER")
mysql_password = os.getenv("MYSQL_PASSWORD")
mysql_database = os.getenv("MYSQL_DATABASE")

print("test")
# Print the values
print(f"MYSQL_HOST: {mysql_host}")
print(f"MYSQL_USER: {mysql_user}")
print(f"MYSQL_PASSWORD: {mysql_password}")
print(f"MYSQL_DATABASE: {mysql_database}")