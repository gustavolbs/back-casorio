import { config } from "../../config";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const allowCors =
  (fn: any) => async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }
    return await fn(req, res);
  };

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data } = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      {
        items: [
          {
            title: "Casamento Gustavo e Déborah",
            quantity: 1,
            unit_price: Number(req.body.price) || 1000,
          },
        ],
        payment_methods: {
          excluded_payment_methods: [{ id: "pix" }],
          excluded_payment_types: [{}],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${config.mercadoPagoAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const willReceive = ((Number(req.body.price) || 1000) * (100 - 3.99)) / 100;

    return res.status(200).json({ id: data.id, willReceive });
  } catch (err: any) {
    return res
      .status(err?.status)
      .json({ error: err?.error ? err?.error : err?.message });
  }
};

module.exports = allowCors(index);
