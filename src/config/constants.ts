export const NODE_ENV: string = process.env.NODE_ENV ?? "development";
export const PORT: string = process.env.PORT ?? "5000";
export const FRONTEND_URL: string =
  process.env.FRONTEND_URL ?? "http://localhost:3000";

export const COOKIE = {
  HTTP_ONLY: true,
  SECURE: NODE_ENV === "production",
  SAME_SITE: "strict" as const,
  MAX_AGE: 7 * 24 * 60 * 60 * 1000,
} as const;

export const CORS_OPTIONS = {
  ORIGIN: FRONTEND_URL,
  METHODS: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  ALLOWED_HEADERS: ["Content-Type", "Authorization"],
  ALLOWED_CREDENTIALS: true,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
