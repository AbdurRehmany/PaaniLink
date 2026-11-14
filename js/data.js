const PL = {
  today: "2026-11-14",
  limitGallons: 12000,
  site: { customers: 1248, bookings: 5420, deliveries: 5106 },
  plans: ["Basic plan", "Standard plan", "Bulk plan"],
  slots: ["08:00 - 11:00", "11:00 - 14:00", "14:00 - 17:00", "17:00 - 20:00"],
  rates: [
    { size: 1000, commercial: 1500, subsidised: 750 },
    { size: 3000, commercial: 3500, subsidised: 1575 },
    { size: 6000, commercial: 6500, subsidised: 2600 }
  ],
  hydrants: [
    { id: "h1", name: "Gulshan Hydrant", quota: 60000, used: 41000, opens: "06:00", closes: "20:00", status: "active", lat: 24.9120, lng: 67.0935 },
    { id: "h2", name: "Nazimabad Hydrant", quota: 45000, used: 22500, opens: "07:00", closes: "19:00", status: "active", lat: 24.9290, lng: 67.0380 },
    { id: "h3", name: "Korangi Hydrant", quota: 50000, used: 47500, opens: "06:00", closes: "18:00", status: "active", lat: 24.8470, lng: 67.1250 },
    { id: "h4", name: "Saddar Hydrant", quota: 40000, used: 12000, opens: "06:00", closes: "20:00", status: "active", lat: 24.8600, lng: 67.0120 },
    { id: "h5", name: "Clifton Hydrant", quota: 35000, used: 9800, opens: "08:00", closes: "18:00", status: "unavailable", lat: 24.8140, lng: 67.0290 },
    { id: "h6", name: "Malir Hydrant", quota: 40000, used: 18000, opens: "06:00", closes: "19:00", status: "active", lat: 24.8950, lng: 67.1990 }
  ],
  zones: [
    { id: "z1", query: "Gulshan-e-Iqbal, Karachi", name: "Gulshan-e-Iqbal", hydrants: ["h1"], color: "#087E8B", stops: [["Block 13-D", 24.9205, 67.0985], ["Block 7", 24.9060, 67.0910], ["Johar Morr", 24.9170, 67.1290]] },
    { id: "z2", query: "North Nazimabad, Karachi", name: "North Nazimabad", hydrants: ["h2"], color: "#7B4FD1", stops: [["Hyderi Market", 24.9340, 67.0420], ["Five Star Chowrangi", 24.9460, 67.0470], ["Buffer Zone", 24.9600, 67.0600]] },
    { id: "z3", query: "Korangi, Karachi", name: "Korangi", hydrants: ["h3"], color: "#D9534F", stops: [["Korangi Crossing", 24.8400, 67.1330], ["Industrial Area", 24.8300, 67.1100], ["Landhi", 24.8500, 67.1900]] },
    { id: "z4", query: "Saddar, Karachi", name: "Saddar", hydrants: ["h4", "h5"], color: "#C98A12", stops: [["Empress Market", 24.8566, 67.0236], ["Burns Road", 24.8650, 67.0140], ["PIDC", 24.8690, 67.0330]] },
    { id: "z5", query: "Clifton, Karachi", name: "Clifton and DHA", hydrants: ["h5"], color: "#1B6FA3", stops: [["Clifton Block 5", 24.8110, 67.0310], ["Zamzama", 24.8140, 67.0330], ["DHA Phase 6", 24.8000, 67.0700]] },
    { id: "z6", query: "Malir, Karachi", name: "Malir", hydrants: ["h6"], color: "#16845B", stops: [["Malir Halt", 24.8960, 67.1990], ["Model Colony", 24.9060, 67.1820], ["Saudabad", 24.9010, 67.2080]] }
  ],
  tankers: [
    { id: "t1", plate: "KHI-1021", size: 1000, hydrant: "h1", status: "available" },
    { id: "t2", plate: "KHI-3045", size: 3000, hydrant: "h1", status: "available" },
    { id: "t3", plate: "KHI-6012", size: 6000, hydrant: "h1", status: "available" },
    { id: "t4", plate: "KHI-3078", size: 3000, hydrant: "h1", status: "unavailable" },
    { id: "t5", plate: "KHI-3112", size: 3000, hydrant: "h2", status: "available" },
    { id: "t6", plate: "KHI-1190", size: 1000, hydrant: "h2", status: "available" },
    { id: "t7", plate: "KHI-3201", size: 3000, hydrant: "h3", status: "available" },
    { id: "t8", plate: "KHI-6033", size: 6000, hydrant: "h4", status: "available" },
    { id: "t9", plate: "KHI-1260", size: 1000, hydrant: "h5", status: "unavailable" },
    { id: "t10", plate: "KHI-3310", size: 3000, hydrant: "h6", status: "available" }
  ],
  users: [
    { id: "c1", name: "Ayesha Khan", phone: "03001234567", role: "customer", zone: "z1", active: true },
    { id: "c2", name: "Hamza Ali", phone: "03111234567", role: "customer", zone: "z1", active: true },
    { id: "c3", name: "Sana Malik", phone: "03211234567", role: "customer", zone: "z1", active: true },
    { id: "c4", name: "Usman Tariq", phone: "03331234567", role: "customer", zone: "z1", active: true },
    { id: "c5", name: "Masjid-e-Bilal", phone: "03451234567", role: "customer", zone: "z1", active: true },
    { id: "c6", name: "Zain Raza", phone: "03021234567", role: "customer", zone: "z3", active: false },
    { id: "o1", name: "Imran Siddiqui", phone: "03005550101", role: "officer", zone: "z1", active: true },
    { id: "o2", name: "Nadia Hussain", phone: "03005550102", role: "officer", zone: "z2", active: true },
    { id: "p1", name: "Bilal Ahmed", phone: "03005550201", role: "operator", hydrant: "h1", active: true },
    { id: "p2", name: "Farhan Shah", phone: "03005550202", role: "operator", hydrant: "h3", active: true },
    { id: "d1", name: "Rashid Mehmood", phone: "03005550301", role: "driver", hydrant: "h1", active: true },
    { id: "d2", name: "Kamran Baloch", phone: "03005550302", role: "driver", hydrant: "h1", active: true },
    { id: "d3", name: "Saeed Akhtar", phone: "03005550303", role: "driver", hydrant: "h1", active: true },
    { id: "d4", name: "Tahir Hussain", phone: "03005550304", role: "driver", hydrant: "h2", active: true },
    { id: "d5", name: "Naveed Khan", phone: "03005550305", role: "driver", hydrant: "h3", active: true },
    { id: "d6", name: "Javed Iqbal", phone: "03005550306", role: "driver", hydrant: "h4", active: true },
    { id: "a1", name: "Fatima Noor", phone: "03000000000", role: "admin", active: true }
  ],
  current: { customer: "c1", officer: "o1", operator: "p1", driver: "d1", admin: "a1" },
  bookingRows: [
    ["PL-1054", "c4", "z2", 3000, "subsidised", "2026-11-13", 1, "confirmed", "t5", "d4", "Hyderi Market, North Nazimabad"],
    ["PL-1053", "c3", "z6", 6000, "commercial", "2026-11-09", 0, "confirmed", "t10", "d6", "Model Colony, Malir"],
    ["PL-1052", "c2", "z5", 1000, "commercial", "2026-11-11", 2, "delivered", "t9", "d6", "Zamzama, Clifton"],
    ["PL-1051", "c6", "z4", 3000, "commercial", "2026-11-12", 1, "confirmed", "t8", "d6", "Burns Road, Saddar"],
    ["PL-1049", "c2", "z1", 3000, "commercial", "2026-11-14", 0, "assigned", "t2", "d1", "House 41, Block 13-D, Gulshan-e-Iqbal"],
    ["PL-1048", "c1", "z1", 3000, "subsidised", "2026-11-16", 1, "pending-approval", null, null, "House 12, Block 7, Gulshan-e-Iqbal"],
    ["PL-1047", "c1", "z1", 1000, "commercial", "2026-11-14", 2, "on-the-way", "t1", "d1", "House 12, Block 7, Gulshan-e-Iqbal"],
    ["PL-1046", "c3", "z1", 1000, "subsidised", "2026-11-15", 1, "approved", null, null, "Flat 8, Johar Morr, Gulshan-e-Iqbal"],
    ["PL-1045", "c4", "z1", 6000, "commercial", "2026-11-14", 1, "arrived", "t3", "d1", "Plot 22, Block 13-D, Gulshan-e-Iqbal"],
    ["PL-1044", "c1", "z1", 3000, "subsidised", "2026-11-10", 0, "confirmed", "t2", "d1", "House 12, Block 7, Gulshan-e-Iqbal"],
    ["PL-1043", "c5", "z1", 3000, "subsidised", "2026-11-15", 0, "pending-approval", null, null, "Masjid-e-Bilal, Block 7, Gulshan-e-Iqbal"],
    ["PL-1041", "c1", "z1", 6000, "commercial", "2026-11-05", 1, "delivered", "t3", "d2", "House 12, Block 7, Gulshan-e-Iqbal"],
    ["PL-1040", "c6", "z3", 1000, "subsidised", "2026-11-13", 0, "delivered", "t7", "d5", "Korangi Crossing, Korangi"],
    ["PL-1037", "c1", "z1", 1000, "subsidised", "2026-10-28", 0, "confirmed", "t1", "d1", "House 12, Block 7, Gulshan-e-Iqbal"],
    ["PL-1035", "c2", "z1", 3000, "commercial", "2026-10-22", 3, "confirmed", "t2", "d1", "House 41, Block 13-D, Gulshan-e-Iqbal"],
    ["PL-1033", "c1", "z1", 3000, "commercial", "2026-10-19", 3, "disputed", "t2", "d3", "House 12, Block 7, Gulshan-e-Iqbal"],
    ["PL-1030", "c1", "z1", 1000, "subsidised", "2026-10-12", 0, "rejected", null, null, "House 12, Block 7, Gulshan-e-Iqbal"],
    ["PL-1029", "c3", "z1", 1000, "commercial", "2026-10-08", 1, "delivered", "t1", "d1", "Flat 8, Johar Morr, Gulshan-e-Iqbal"],
    ["PL-1027", "c4", "z1", 3000, "subsidised", "2026-10-05", 2, "failed", "t2", "d1", "Plot 22, Block 13-D, Gulshan-e-Iqbal", "House locked"],
    ["PL-1026", "c1", "z1", 6000, "commercial", "2026-10-03", 2, "failed", "t3", "d2", "House 12, Block 7, Gulshan-e-Iqbal", "Road blocked"]
  ],
  applications: [
    { id: "s1", customer: "c1", category: "Low income household", proof: "Utility bill", ref: "UB-558201", members: 6, income: 38000, date: "2026-09-02", status: "approved", note: "Verified against the utility bill" },
    { id: "s2", customer: "c1", category: "Low income household", proof: "Income certificate", ref: "IC-90412", members: 6, income: 38000, date: "2026-07-15", status: "rejected", note: "Document was not readable" },
    { id: "s3", customer: "c3", category: "Low income household", proof: "Utility bill", ref: "UB-771034", members: 5, income: 42000, date: "2026-11-11", status: "pending", note: "" },
    { id: "s4", customer: "c5", category: "Mosque", proof: "Registration letter", ref: "RL-2210", members: 0, income: 0, date: "2026-11-12", status: "pending", note: "" },
    { id: "s5", customer: "c4", category: "Low income household", proof: "Income certificate", ref: "IC-65120", members: 7, income: 35000, date: "2026-11-13", status: "pending", note: "" },
    { id: "s6", customer: "c2", category: "Hospital", proof: "Registration letter", ref: "RL-0981", members: 0, income: 0, date: "2026-08-20", status: "approved", note: "Registered clinic confirmed" }
  ],
  disputes: [
    { id: "x1", booking: "PL-1033", customer: "c1", reason: "Only half of the water was delivered", date: "2026-10-21", status: "open" },
    { id: "x2", booking: "PL-1035", customer: "c2", reason: "Bill amount was higher than the booking price", date: "2026-10-24", status: "resolved" }
  ],
  bills: [
    { id: "B-2051", booking: "PL-1044", customer: "c1", status: "paid" },
    { id: "B-2047", booking: "PL-1041", customer: "c1", status: "unpaid" },
    { id: "B-2040", booking: "PL-1037", customer: "c1", status: "paid" },
    { id: "B-2033", booking: "PL-1033", customer: "c1", status: "unpaid" }
  ]
};

PL.flow = ["pending-approval", "approved", "assigned", "filled", "on-the-way", "arrived", "delivered", "confirmed"];

PL.statusLabel = function (s) {
  const t = s.replace(/-/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

PL.priceOf = function (size, type) {
  const r = PL.rates.find(function (x) { return x.size === size; });
  return r[type];
};

PL.bookings = PL.bookingRows.map(function (r) {
  const zone = PL.zones.find(function (z) { return z.id === r[2]; });
  const b = {
    id: r[0], customer: r[1], zone: r[2], hydrant: zone.hydrants[0], size: r[3], type: r[4],
    date: r[5], slot: PL.slots[r[6]], status: r[7], tanker: r[8], driver: r[9], address: r[10],
    reason: r[11] || "", price: PL.priceOf(r[3], r[4])
  };
  let steps;
  if (b.status === "rejected") steps = ["pending-approval", "rejected"];
  else if (b.status === "failed") steps = ["approved", "assigned", "filled", "on-the-way", "arrived", "failed"];
  else if (b.status === "disputed") steps = ["approved", "assigned", "filled", "on-the-way", "arrived", "delivered", "disputed"];
  else {
    const i = PL.flow.indexOf(b.status);
    steps = PL.flow.slice(b.type === "commercial" ? 1 : 0, i + 1);
  }
  b.trail = steps.map(function (s, i) {
    const h = 6 + i * 2;
    return { label: PL.statusLabel(s), when: b.date + " " + (h < 10 ? "0" : "") + h + ":" + (i % 2 ? "40" : "15") };
  });
  return b;
});
