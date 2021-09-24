import { config } from "../../config";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data } = await axios.get(
      "https://api.mercadopago.com/v1/payment_methods",
      {
        headers: {
          Authorization: `Bearer ${config.mercadoPagoAccessToken}`,
        },
      }
    );

    return res.status(200).json(data);
  } catch (err: any) {
    return res
      .status(err?.status)
      .json({ error: err?.error ? err?.error : err?.message });
  }
};
