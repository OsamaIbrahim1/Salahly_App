import * as dotenv from 'dotenv'

dotenv.config()

export const PORT = +process.env.PORT

export const DB_CONNECTION = process.env.DB_CONNECTION

export const DB_CONNECTION_HOST = process.env.DB_CONNECTION_HOST

export const SALT_ROUNDS = +process.env.SALT_ROUNDS

export const SECRET_VERIFICATION_TOKEN = process.env.SECRET_VERIFICATION_TOKEN

export const TIME_EXPIRE_TOKEN = process.env.TIME_EXPIRE_TOKEN

export const SECRET_LOGIN_TOKEN = process.env.SECRET_LOGIN_TOKEN 

export const PREFIX_LOGIN_TOKEN = process.env.PREFIX_LOGIN_TOKEN 

export const CLOUD_NAME = process.env.CLOUD_NAME

export const API_KEY = process.env.API_KEY

export const API_SECRET = process.env.API_SECRET

export const MAIN_FOLDER = process.env.MAIN_FOLDER

export const SALT_ROUNDS_FOR_CODE_RESET_PASSWORD = +process.env.SALT_ROUNDS_FOR_CODE_RESET_PASSWORD

export const RESET_TOKEN = process.env.RESET_TOKEN

export const TIME_EXPIRE_TOKEN_FOR_RESET_PASSWORD = process.env.TIME_EXPIRE_TOKEN_FOR_RESET_PASSWORD