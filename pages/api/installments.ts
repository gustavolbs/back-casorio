import { NextApiRequest, NextApiResponse } from "next";

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

type InstallmentType = {
  installment: string;
  totalValue: string;
  parcels: string;
};

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const value = Number(req.body.price);
    const taxes = {
      1: 0,
      2: 5.41,
      3: 6.78,
      4: 8.25,
      5: 9.66,
      6: 11.04,
      7: 12.25,
      8: 13.85,
      9: 15.44,
      10: 16.59,
      11: 18.19,
      12: 19.79,
    };

    const installments: InstallmentType[] = [];

    Object.entries(taxes).forEach(([key, tax]) => {
      const totalValue = (value * (100 + tax)) / 100;
      const item = {
        installment: key,
        totalValue: totalValue.toFixed(2),
        parcels: `${key}x R$${(totalValue / Number(key)).toFixed(2)}`,
      };

      installments.push(item);
    });
    return res.status(200).json(installments);
  } catch (err: any) {
    return res
      .status(err?.status)
      .json({ error: err?.error ? err?.error : err?.message });
  }
};

module.exports = allowCors(index);
