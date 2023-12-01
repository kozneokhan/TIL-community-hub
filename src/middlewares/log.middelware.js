import winston from 'winston';

// winston을 통해서 어떻게 관리할지 설정하는 부분
const logger = winston.createLogger({
    level: 'info', // 로그 레빌을 'info'로 설정합니다.
    format: winston.format.json(), // 로그 포맷을 JSON 형식으로 설정합니다.
    transports: [
        new winston.transports.Console(), //로그를 콘솔에 풀력합니다.
    ],
});

// Middelware가 실행되는 부분
export default function (req, res, next) {
    // 클라이언트 요청이 시작된 시간을 기록합니다.
    const start = new Date().getTime();

    // 응답이 완료되면 로그를 기록합니다.
    res.on('finish', () => {
        const duration = new Date().getTime() - start;
        logger.info(`Method: ${req.method}, URL:${req.url}, Status: ${res.statusCode}, Duration: ${duration}ms,`);
        // logger.warn(`Method: ${req.method}, URL:${req.url}, Status: ${res.statusCode}, Duration: ${duration}ms,`);
        // logger.error(`Method: ${req.method}, URL:${req.url}, Status: ${res.statusCode}, Duration: ${duration}ms,`);
    });

    next();
}
