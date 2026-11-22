/**
 * Subject Registry & Configuration for EE 7th Semester Book Locator
 * -----------------------------------------------------------------
 * To add a new subject in the future:
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
  // Template for future subjects:
  // {
  //   id: "electric-drives",
  //   name: "Electric Drives",
  //   shortName: "ED",
  //   code: "EE-702",
  //   bookTitle: "Dubey Electric Drives",
  //   editionBadge: "Fundamentals of Electrical Drives",
  //   subtitle: "Motor Dynamics, Inverter Control & Closed-Loop Drives",
  //   author: "G.K. Dubey",
  //   totalPages: 600,
  //   defaultInspectorPage: 120,
  //   topicsFile: "/data/electric-drives/topics.json",
  //   chaptersFile: "/data/electric-drives/chapters.json",
  //   quickChips: ["Chopper Fed DC Drive", "V/f Control", "Vector Control", "Braking", "PMSM"],
  //   partColors: { ... },
  //   acronyms: { ... },
  //   getSearchUrls: (cleanTopic, parentTopic) => ({ ... })
  // }
];

export const DEFAULT_SUBJECT_ID = "computer-networks";
