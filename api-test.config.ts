import dotenv from 'dotenv'
import path from 'path';
dotenv.config({path : path.resolve(__dirname,'.env')})

const processENV = process.env.TEST_ENV
const env = processENV || 'qa'
console.log(`The environment is ${env}`);


const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: process.env.USER_EMAIL as string,
    userPassword: process.env.USER_PASSWORD as string
}

if(env === 'qa'){
    config.apiUrl='https://conduit-api.bondaracademy.com/api'
}

if(env === 'dev'){
    config.apiUrl='https://conduit-api.bondaracademy.com/api'
}

if(env === 'prod'){
    // if(!process.env.PROD_USERNAME || !process.env.PROD_PASSWORD){
    //     throw Error(`Missing required environment variables`)
    // }
    config.userEmail=process.env.PROD_USERNAME as string
    config.userPassword=process.env.PROD_PASSWORD as string
}

if(!config.userEmail || !config.userPassword){
    throw Error(`Missing credentials: set USER_EMAIL and USER_PASSWORD (or PROD_USERNAME/PROD_PASSWORD for prod) in .env`)
}

export {config}
