/**
 * Subject Registry & Configuration for EE 7th Semester Book Locator
 * -----------------------------------------------------------------
 * To add a new subject:
 * 1. Put its `topics.json` and `chapters.json` inside `public/data/<subjectId>/`
 * 2. Add an entry to the `SUBJECTS` array below with metadata and colors.
 * 3. The UI will automatically render it in the subject switcher, load its TOC,
 *    and enable instant search, page inspection, and knowledge exploration!
 */

export const SUBJECTS = [
  {
    id: "computer-networks",
    name: "Computer Networks",
    shortName: "CN",
    code: "EE-701A",
    bookTitle: "Forouzan NetAtlas",
    editionBadge: "Data Communications & Networking",
    subtitle: "Instant Topic, Subtopic, Part, Chapter, Section & Multi-Page Reference Engine",
    author: "Behrouz A. Forouzan",
    totalPages: 1134,
    defaultInspectorPage: 523,
    topicsFile: "/data/computer-networks/topics.json",
    chaptersFile: "/data/computer-networks/chapters.json",
    quickChips: [
      "ATM",
      "ARP",
      "Ethernet",
      "TCP",
      "IPv6",
      "bandwidth",
      "OSI model",
      "SONET",
      "VLAN",
      "cryptography",
    ],
    partColors: {
      "PART 1": "#38bdf8",
      "PART 2": "#10b981",
      "PART 3": "#6366f1",
      "PART 4": "#f59e0b",
      "PART 5": "#ec4899",
      "PART 6": "#a855f7",
      "PART 7": "#ef4444",
      "APPENDICES": "#64748b",
    },
    acronyms: {
      atm: "Asynchronous Transfer Mode",
      arp: "Address Resolution Protocol",
      rarp: "Reverse Address Resolution Protocol",
      tcp: "Transmission Control Protocol",
      udp: "User Datagram Protocol",
      sctp: "Stream Control Transmission Protocol",
      ip: "Internet Protocol",
      ipv4: "IPv4",
      ipv6: "IPv6",
      icmp: "Internet Control Message Protocol",
      icmpv6: "ICMPv6",
      igmp: "Internet Group Management Protocol",
      hdlc: "High-Level Data Link Control",
      ppp: "Point-to-Point Protocol",
      csma: "Carrier-sense multiple access",
      "csma/cd": "Carrier-sense multiple access with collision detection",
      "csma/ca": "Carrier-sense multiple access with collision avoidance",
      aloha: "ALOHAnet",
      fdma: "Frequency-division multiple access",
      tdma: "Time-division multiple access",
      cdma: "Code-division multiple access",
      fdm: "Frequency-division multiplexing",
      tdm: "Time-division multiplexing",
      wdm: "Wavelength-division multiplexing",
      sonet: "Synchronous optical networking",
      sdh: "Synchronous optical networking",
      vlan: "Virtual LAN",
      lan: "Local area network",
      wan: "Wide area network",
      man: "Metropolitan area network",
      "osi model": "OSI model",
      "tcp/ip": "Internet protocol suite",
      dns: "Domain Name System",
      dhcp: "Dynamic Host Configuration Protocol",
      bootp: "Bootstrap Protocol",
      nat: "Network address translation",
      rip: "Routing Information Protocol",
      ospf: "Open Shortest Path First",
      bgp: "Border Gateway Protocol",
      snmp: "Simple Network Management Protocol",
      mib: "Management information base",
      http: "HTTP",
      www: "World Wide Web",
      ftp: "File Transfer Protocol",
      smtp: "Simple Mail Transfer Protocol",
      pop3: "Post Office Protocol",
      imap4: "Internet Message Access Protocol",
      mime: "MIME",
      rtp: "Real-time Transport Protocol",
      rtcp: "RTP Control Protocol",
      sip: "Session Initiation Protocol",
      voip: "Voice over IP",
      rsa: "RSA (cryptosystem)",
      des: "Data Encryption Standard",
      "3des": "Triple DES",
      aes: "Advanced Encryption Standard",
      ipsec: "IPsec",
      ssl: "Transport Layer Security",
      tls: "Transport Layer Security",
      pgp: "Pretty Good Privacy",
      vpn: "Virtual private network",
      pcm: "Pulse-code modulation",
      qam: "Quadrature amplitude modulation",
      ask: "Amplitude-shift keying",
      fsk: "Frequency-shift keying",
      psk: "Phase-shift keying",
      bpsk: "Phase-shift keying",
      qpsk: "Quadrature phase-shift keying",
      adsl: "Asymmetric digital subscriber line",
      dsl: "Digital subscriber line",
      crc: "Cyclic redundancy check",
      mac: "Medium access control",
      llc: "Logical link control",
      qos: "Quality of service",
    },
    getSearchUrls: (cleanTopic, parentTopic = "") => {
      const fullContext = parentTopic ? `${parentTopic} ${cleanTopic}` : cleanTopic;
      const expanded =
        SUBJECTS[0].acronyms[cleanTopic.toLowerCase()] || fullContext;
      const netQuery = encodeURIComponent(
        `${expanded} computer networks data communications`
      );
      const ytQuery = encodeURIComponent(
        `${expanded} computer networks lecture Forouzan`
      );
      const gfgQuery = encodeURIComponent(
        `site:geeksforgeeks.org ${expanded} computer network`
      );
      const wikiQuery = encodeURIComponent(expanded);
      const scholarQuery = encodeURIComponent(`${expanded} networking protocol`);
      const rfcQuery = encodeURIComponent(
        `site:datatracker.ietf.org ${expanded}`
      );

      return {
        cleanTopic,
        expanded,
        google: `https://www.google.com/search?q=${netQuery}`,
        wikipedia: `https://en.wikipedia.org/wiki/Special:Search?search=${wikiQuery}`,
        youtube: `https://www.youtube.com/results?search_query=${ytQuery}`,
        gfg: `https://www.google.com/search?q=${gfgQuery}`,
        scholar: `https://scholar.google.com/scholar?q=${scholarQuery}`,
        ietf: `https://www.google.com/search?q=${rfcQuery}`,
      };
    },
  },
  {
    id: "iot",
    name: "Internet of Things",
    shortName: "IoT",
    code: "EE-702B",
    bookTitle: "Bahga & Madisetti IoT",
    editionBadge: "A Hands-On Approach (1st Ed.)",
    subtitle: "Sensors, Raspberry Pi, Cloud, Networking Protocols & Analytics",
    author: "Arshdeep Bahga & Vijay Madisetti",
    totalPages: 520,
    defaultInspectorPage: 28,
    topicsFile: "/data/iot/topics.json",
    chaptersFile: "/data/iot/chapters.json",
    quickChips: [
      "Raspberry Pi",
      "MQTT",
      "CoAP",
      "NETCONF",
      "YANG",
      "Hadoop",
      "Apache Storm",
      "Amazon EC2",
      "Django",
      "6LoWPAN",
      "ZigBee",
      "Smart Irrigation",
      "WAMP",
    ],
    partColors: {
      "PART 1": "#38bdf8",
      "PART 2": "#10b981",
      "PART 3": "#a855f7",
      "APPENDICES": "#64748b",
    },
    acronyms: {
      mqtt: "Message Queuing Telemetry Transport",
      coap: "Constrained Application Protocol",
      amqp: "Advanced Message Queuing Protocol",
      xmpp: "Extensible Messaging and Presence Protocol",
      "6lowpan": "IPv6 over Low-Power Wireless Personal Area Networks",
      wsn: "Wireless Sensor Network",
      m2m: "Machine to Machine",
      sdn: "Software-Defined Networking",
      nfv: "Network Functions Virtualization",
      snmp: "Simple Network Management Protocol",
      netconf: "Network Configuration Protocol",
      yang: "Yet Another Next Generation",
      wamp: "Web Application Messaging Protocol",
      rest: "Representational State Transfer",
      spi: "Serial Peripheral Interface",
      i2c: "Inter-Integrated Circuit",
      yarn: "Yet Another Resource Negotiator",
      ldr: "Light Dependent Resistor",
      dds: "Data Distribution Service",
      gpio: "General-Purpose Input/Output",
    },
    getSearchUrls: (cleanTopic, parentTopic = "") => {
      const fullContext = parentTopic ? `${parentTopic} ${cleanTopic}` : cleanTopic;
      const expanded =
        SUBJECTS[1]?.acronyms?.[cleanTopic.toLowerCase()] || fullContext;
      const netQuery = encodeURIComponent(
        `${expanded} Internet of Things Bahga Madisetti`
      );
      const ytQuery = encodeURIComponent(
        `${expanded} IoT lecture hands on approach`
      );
      const gfgQuery = encodeURIComponent(
        `site:geeksforgeeks.org ${expanded} IoT`
      );
      const wikiQuery = encodeURIComponent(expanded);
      const scholarQuery = encodeURIComponent(`${expanded} Internet of Things`);
      const rfcQuery = encodeURIComponent(
        `site:datatracker.ietf.org ${expanded}`
      );

      return {
        cleanTopic,
        expanded,
        google: `https://www.google.com/search?q=${netQuery}`,
        wikipedia: `https://en.wikipedia.org/wiki/Special:Search?search=${wikiQuery}`,
        youtube: `https://www.youtube.com/results?search_query=${ytQuery}`,
        gfg: `https://www.google.com/search?q=${gfgQuery}`,
        scholar: `https://scholar.google.com/scholar?q=${scholarQuery}`,
        ietf: `https://www.google.com/search?q=${rfcQuery}`,
      };
    },
  },
  {
    id: "electric-drives",
    name: "Electric Drives",
    shortName: "ED",
    code: "EE-701B",
    bookTitle: "Dubey Electric Drives",
    editionBadge: "Fundamentals of Electrical Drives (2nd Ed.)",
    subtitle: "Dynamics, dc Motors, Induction & Synchronous Drives, Traction & Control",
    author: "Gopal K. Dubey",
    totalPages: 392,
    defaultInspectorPage: 60,
    topicsFile: "/data/drive/topics.json",
    chaptersFile: "/data/drive/chapters.json",
    quickChips: [
      "Chopper Control",
      "Regenerative Braking",
      "Static Kramer Drive",
      "VSI Induction Motor",
      "Traction Drives",
      "Ward Leonard",
      "PLL Control",
      "Brushless dc motor",
      "Stepper Motors",
      "Switched Reluctance",
      "Dynamic Braking",
      "Slip Power Recovery",
    ],
    partColors: {
      "PART 1": "#38bdf8",
      "PART 2": "#10b981",
      "PART 3": "#6366f1",
      "PART 4": "#a855f7",
      "PART 5": "#ec4899",
      "PART 6": "#f59e0b",
      "APPENDICES": "#64748b",
    },
    acronyms: {
      vsi: "Voltage Source Inverter",
      csi: "Current Source Inverter",
      pmac: "Permanent Magnet AC Motor",
      bldc: "Brushless DC Motor",
      srm: "Switched Reluctance Motor",
      pll: "Phase-Locked Loop",
      lci: "Load Commutated Inverter",
      pam: "Pole Amplitude Modulation",
      pwm: "Pulse-Width Modulation",
      mppt: "Maximum Power Point Tracker",
      ca: "Coefficient of Adhesion",
      vscf: "Variable Speed Constant Frequency",
      svc: "Static Var Compensator",
      pcc: "Power Control Centre",
      mcc: "Motor Control Centre",
    },
    getSearchUrls: (cleanTopic, parentTopic = "") => {
      const fullContext = parentTopic ? `${parentTopic} ${cleanTopic}` : cleanTopic;
      const expanded =
        SUBJECTS[2]?.acronyms?.[cleanTopic.toLowerCase()] || fullContext;
      const netQuery = encodeURIComponent(
        `${expanded} Electrical Drives Dubey`
      );
      const ytQuery = encodeURIComponent(
        `${expanded} Electrical Drives lecture Dubey NPTEL`
      );
      const gfgQuery = encodeURIComponent(
        `site:geeksforgeeks.org ${expanded} electrical drives`
      );
      const wikiQuery = encodeURIComponent(expanded);
      const scholarQuery = encodeURIComponent(`${expanded} Electrical Drives Dubey`);
      const nptelQuery = encodeURIComponent(
        `site:nptel.ac.in ${expanded} electrical drives`
      );

      return {
        cleanTopic,
        expanded,
        google: `https://www.google.com/search?q=${netQuery}`,
        wikipedia: `https://en.wikipedia.org/wiki/Special:Search?search=${wikiQuery}`,
        youtube: `https://www.youtube.com/results?search_query=${ytQuery}`,
        gfg: `https://www.google.com/search?q=${gfgQuery}`,
        scholar: `https://scholar.google.com/scholar?q=${scholarQuery}`,
        ietf: `https://www.google.com/search?q=${nptelQuery}`,
      };
    },
  },
];

export const DEFAULT_SUBJECT_ID = "computer-networks";
