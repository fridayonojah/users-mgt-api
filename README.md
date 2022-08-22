# User Management Rest Api with NodeJs, Express and Mysql

### Tech

This Api uses a number of open source projects to work properly:

* [node.js]
* [Express]
* [mysql2]
* [bcryptjs]
* [jsonwebtoken]
* [dotenv]
* [cors]
* [joi]

### Getting Started

``` sh
# Clone this repo to your local machine using
git clone git@github.com:Juliest88/mysql-node-express.git

# Get into the directory
cd mysql-node-express

# Make it your own
rm -rf .git && git init

# Coppy .env-example and create your own .env file
cp .env-example .env

# Edit .env file and add your mysql username, mysql password and db name
vi .env
# you can edit the file also via text editor

# Get into the db directory
cd src/db

# Import mysql database using Command line
mysql -u [db_username] -p[db_password] < user-db.sql
# you can edit the file if you want to change the db_name
# if you are using a different db_name and it elready exists,
# you can comment the first two lines, remain the line => USE test_db;
# and just change the db_name

# Install dependencies
npm install

# Run the server locally
npm start

