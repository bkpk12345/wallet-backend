# wallet-backend

## Database used **Mongodb**

### - Default database Url = mongodb://localhost:27017. Can be changed in .env file

### - Server is running on default port 8001. Can be changed in ,env file

## How to initialise Project

### Step 1- npm install

### Step 2- npm start

## Your server will run on port 8001 and the base URL is https://wallet1.onrender.com/

## APIS to hit

### 1. To setup the wallet with initial amount

POST https://wallet1.onrender.com/api/setup

Content-Type: application/json

{
"balance":100,
"name":"new data"
}

### 2. To get the wallet details

GET https://wallet1.onrender.com/api/wallet/63a3db0d21051bc786965153

### 3. To do the transaction. Credit or debit amount

POST https://wallet1.onrender.com/api/transact/63a3db0d21051bc786965153

Content-Type: application/json

{
"amount":-10,
"name":"new data"
}

### 4. To get all the transactions

GET https://wallet1.onrender.com/api/transactions?walletId=63a3db0d21051bc786965153&skip=0&limit=10
