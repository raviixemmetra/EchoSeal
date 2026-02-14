const BASE_URL = "http://localhost:8000"; // change if needed

interface TransmitResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface DecodeResponse {
  success: boolean;
  decoded_message?: string;
  error?: string;
}

export async function transmitMessage(
  message: string
): Promise<TransmitResponse> {
  try {
    const res = await fetch(`${BASE_URL}/transmit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error("Transmission failed");
    }

    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: "Network error",
    };
  }
}

export async function decodeAudio(): Promise<DecodeResponse> {
  try {
    const res = await fetch(`${BASE_URL}/decode`, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Decode failed");
    }

    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: "Network error",
    };
  }
}
