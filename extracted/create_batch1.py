import json
import os
import re

os.makedirs(r"c:\Users\manna\Pictures\test\extracted", exist_ok=True)

RAW_PAGES = {
    ("IMG_20261115_231738.jpg", 1111): """
1000Base-CX, 414
1000Base-LX, 414
1000Base-SX, 414
1000Base-T, 414
100Base-FX, 410-411
100Base-T4, 410, 412
100Base-TX, 410-411
10Base2, 404
10Base5, 403
10Base-F, 405
10Base-T, 404
  full-duplex, 408
10GBase-E, 416
10GBase-L, 416
10GBase-S, 416
2B1Q, 111
  HDSL, 255
3DES. See Triple DES
4B/5B, 116
4D-PAM5, 113
  Gigabit Ethernet, 415
56K modem, 250
  ADSL, 252
5-slot frame, 439
800 service, 247
802.11, 428
8B/10B, 118
  Gigabit Ethernet, 415
8B/6T code, 1055
8B6T, 112
900 service, 247
AA battery, 60
AAL, 532
AAL1, 532
AAL2, 532
AAL3/4, 534
AAL5, 535
ABM, 341
AC value, 905
access, 363
access control
  data link layer, 35
access point. See AP
access rate, 787
accounting management, 877
ACK, 724
  duplicate, 732
  in poll, 381
  Selective Repeat ARQ, 339
ACK frame, 318
ACK message, 921
acknowledgement number, 319, 719
acknowledgement policy, 766
acknowledgment, 731
  circuit switching, 217-218
  CSMA/CA, 378
  flow control, 311
  Go-Back-N, 326
  virtual-circuit network, 225
ACL, 439
active document, 860
active open, 723
ad hoc architecture
  network, 421
additive increase, 770
address, 1061
  IP, 47
  link, 46
  logical, 36
  need for multiple, 612
  physical, 46
  port, 49
  service-point, 38, 701
  types, 45, 52
  virtual-circuit network, 222
address aggregation, 561, 652
address allocation, 561
address block, 555
address field
  HDLC, 342
address mask
  ICMPv6, 640
address mask message, 626
address resolution protocol. See ARP
address space, 550
address to name resolution, 807
addressing, 45
  circuit switching, 215
  Ethernet, 400
  VPN, 1007
admission, 781
admission control, 780
admission policy, 766
ADSL, 252-253, 255
  adaptive, 252
  DMT, 254
  downstream data and control, 253
  HDSL, 255
  idle channels, 252
  local loop, 252
  upstream data and control, 253
  VDSL, 255
  voice, 252
ADSL Lite, 254
Advanced Encryption Standard. See AES
Advanced Mobile Phone System. See AMPS
Advanced Research Projects Agency. See ARPA
AES, 943
  configurations, 944
  round, 944
  structure, 944
AF PHB, 786
agent, 877-878
  database, 878
  function, 891
  MIB, 886
  passive open, 895
  trap, 878
AH protocol, 998
  authentication data field, 999
  ESP, 1001
  next header field, 999
  sequence number, 999
  SPI field, 999
AL field, 534
alias, 831
Alice, 932
allocation of resources, 745
ALOHA, 365
  collision, 365
  pure ALOHA, 365
  vulnerable time, 367
alternate mark inversion. See AMI
AM, 153-155
  bandwidth, 153-154
  carrier, 153
AM bandwidth, 153
AM radio, 71, 167
AM station, 154
American National Standards Institute. See ANSI
American Standard Code for Information Interchange. See ASCII
AMI, 110
  B8ZS, 119
  HDSL, 255
  synchronization, 111
amplifier, 447
  attenuation, 81
  cable TV, 256
amplitude, 142, 144
  ASK, 143
  FM, 154
  FSK, 146
  measurement, 59
  PM, 155
  PSK, 148
  sine wave, 65
amplitude modulation. See AM
amplitude shift keying. See ASK
AMPS, 470
analog data, 57
analog hierarchy
  telephone system, 165
analog leased service, 165, 247
analog service, 247
analog signal, 57-58, 101, 120
  digitize, 120
  periodic, 59
""",
    ("IMG_20261115_231744.jpg", 1112): """
analog switched service, 247
analog transmission, 141
  T line, 177
analog TV, 71
analog-to-analog conversion, 141, 152
analog-to-digital conversion, 101
AND operation, 557
angle of incidence, 198
anonymous FTP, 844
ANSI, 20
antenna
  focus, 206
  horn, 207
  line-of-sight, 203
  parabolic dish, 207
  satellite, 480
anti-jamming, 183
anycast address, 570
AP, 421
APNIC, 569
applet, 860
application adaptation layer. See AAL
application layer, 41
  directory services, 42
  file manipulation, 42
  mail services, 42
  NVT, 41
  responsibilities, 41, 795
  services, 41
  TCP/IP, 42, 45
architecture
  e-mail, 824
  OSI model, 30
area, 671
area border router, 671
ARP, 43-44, 613
  broadcast query, 612
  encapsulation, 615
  four cases, 615
  hardware length field, 614
  hardware type field, 614
  host to host on different networks, 616
  host to host on single network, 615
  ICMPv6, 596, 640
  operation, 615
  operation field, 614
  packet components, 612
  packet format, 613
  process, 615
  protocol length field, 614
  protocol type field, 614
  proxy, 617
  query packet, 612
  response packet, 612
  response packet components, 612
  router to host on different networks, 616
  router to host on same network, 616
  sender hardware address field, 614
  sender protocol address field, 614
  target hardware address field, 614
  target protocol address field, 614
  unicast response, 612
ARPA, 17
ARPANET, 17
ARQ, 311
AS, 659, 984
  graphical representation, 673
  multihomed, 677
  speaker node, 674
  stub, 676
  transit, 677
  types, 676
ASCII, 5, 628, 1029
  character code table, 1032
ASK, 142
  bandwidth, 144, 146
  binary, 144
  carrier signal, 143
  constellation, 151
  implementation, 144
  multilevel, 145
  with PSK, 152
ASN.1, 989
  simple type examples, 883
  SMI, 882
ASP, 859
association, 737, 743
  termination, 748
asymmetric cryptography, 932
asymmetrical DSL. See ADSL
asymmetric-key cryptography, 933
  keys, 933
asynchronous balanced mode. See ABM
asynchronous connectionless link. See ACL
asynchronous TDM
  ATM, 525
asynchronous transmission, 133-134
Asynchronous Transmission Mode. See ATM
AT&T Bell System, 1059
AT&T divestiture, 1059
ATM, 227, 308, 523, 526-527
  AAL1, 532
  AAL2, 532
  AAL3/4, 534
  AAL5, 535
  architecture, 526
  asynchronous TDM, 525
  ATM layer, 530
  available bit rate class, 789
  backward compatibility, 523
  cell, 527
  cell delay variation, 790
  cell error ratio, 790
  cell loss ratio, 790
  cell transfer delay, 790
  cell variation delay tolerance, 790
  connection establishment, 528
  connection release, 528
  connection types, 536
  connection-oriented, 538
  connections, 528
  constant bit rate class, 789
  design goals, 523
  example, 526
  header for NNI, 531
  hierarchical routing, 527
  Identifier, 527
  Information Super-Highway, 523
  layers, 529
  minimum cell rate, 790
  multimedia, 536
  multiplexing, 525
  network-related attributes, 790
  peak cell rate, 790
  physical layer, 530
  QoS, 789
  SONET, 530
  sustained cell rate, 790
  SVC, 529
  switching, 529
  switching fabric, 529
  unspecified bit rate class, 789
  user-related attributes, 790
  variable bit rate class, 789
  variable bit rate non-real time, 789
  variable bit rate nonreal time, 789
  variable bit rate real-time, 789
  virtual connection, 526
  WAN, 536
ATM Forum, 523
  address, 1061
ATM LAN, 536
  advantages, 536
  architecture, 536
  BUS, 539
  client/server, 540
  expansion, 536
  LANE, 538
  legacy, 536
  mixed architecture, 537
  pure, 536
ATM layer, 529
  cell loss priority, 532
  cell size, 530
  congestion control, 532
  function, 530
  generic flow control, 531
  header error correction, 532
  header for UNI, 531
  header format, 531
  NNI level flow control, 531
  payload type, 531
  UNI level flow control, 531
  VCI field, 531
  VPI, 531
  VPI field, 531
ATM switch, 536
attenuation, 81, 446
  amplifier, 81
  optical fiber, 202
attribute, 856
audio
  compression, 903
audio signal, 902
authentication, 349
  AH protocol, 1000
  Diffie-Hellman, 956
  entity, 962
  IPv6, 567, 596
  message, 962
  packet, 349
  PPP, 352
authentication data, 999
authentication extension header, 602
Authentication Header protocol. See AH protocol
authentication serve. See AS
authentication state, 349
""",
    ("IMG_20261115_231748.jpg", 1113): """
automatic repeat request. See ARQ
autonegotiation, 409
autonomous system, 671. See also AS
average data rate, 762
B8ZS, 118
backbone, 671
  area id, 671
  bus, 11
  logical bus, 456
  logical star, 457
  virtual link, 671
backbone network, 456
backbone router, 671
backoff strategy
  CSMA/CA, 378
backoff time, 366
backward explicit congestion notification. See BECN
backward signal, 768
band, 204
  AMPS, 470
  Bluetooth, 437
  D-AMPS, 471
  GSM, 472
  IS-95, 474
band-limited signal, 1049
band-pass channel, 79, 141
  low-pass, 79
bandwidth, 69, 89, 103, 143, 154, 248, 518
  AM, 153-154
  AM radio, 154, 167
  ASK, 144, 146
  audio signal, 154-155
  baud rate, 104
  BFSK, 146
  bit rate, 78
  BPSK, 149
  bridge, 406
  cellular telephone, 167
  digital signal, 74
  digital signal approximation, 77
  effective, 104
  Ethernet, 406
  FDM, 162
  flow characteristic, 776
  FM, 154-155
  FM requirement, 154
  group, 166
  in bps, 89
  in hertz, 89
  infinite, 74
  local loop, 242
  master group, 166
  minimum, 104
  non-periodic signal, 69
  NRZ-I and NRZ-L, 108
  optical fiber, 202
  periodic signal, 69
  PM, 156
  QAM, 152
  real-time traffic, 915
  supergroup, 166
  telephone line, 248
  throughput, 90
  transmission time, 91
bandwidth on demand
  bursty data, 518
bandwidth-delay product, 92, 322
banyan switch, 233
  internal collision, 235
Barker sequence, 184
base, 1050
base 10, 1051
base 256, 1037, 1040
  to binary, 1042
  weight and value, 1040
base e, 1051
base header, 597
base station (BS), 467
base transformation, 1052
baseband layer, 437
baseband transmission, 75
  approximation, 78
baseline, 104
baseline wandering, 104
  Manchester, 109
  NRZ-L, 107
Basic Encoding Rules. See BER
Basic Latin, 1029
basic multilingual plane (BMP), 1030
basic service set. See BSS
BA size, 534
Batcher, 235
Batcher-banyan switch, 235
baud rate, 103, 142
  and bit rate, 142
  bandwidth, 104
Bc, 787
Be, 788
beacon frame, 426
BECN, 521
  mechanism, 773
  sender, 773
Bell Operating Company. See BOC
BER, 884
  class subfield, 884
  format, 884
  format subfield, 884
  integer example, 885
  length field, 885
  number subfield, 884
  SNMP, 893
  tag field, 884
  value field, 885
best-effort delivery, 44, 583
B-frame, 908
BFSK, 146
BGP, 659, 676
  external, 677
  internal, 677
  path attributes, 677
  path vector routing, 676
  port, 1065
  session, 677
bidirectional edge, 673
bidirectional frame, 908
binary ASK, 144
binary exponential backoff, 366
binary notation, 550
  finding the class, 552
binary number, 1038-1040
binary PSK, 148
  symbols, 1038-1039
  to base 256, 1042
  to hexadecimal, 1041
  weight and value, 1038
binary system, 1037-1038
biphase coding, 109
bipolar AMI, 110
bipolar coding, 110
bit, 102
bit padding, 174, 176
bit rate, 73, 103, 142
  and baud rate, 142
  bandwidth, 78
bit stuffing, 174, 310
bit-oriented cipher, 938
bit-oriented protocol, 309
bits per second, 73
block, 555
  message digest, 968
block code
  error correction, 277
  linear, 277
  minimum Hamming distance, 276
  non-linear, 277
block coding, 115, 269
  8B/10B, 118
  combination, 115
  division, 115
  error correction, 273
  error detection, 272
  substitution, 115
block descriptor, 843
block processing
  RIPEMD-160, 968
blocking, 229
Blowfish, 945
Bluetooth, 421, 434
  applications, 434
  architecture, 435
  device, 436
  frame format, 439
  layers, 436
Bluetooth LAN, 435
BNC connector, 196
Bob, 932
BOC, 1059
BOOTP, 618-619
  binding, 620
  relay agent, 619
  static configuration protocol, 620
  static protocol, 620
Border Gateway Protocol. See BGP
BPSK, 148
  constellation, 151
  implementation, 149
  QPSK, 149
bridge, 406, 447
  as a filter, 448
  collision domain, 407
  connecting LANs, 454
  dynamic, 449
  Ethernet, 406
  function, 406, 447
  loop problem, 450
  multiple LAN issues, 454
  redundant, 450
  source routing, 454
  transparent, 449
bridge protocol data unit (BPDU), 452
bridged Ethernet, 406
broadcast address
  Ethernet, 400
broadcast/unknown server. See bus
broadcasting, 680
  VLAN, 460
browser, 852
  client protocol, 852
""",
    ("IMG_20261115_231753.jpg", 1114): """
browser—Cont.
  controller, 852
  dynamic document, 857
  HTML, 855
  interpreter, 852
  markup language, 855
  streaming stored audio/video, 909
BSS, 421
BSS-transition mobility, 423
Btag, 534
bucket brigade attack, 956
buffer
  circular, 717
  flow control, 311
  message digest, 968
  packet switch, 232
  receiver site, 717
  sender site, 717
  TCP, 717
buffer allocation, 534
burst, 267
burst error, 267-268
  2 single-bit errors, 296
  example, 268
bursty data, 518
  Frame Relay, 518
  T-line, 518
  traffic control, 788
bursty flow, 763
bursty traffic
  leaky bucket, 779
  token bucket, 779
bus, 9, 11-12
  advantages, 11
  backbone, 11
  disadvantages, 12
  drop lines, 11
  fault, 12
  tap, 11
bus ring topology, 382
bus topology, 34
BYE message, 921
byte number, 719
byte stuffing, 308
byte synchronization, 135
byte-oriented protocol, 736
byte-stuffing, 349
CA, 987, 992
cable
  coaxial, 195
  twisted-pair, 193
cable modem. See CM
cable modem transmission system. See CMTS
cable network, 241
cable TV, 256
  coaxial cable, 197
  head end, 256
caching, 808
  counter, 809
  problems, 809
  time-to-live, 809
  unauthoritative source, 809
Caesar Cipher, 936
CANCEL message, 921
capacities, 178, 876
carrier, 79, 370
  AM, 153-154
  FM, 154-155
  inter-LATA, 243
  PM, 155
carrier division multiple access. See CDMA
carrier extension, 413
carrier frequency, 143-144
carrier sense multiple access. See CSMA
carrier sense multiple access with collision avoidance. See CSMA/CA
carrier sense multiple access with collision detection. See CSMA/CD
carrier signal, 143
  ASK, 143
cascading, 82
case factor, 103
CAST-128, 945
CATV, 256
CBC, 946
  characteristics, 947
CBT, 690
  autonomous system, 690
  core router, 691
  DVMRP and MOSPF, 690
  encapsulation, 691
  leaving the group, 690
  multicast packet, 691
  rendezvous router, 690
CCITT, 20
CCK, 434
CDMA, 162, 383, 385, 474-475, 478
  encoding, 387
  sequence generation, 389
CDMA multiplexer, 475
CDMA2000, 478
cell, 524, 527-528, 790
  ATM, 527
  definition, 524
  header, 528
  payload, 527
  size, 527
  structure, 528
cell network, 524
  concept, 524
  example, 525
  multiplexing, 524
  real-time transmission, 525
  stream, 525
  vs framenetwork, 524
cell relay, 523
cellular telephone, 167
cellular telephony, 467
  first generation, 469
  handoff, 469
  MSC, 469
  placing a call, 468
  query signal, 469
  radius, 467
  receiving a call, 469
  second generation, 470
  third generation, 477
  tracking, 467
  transmission power, 467
  weak signal, 469
center router, 684
Cerf, Vint, 17
certification authority. See CA
CFB, 947
CGI, 857
  body, 859
  form, 858
  header, 859
  output, 859
  parameter passing, 858
  query string, 858
Challenge Handshake Authentication Protocol. See CHAP
channel, 8, 162
channel identifier, 533
channelization, 383
channels
  FDM, 162
CHAP, 352
  packet types, 353
  password, 353
  security, 353
  three-way handshake, 352
character-oriented cipher, 938
character-oriented protocol, 308
Cheapernet. See 10Base2
checksum, 298, 711, 731
  as hash function, 967
  example, 594
  examples, 298
  fragmentation, 591
  header coverage, 594
  IPv4, 594
  option, 712
  performance, 301
  protocol field, 712
  receiver procedure, 300
  SCTP, 740
  sender procedure, 300
  testing, 628
  UDP, 711-712
chip, 184, 386
choke point, 767
chunk, 739, 743
  format, 743
  identifier, 741
  TSN, 739
CIDR, 556
cipher, 932
  AES, 943
  bit-oriented, 938
  Caesar, 936
  character-oriented, 938
  compression permutation, 940
  monoalphabetic, 935
  polyalphabetic, 935
  rotation, 939
  shift, 936
  straight permutation, 940
  substitution, 935, 939
  transposition, 937
  XOR, 938
cipher block chaining mode. See CBC
cipher feedback mode. See CFB
ciphertext, 932
  RSA, 950
CIR, 787
circuit
  dedicated, 217
circuit switching, 214
  acknowledgment, 217
  data transfer, 217
  delay, 217
  efficiency, 217
  telephone company, 218
circuit-switched network, 214, 217
  telephone network, 244
circular buffer, 717
cladding, 198
  step-index multimode, 199
class A address, 553
class B address, 553
"""
}

def parse_line(line):
    line = line.strip()
    see_also = None
    see = None
    if ". See also " in line:
        line, see_also = line.split(". See also ", 1)
    elif ". See " in line:
        line, see = line.split(". See ", 1)
    
    # Extract trailing page numbers like ", 123, 456-458"
    # Match from the first comma that is followed only by page numbers/ranges
    m = re.match(r"^(.*?),\s*(\d+(?:[-–]\d+)?(?:\s*,\s*\d+(?:[-–]\d+)?)*)$", line)
    if m:
        topic = m.group(1).strip()
        pages = [p.strip() for p in m.group(2).split(",")]
    else:
        topic = line.strip()
        pages = []
    if topic.endswith("—Cont."):
        topic = topic[:-6].strip()
    return topic, pages, see, see_also

out = []
for (img, page_no), raw in RAW_PAGES.items():
    entries = []
    for raw_line in raw.strip().splitlines():
        if not raw_line.strip():
            continue
        is_sub = raw_line.startswith("  ")
        topic, pages, see, see_also = parse_line(raw_line)
        if is_sub:
            entries[-1]["subtopics"].append({
                "topic": topic,
                "pages": pages,
                "see": see,
                "see_also": see_also
            })
        else:
            entries.append({
                "topic": topic,
                "pages": pages,
                "see": see,
                "see_also": see_also,
                "subtopics": []
            })
    out.append({
        "image": img,
        "index_page": page_no,
        "entries": entries
    })

with open(r"c:\Users\manna\Pictures\test\extracted\batch_1.json", "w", encoding="utf-8") as f:
    json.dump(out, f, indent=2, ensure_ascii=False)

print("Batch 1 saved with", sum(len(p["entries"]) for p in out), "main entries.")

