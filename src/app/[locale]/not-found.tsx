"use client";

import Error from "next/error";
import React from "react";

import { DEFAULT_LOCALE } from "@/constants";

const NotFound = () => {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
};

export default NotFound;
