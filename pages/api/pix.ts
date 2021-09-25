import { config } from "../../config";
import { NextApiRequest, NextApiResponse } from "next";
var mercadopago = require("mercadopago");

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
    const value = Number(req.body.price);

    var payment_data = {
      transaction_amount: value,
      description: "Casamento Gustavo e Déborah",
      payment_method_id: "pix",
      payer: {
        email: "gustavo.luiz.bispo.santos@gmail.com",
        first_name: "Gustavo",
        last_name: "Bispo",
        identification: {
          type: "CPF",
          number: "45009034026",
        },
        address: {
          zip_code: "06233200",
          street_name: "Av. das Nações Unidas",
          street_number: "3003",
          neighborhood: "Bonfim",
          city: "Osasco",
          federal_unit: "SP",
        },
      },
    };

    mercadopago.configurations.setAccessToken(config.mercadoPagoAccessToken);
    const response = await mercadopago.payment.create(payment_data);

    return res
      .status(200)
      .json(response.response.point_of_interaction.transaction_data);
  } catch (err: any) {
    return res
      .status(err?.status)
      .json({ error: err?.error ? err?.error : err?.message });
  }
};

module.exports = allowCors(index);
