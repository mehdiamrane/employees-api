const allowedOrigins = [process.env.API_URL, process.env.CLIENT_URL];

export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow all localhost origins
    if (origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }

    // Filter out undefined/null values and check other allowed origins
    if (allowedOrigins.filter(Boolean).includes(origin)) {
      return callback(null, true);
    }

    console.log(`Blocked origin: ${origin}`); // Helpful for debugging
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400,
};
