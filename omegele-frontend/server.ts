import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { setupSocketHandlers, startMatchingInterval } from "./src/lib/socket/handlers";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0"; // Use 0.0.0.0 for Railway/production
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      // Ensure HTTPS in production (handle redirects before Next.js)
      if (
        process.env.NODE_ENV === "production" &&
        req.headers["x-forwarded-proto"] !== "https" &&
        !req.url?.includes("localhost")
      ) {
        const host = req.headers.host || "";
        res.writeHead(301, {
          Location: `https://${host}${req.url}`,
        });
        res.end();
        return;
      }

      // Add security headers
      res.setHeader("X-DNS-Prefetch-Control", "on");
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload"
      );
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Initialize Socket.io
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    path: "/socket.io",
  });

  // Setup socket handlers
  setupSocketHandlers(io);
  
  // Start matching interval
  startMatchingInterval(io);

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

