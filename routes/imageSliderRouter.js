import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.send(req.body);
});

export default router;
