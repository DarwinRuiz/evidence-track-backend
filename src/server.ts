import app from './app';
import { appEnvironment } from './config/env';
import { logger } from './config/logger';

const port = appEnvironment.port;

app.listen(port, () => {
    logger.info(
        `EvidenceTrack API is running on port ${port} (environment: ${appEnvironment.nodeEnvironment})`
    );
});
