import helmet from "helmet";

export const securityMiddleware = helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
});

