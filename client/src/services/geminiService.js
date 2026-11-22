/**
 * Gemini AI Textbook Locator & Page Pinpointer Service
 * ----------------------------------------------------
 * Connects to Google Gemini 2.5 Flash API using the user's API key.
 * Analyzes natural language questions, concepts, and problems,
 * and directly pinpoints the exact textbook references:
 * Subject, Book Title, Chapter, Section, and exact Page Numbers.
 */

const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const STORAGE_KEY = "custom_gemini_api_key";
const GEMINI_MODEL = "gemini-2.5-flash";

export function getGeminiApiKey() {
  if (typeof window === "undefined") return DEFAULT_API_KEY;
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_API_KEY;
}

export function setGeminiApiKey(key) {
  if (typeof window === "undefined") return;
  if (!key || key.trim() === "") {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, key.trim());
  }
}

export function hasGeminiApiKey() {
  const k = getGeminiApiKey();
  return Boolean(k && k.trim().length > 10);
}

const TEXTBOOK_SYSTEM_PROMPT = `You are a dedicated Textbook Locator Assistant for Electrical Engineering (EE 7th Semester).
Your ONLY goal is to help students find EXACTLY where topics, concepts, derivations, and questions are located across their 3 textbooks:

BOOK 1: Computer Networks (EE-701A)
- Title: Data Communications and Networking (Forouzan NetAtlas, 1,134 pages)
- Key Parts:
  * Physical Layer (pp. 55-266, Ch 3-9): Analog/Digital signals, transmission media, multiplexing (FDM, TDM, WDM), circuit & packet switching.
  * Data Link Layer (pp. 267-566, Ch 10-18): Error detection/correction (CRC, Hamming code, Checksum), Framing, Flow/Error control (HDLC, PPP), MAC (ALOHA, CSMA/CD, CSMA/CA), Ethernet (802.3), Wireless LAN (802.11 WiFi, Bluetooth), SONET/SDH, ATM, Frame Relay.
  * Network Layer (pp. 567-700, Ch 19-22): IPv4, IPv6, Subnetting, CIDR, ARP, RARP, DHCP, ICMP, Routing (RIP, OSPF, BGP).
  * Transport Layer (pp. 701-764, Ch 23-24): UDP, TCP (segment format, 3-way handshake, flow/congestion control), SCTP.
  * Application Layer (pp. 765-874, Ch 25-29): DNS, Telnet, SSH, Email (SMTP, POP3, IMAP), FTP, WWW, HTTP.
  * Security (pp. 875-970, Ch 30-32): Cryptography (DES, AES, RSA), IPsec, SSL/TLS, PGP, Firewalls.

BOOK 2: Internet of Things (EE-702B)
- Title: Internet of Things: A Hands-On Approach by Arshdeep Bahga & Vijay Madisetti (520 pages)
- Key Parts:
  * Part 1: Concepts & Protocols (pp. 17-110, Ch 1-4): IoT characteristics, Protocols (CoAP, MQTT, XMPP, AMQP, 6LoWPAN), IoT vs M2M, NETCONF-YANG.
  * Part 2: Platforms & Devices (pp. 111-332, Ch 5-9): Python for IoT, Raspberry Pi (Linux, GPIO, SPI, I2C, UART), Cloud offerings (WAMP, Django, AWS EC2/S3).
  * Part 3: Advanced Topics (pp. 333-485, Ch 10-14): IoT Analytics (Hadoop, MapReduce, Apache Spark, Storm), Chef/Puppet.

BOOK 3: Electric Drives (EE-701B / PC-EE-701)
- Title: Fundamentals of Electrical Drives (2nd Ed.) by Gopal K. Dubey (392 pages)
- Key Parts:
  * Part 1: Fundamentals & Dynamics (pp. 1-59, Ch 1-4): Torque equation (T - Tl = J dw/dt), 4-quadrant operation, load torques, transient time/energy loss, steady-state stability (dTl/dw > dTm/dw), flywheel load equalization, closed-loop speed/torque/PLL control, motor duty classes (S1-S8), thermal heating/cooling model.
  * Part 2: DC Motor Drives (pp. 60-139, Ch 5): Starting, Braking (regenerative p. 68, dynamic p. 69, plugging p. 73), speed control, Ward Leonard, controlled rectifiers (1-phase/3-phase fully/half controlled, dual converter pp. 114-118), choppers (pp. 121-131).
  * Part 3: Induction Motor Drives (pp. 140-243, Ch 6): Starting (star-delta p. 152, auto-transformer p. 153, soft start p. 154, rotor resistance p. 155), Braking (regenerative p. 158, plugging p. 160, dynamic p. 163), Speed control (stator voltage, V/f control pp. 186-190, VSI drives pp. 191-196, CSI drives pp. 206-210, cycloconverter p. 197, slip power recovery: Static Scherbius p. 219, Static Kramer p. 221), single-phase & linear induction motors.
  * Part 4: Synchronous & BLDC Drives (pp. 244-279, Ch 7): Synchronous motor drives, starting large machines, LCI inverter drives (pp. 260-265), PMAC, BLDC trapezoidal motors (pp. 271-276).
  * Part 5: Stepper & SRM Drives (pp. 280-296, Ch 8): Stepper motors (VR, PM, hybrid, drive circuits pp. 280-287), Switched Reluctance Motors (pp. 288-295).
  * Part 6: Solar, Traction & Conservation (pp. 297-382, Ch 9-12): PV/battery pump drives, Electric traction (mechanics, coefficient of adhesion p. 309, 25 kV AC traction p. 333, chopper DC traction p. 339, diesel electric), energy conservation, control circuits/relays.

RULES:
- The user ONLY wants to know WHERE they get those details in the textbook (Book, Chapter, Section, Page number).
- DO NOT WRITE ESSAYS OR LONG EXPLANATIONS.
- Be concise, direct, and pinpoint exact page ranges.
- Respond in valid JSON format matching this schema:
{
  "quickAnswer": "Direct 1-line answer stating which chapter and pages discuss this topic.",
  "citations": [
    {
      "subjectId": "electric-drives" | "computer-networks" | "iot",
      "subjectName": "Electric Drives" | "Computer Networks" | "Internet of Things",
      "bookTitle": "Fundamentals of Electrical Drives (Dubey) / Forouzan NetAtlas / Bahga & Madisetti IoT",
      "chapter": "Chapter Number & Name (e.g. Chapter 6: Induction Motor Drives)",
      "section": "Section Number & Name (e.g. 6.5 Starting)",
      "page": 151,
      "pageRange": "151–157",
      "details": "Short bullet summary of what is on this page (e.g., Inrush current, Star-Delta starter circuit, current equations)"
    }
  ],
  "keyPages": [
    "p. 151: Inrush current & direct online starting impact",
    "p. 152: Star-delta starter calculation & wiring diagram",
    "p. 154: Soft-starter using saturable reactor"
  ]
}
`;

export async function askGeminiTextbookLocator(userQuery) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      "Gemini API Key is missing. Please set your API key in client/.env or enter it in the AI Assistant settings."
    );
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const promptText = `${TEXTBOOK_SYSTEM_PROMPT}

User Question / Query:
"${userQuery.trim()}"

Respond ONLY with valid JSON. Keep it strictly focused on Book, Chapter, Section, and Page Numbers.`;

  // Use thinkingBudget: 0 for instant response and 4096 maxOutputTokens
  // so thinking tokens never consume output tokens or truncate citations.
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: promptText }],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      topP: 0.8,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  };

  let response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // Graceful fallback if an API version doesn't support thinkingConfig
  if (!response.ok && response.status === 400) {
    const errorData = await response.clone().json().catch(() => ({}));
    const msg = errorData?.error?.message || "";
    if (msg.toLowerCase().includes("thinking")) {
      delete payload.generationConfig.thinkingConfig;
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData?.error?.message ||
      `Gemini API request failed with HTTP ${response.status} (${response.statusText})`;
    throw new Error(message);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Gemini returned an empty response. Please try again.");
  }

  return parseGeminiResponse(rawText);
}

/**
 * Bulletproof JSON parser for textbook citations
 */
export function parseGeminiResponse(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return {
      quickAnswer: "No location found.",
      citations: [],
      keyPages: [],
    };
  }

  let clean = rawText.trim();
  const fenceMatch = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) {
    clean = fenceMatch[1].trim();
  } else {
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      clean = clean.slice(firstBrace, lastBrace + 1);
    }
  }

  // 1. Direct JSON.parse
  try {
    const parsed = JSON.parse(clean);
    if (parsed && typeof parsed === "object") {
      return normalizeParsedResponse(parsed);
    }
  } catch {
    // 2. Backslash sanitizer
    try {
      const sanitized = clean.replace(
        /\\([^"\\/bfnrtu]|u[^0-9a-fA-F]{4})/g,
        "\\\\$1"
      );
      const parsed = JSON.parse(sanitized);
      if (parsed && typeof parsed === "object") {
        return normalizeParsedResponse(parsed);
      }
    } catch {
      // 3. Regex extraction fallback
      const quickAnswerMatch = clean.match(
        /"(?:quickAnswer|summary)"\s*:\s*"((?:\\.|[^"\\])*)"/s
      );

      let citations = [];
      const citationsMatch = clean.match(
        /"citations"\s*:\s*\[([\s\S]*?)\]\s*(?:,|\})/
      );
      if (citationsMatch) {
        const citeObjRegex = /\{[\s\S]*?\}/g;
        let m;
        while ((m = citeObjRegex.exec(citationsMatch[1])) !== null) {
          try {
            const sanitizedCite = m[0].replace(
              /\\([^"\\/bfnrtu]|u[^0-9a-fA-F]{4})/g,
              "\\\\$1"
            );
            citations.push(JSON.parse(sanitizedCite));
          } catch {
            // skip malformed single item
          }
        }
      }

      let keyPages = [];
      const pagesMatch = clean.match(
        /"(?:keyPages|keyPageHighlights|relatedTopics)"\s*:\s*\[([\s\S]*?)\]/
      );
      if (pagesMatch) {
        const stringRegex = /"([^"\\]+)"/g;
        let sm;
        while ((sm = stringRegex.exec(pagesMatch[1])) !== null) {
          keyPages.push(sm[1]);
        }
      }

      const quickAnswer = quickAnswerMatch
        ? quickAnswerMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n")
        : "Textbook Reference Found";

      return {
        quickAnswer,
        citations,
        keyPages,
      };
    }
  }

  return {
    quickAnswer: "Textbook Reference Found",
    citations: [],
    keyPages: [],
  };
}

function normalizeParsedResponse(parsed) {
  const quickAnswer =
    parsed.quickAnswer || parsed.summary || "Textbook location found below:";
  const citations = Array.isArray(parsed.citations) ? parsed.citations : [];
  const keyPages = Array.isArray(parsed.keyPages)
    ? parsed.keyPages
    : Array.isArray(parsed.keyPageHighlights)
    ? parsed.keyPageHighlights
    : [];

  return {
    quickAnswer,
    citations,
    keyPages,
  };
}
