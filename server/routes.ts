import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Products
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    if (!req.user?.isAdmin) return res.sendStatus(403);
    const product = await storage.createProduct(req.body);
    res.status(201).json(product);
  });

  app.patch("/api/products/:id", async (req, res) => {
    if (!req.user?.isAdmin) return res.sendStatus(403);
    const product = await storage.updateProduct(
      parseInt(req.params.id),
      req.body
    );
    res.json(product);
  });

  app.delete("/api/products/:id", async (req, res) => {
    if (!req.user?.isAdmin) return res.sendStatus(403);
    await storage.deleteProduct(parseInt(req.params.id));
    res.sendStatus(204);
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    if (!req.user?.isAdmin) {
      const orders = await storage.getUserOrders(req.user!.id);
      return res.json(orders);
    }
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.post("/api/orders", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const order = await storage.createOrder({
      ...req.body,
      userId: req.user.id,
      status: "pending",
    });
    res.status(201).json(order);
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    if (!req.user?.isAdmin) return res.sendStatus(403);
    const order = await storage.updateOrderStatus(
      parseInt(req.params.id),
      req.body.status
    );
    res.json(order);
  });

  const httpServer = createServer(app);
  return httpServer;
}
