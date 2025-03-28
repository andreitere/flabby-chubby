import Fastify from "fastify";
import cors from "@fastify/cors";
import db from "./db";
import router from "./router";
import path from "path";
import fastifyStatic from "@fastify/static";

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: ["http://localhost:5173", "https://flabby-dev.swninja.dev"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Register API routes first
fastify.register(router, { prefix: "/api" });

// Register static file serving for the frontend app
fastify.register(fastifyStatic, {
  root: path.join(process.cwd(), "public"),
  prefix: "/",
  decorateReply: true,
});

// Handle all non-API routes by serving the frontend app
fastify.setNotFoundHandler((request, reply) => {
  // If the request is for an API endpoint, return 404
  if (request.url.startsWith("/api/")) {
    reply.code(404).send({ error: "Not Found" });
    return;
  }
  
  // For all other routes, serve the frontend app
  reply.sendFile("index.html");
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || "3000");
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`Listening on port ${port}`);
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

const shutdown = async () => {
  try {
    await fastify.close();
    fastify.log.info("Server closed");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
