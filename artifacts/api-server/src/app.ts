import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app: Express = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../../vyapaar-ai/dist/public");

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve static files from the React frontend
app.use(express.static(publicDir));

// Fallback route for Single Page Application (SPA) routing
app.use((req: Request, res: Response, _next: NextFunction) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) {
    res.status(404).json({ message: "Not Found" });
    return;
  }
  const indexPath = path.join(publicDir, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ message: "Not Found" });
    }
  });
});

export default app;
