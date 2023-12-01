import express from 'express';
import cookieParser from 'cookie-parser';
import UsersRouter from '../routes/users.router.js';
import logMiddelware from './middlewares/log.middelware.js';
import errorHandlingMiddleware from './middlewares/error-handling.middleware.js';
import PostsRouter from '../routes/posts.router.js';
import CommentsRouter from '../routes/comments.router.js';

const app = express();
const PORT = 3018;

app.use(logMiddelware);
app.use(express.json());
app.use(cookieParser());
app.use('/api', [UsersRouter, PostsRouter, CommentsRouter]);
app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 정상적으로 열렸습니다.');
});
