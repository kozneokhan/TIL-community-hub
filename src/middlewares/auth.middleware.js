import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';

export default async function (req, res, next) {
    try {
        // 1. 클라이언트로 부터 **쿠키(Cookie)**를 전달받습니다.
        const { authorization } = req.cookies;

        // 2. **쿠키(Cookie)**가 **Bearer 토큰** 형식인지 확인합니다.
        const [tokenType, token] = authorization.split(' ');
        if (tokenType !== 'Bearer') throw new Error('토큰 타입이 일치하지 않습니다.');

        // 3. 서버에서 발급한 **JWT가 맞는지 검증**합니다.
        const decodedToken = jwt.verify(token, 'customized_secret_key');
        const userId = decodedToken.userId;

        // 4. JWT의 `userId`를 이용해 사용자를 조회합니다.
        const user = await prisma.users.findFirst({
            where: { userId: +userId },
        });

        if (!user) {
            req.clearCookie('authorization');
            throw new Error('토큰 사용자가 존재하지 않습니다.');
        }

        // 5. `req.user` 에 조회된 사용자 정보를 할당합니다.
        req.user = user;

        // 6. 다음 미들웨어를 실행합니다.
        next();
    } catch (error) {
        res.clearCookie('authorization'); // 특정 쿠키를 삭제시킵니다.
        switch (error.name) {
            case 'TokenExpiredError': // 토큰이 만료되었을 때 발생하는 에러
                return res.status(401).json({ message: '토큰이 만료되었습니다.' });
                break;
            case 'JsonWebTokenError': // 토큰 검증에 실패했을 때, 발생하는 에러
                return res.status(401).json({ message: '토큰 인증에 실패하였습니다.' });
                break;
            default:
                return res.status(401).json({ message: error.message ?? '비정상적인 요청입니다.' });
        }
    }
}
