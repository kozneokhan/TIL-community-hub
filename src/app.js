import express from 'express';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import expressMySQLSession from 'express-mysql-session';
import dotEnv from 'dotenv';
import UsersRouter from '../routes/users.router.js';
import logMiddelware from './middlewares/log.middelware.js';
import errorHandlingMiddleware from './middlewares/error-handling.middleware.js';
import PostsRouter from '../routes/posts.router.js';
import CommentsRouter from '../routes/comments.router.js';

// .env에 있는 여러 값들을, process.env 객체 안에 추가하게 됩니다.
dotEnv.config();

const app = express();
const PORT = 3018;

const MySQLStorage = expressMySQLSession(expressSession);
const sessionStore = new MySQLStorage({
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    expiration: 1000 * 60 * 60 * 24,
    createDatabaseTable: true,
}); // 우리가 어떤 MySQL을 사용할지?

app.use(logMiddelware);
app.use(express.json());
app.use(cookieParser());
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1일 동안 사용할 수 있도록 설정합니다.
        },
    })
);
app.use('/api', [UsersRouter, PostsRouter, CommentsRouter]);
app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 정상적으로 열렸습니다.');
});
