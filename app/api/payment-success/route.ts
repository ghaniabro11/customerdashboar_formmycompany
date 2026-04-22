import { NextResponse } from "next/server";
import logger from "@/lib/logger/logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    logger.info({
      paymentIntentId: body.paymentIntentId,
      amount: body.amount,
      currency: body.currency,
      status: body.status,
    }, "Payment success webhook received");

    // TODO: Replace with your actual external API endpoint
    const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || "https://your-api.com/payment-success";
    const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY;

    const externalResponse = await fetch(EXTERNAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(EXTERNAL_API_KEY && { Authorization: `Bearer ${EXTERNAL_API_KEY}` }),
      },
      body: JSON.stringify({
        paymentIntentId: body.paymentIntentId,
        amount: body.amount,
        currency: body.currency,
        status: body.status,
        paymentMethod: body.paymentMethod,
        billingDetails: body.billingDetails,
        workspaces: body.workspaces,
        metadata: body.metadata,
        timestamp: new Date().toISOString(),
      }),
    });

    const externalData = await externalResponse.json();

    logger.info({
      externalApiStatus: externalResponse.status,
      externalApiResponse: externalData,
    }, "External API response");

    if (!externalResponse.ok) {
      logger.error({
        status: externalResponse.status,
        response: externalData,
      }, "External API call failed");
      
      return NextResponse.json(
        {
          success: false,
          message: "External API call failed",
          error: externalData,
        },
        { status: externalResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment processed and external API called successfully",
      externalApiResponse: externalData,
    });
  } catch (err: any) {
    logger.error({
      error: err.message,
      stack: err.stack,
    }, "Payment success API error");
    
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
