(function () {
  const $ = function (id) { return document.getElementById(id); };
  const num = function (n) { return Number(n).toLocaleString("en-US"); };
  const rs = function (n) { return "Rs " + num(n); };
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmtDate = function (d) {
    const p = d.split("-");
    return Number(p[2]) + " " + months[Number(p[1]) - 1] + " " + p[0];
  };
  const user = function (id) { return PL.users.find(function (u) { return u.id === id; }); };
  const zone = function (id) { return PL.zones.find(function (z) { return z.id === id; }); };
  const hydrant = function (id) { return PL.hydrants.find(function (h) { return h.id === id; }); };
  const tanker = function (id) { return PL.tankers.find(function (t) { return t.id === id; }); };
  const booking = function (id) { return PL.bookings.find(function (b) { return b.id === id; }); };
  const gallons = function (n) { return num(n) + " gal"; };
  const delivery = function (b) { return fmtDate(b.date) + ", " + b.slot; };
  const byDateDesc = function (a, b) { return a.date < b.date ? 1 : -1; };

  const badgeClass = {
    "pending-approval": "b-pending",
    pending: "b-pending",
    approved: "b-approved",
    confirmed: "b-approved",
    delivered: "b-approved",
    paid: "b-approved",
    available: "b-approved",
    active: "b-approved",
    resolved: "b-approved",
    rejected: "b-rejected",
    failed: "b-rejected",
    disputed: "b-rejected",
    unpaid: "b-rejected",
    unavailable: "b-rejected",
    open: "b-rejected",
    assigned: "b-dispatched",
    filled: "b-dispatched",
    "on-the-way": "b-dispatched",
    arrived: "b-dispatched"
  };
  const badge = function (s) {
    return '<span class="badge ' + (badgeClass[s] || "") + '">' + PL.statusLabel(s) + "</span>";
  };

  const toast = function (text) {
    const area = $("toastArea");
    if (!area) return;
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = text;
    area.appendChild(t);
    setTimeout(function () { t.remove(); }, 2800);
  };

  const fill = function (id, html) {
    const el = $(id);
    if (el) el.innerHTML = html;
  };
  const setText = function (id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  };
  const options = function (items, first) {
    return (first ? '<option value="">' + first + "</option>" : "") + items.map(function (i) {
      return '<option value="' + i[0] + '">' + i[1] + "</option>";
    }).join("");
  };

  const role = (location.pathname.match(/\/(customer|officer|operator|driver|admin)\//) || [])[1];
  const me = role ? user(PL.current[role]) : null;
  if (me) setText("userName", me.name);

  const list = function (cfg) {
    const body = $(cfg.body);
    if (!body) return;
    const size = cfg.pageSize || 6;
    let page = 1;
    const view = function () {
      let items = cfg.items.slice();
      const q = cfg.search && $(cfg.search) ? $(cfg.search).value.trim().toLowerCase() : "";
      if (q) {
        items = items.filter(function (i) { return cfg.text(i).toLowerCase().indexOf(q) !== -1; });
      }
      (cfg.filters || []).forEach(function (f) {
        const el = $(f[0]);
        if (el && el.value) items = items.filter(function (i) { return f[1](i, el.value); });
      });
      const s = cfg.sort && $(cfg.sort) ? $(cfg.sort).value.split("-") : null;
      if (s) {
        const get = cfg.keys && cfg.keys[s[0]] ? cfg.keys[s[0]] : function (i) { return i[s[0]]; };
        items.sort(function (a, b) {
          const x = get(a);
          const y = get(b);
          return (x < y ? -1 : x > y ? 1 : 0) * (s[1] === "desc" ? -1 : 1);
        });
      }
      const pages = Math.max(1, Math.ceil(items.length / size));
      if (page > pages) page = pages;
      const slice = items.slice((page - 1) * size, page * size);
      body.innerHTML = slice.length
        ? slice.map(cfg.row).join("")
        : '<tr class="state"><td colspan="' + cfg.cols + '">No records found.</td></tr>';
      setText(cfg.info, "Page " + page + " of " + pages);
      if ($(cfg.prev)) $(cfg.prev).disabled = page <= 1;
      if ($(cfg.next)) $(cfg.next).disabled = page >= pages;
    };
    if ($(cfg.prev)) $(cfg.prev).addEventListener("click", function () { page -= 1; view(); });
    if ($(cfg.next)) $(cfg.next).addEventListener("click", function () { page += 1; view(); });
    const form = $(cfg.form);
    if (form) {
      form.addEventListener("submit", function (e) { e.preventDefault(); page = 1; view(); });
      form.addEventListener("reset", function () { setTimeout(function () { page = 1; view(); }, 0); });
    }
    view();
  };

  const detail = function (b) {
    const t = tanker(b.tanker);
    const d = user(b.driver);
    const pairs = [
      ["Customer", user(b.customer).name],
      ["Zone", zone(b.zone).name],
      ["Hydrant", hydrant(b.hydrant).name],
      ["Address", b.address],
      ["Delivery", delivery(b)],
      ["Size", gallons(b.size)],
      ["Type", PL.statusLabel(b.type)],
      ["Price", rs(b.price)],
      ["Status", PL.statusLabel(b.status)],
      ["Tanker", t ? t.plate : "Not assigned"],
      ["Driver", d ? d.name : "Not assigned"]
    ];
    if (b.reason) pairs.push(["Failure reason", b.reason]);
    setText("detailDialogTitle", "Booking " + b.id);
    fill("detailDialogList", pairs.map(function (p) { return "<dt>" + p[0] + "</dt><dd>" + p[1] + "</dd>"; }).join(""));
    fill("detailDialogTrail", b.trail.map(function (s) { return "<li>" + s.label + "<small>" + s.when + "</small></li>"; }).join(""));
    $("detailDialog").showModal();
  };

  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-detail], [data-open], [data-act]");
    if (!btn) return;
    if (btn.dataset.detail) {
      detail(booking(btn.dataset.detail));
    } else if (btn.dataset.open) {
      const dlg = $(btn.dataset.open);
      const title = $(btn.dataset.open + "Title");
      if (title && btn.dataset.ref) {
        if (!title.dataset.base) title.dataset.base = title.textContent;
        title.textContent = title.dataset.base + " " + btn.dataset.ref;
      }
      if (dlg) dlg.showModal();
    } else {
      toast("Preview only: this action is not connected yet.");
    }
  });

  document.querySelectorAll("main form:not(.toolbar), dialog form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      if (e.submitter && e.submitter.getAttribute("formmethod") === "dialog") return;
      e.preventDefault();
      const dlg = f.closest("dialog");
      if (dlg) dlg.close();
      toast("Preview only: nothing was saved.");
    });
  });

  const btn = function (label, cls, attrs) {
    return '<button class="btn ' + cls + ' btn-sm" type="button" ' + attrs + ">" + label + "</button>";
  };
  const detailBtn = function (b) { return btn("Details", "btn-line", 'data-detail="' + b.id + '"'); };
  const cell = function (html) { return '<td><div class="actions-cell">' + html + "</div></td>"; };

  const meBookings = function () {
    return PL.bookings.filter(function (b) { return b.customer === PL.current.customer; });
  };
  const subsidyUsed = function (cid) {
    return PL.bookings.filter(function (b) {
      return b.customer === cid && b.type === "subsidised" && b.date.slice(0, 7) === PL.today.slice(0, 7) &&
        ["rejected", "failed", "pending-approval"].indexOf(b.status) === -1;
    }).reduce(function (n, b) { return n + b.size; }, 0);
  };
  const subsidyMeter = function () {
    const used = subsidyUsed(PL.current.customer);
    setText("limitText", num(used) + " / " + num(PL.limitGallons) + " gallons");
    const bar = $("limitBar");
    if (bar) bar.style.width = Math.min(100, used / PL.limitGallons * 100) + "%";
    return used;
  };
  const subsidyBadge = function () {
    const apps = PL.applications.filter(function (a) { return a.customer === PL.current.customer; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    const el = $("subsidyBadge");
    if (el && apps.length) {
      el.className = "badge " + badgeClass[apps[0].status];
      el.textContent = PL.statusLabel(apps[0].status);
    }
    return apps[0];
  };

  const stepIndex = { approved: 0, assigned: 1, filled: 1, "on-the-way": 2, arrived: 2, delivered: 3, confirmed: 4 };
  const activeStates = ["pending-approval", "approved", "assigned", "filled", "on-the-way", "arrived"];

  if ($("recentBody")) {
    const mine = meBookings().sort(byDateDesc);
    setText("statTotal", mine.length);
    setText("statActive", mine.filter(function (b) { return activeStates.indexOf(b.status) !== -1; }).length);
    setText("statConfirmed", mine.filter(function (b) { return b.status === "confirmed"; }).length);
    setText("statUnpaid", PL.bills.filter(function (x) { return x.customer === PL.current.customer && x.status === "unpaid"; }).length);
    const latest = mine.find(function (b) { return stepIndex[b.status] !== undefined; });
    if (latest) {
      const idx = stepIndex[latest.status];
      document.querySelectorAll("#tracker .t").forEach(function (t, i) { if (i <= idx) t.classList.add("done"); });
      const tk = tanker(latest.tanker);
      setText("latestInfo", latest.id + " - " + gallons(latest.size) + " - " + delivery(latest) + (tk ? " - Tanker " + tk.plate : ""));
    }
    subsidyMeter();
    subsidyBadge();
    fill("recentBody", mine.slice(0, 5).map(function (b) {
      return "<tr><td>" + b.id + "</td><td>" + fmtDate(b.date) + "</td><td>" + gallons(b.size) + "</td><td>" + PL.statusLabel(b.type) + "</td><td>" + badge(b.status) + "</td><td>" + rs(b.price) + "</td></tr>";
    }).join(""));
  }

  list({
    body: "bookingsBody", items: meBookings(), cols: 8, form: "bookingFilter", search: "bSearch", sort: "bSort",
    filters: [["bStatus", function (i, v) { return i.status === v; }], ["bType", function (i, v) { return i.type === v; }]],
    info: "bInfo", prev: "bPrev", next: "bNext", pageSize: 6,
    text: function (b) { return [b.id, b.address, b.status, b.type].join(" "); },
    row: function (b) {
      const t = tanker(b.tanker);
      let a = detailBtn(b);
      if (b.status === "pending-approval") a += btn("Cancel", "btn-danger", 'data-act="cancel"');
      if (b.status === "delivered") {
        a += btn("Confirm", "btn-success", 'data-act="confirm"');
        a += btn("Dispute", "btn-danger", 'data-open="disputeDialog" data-ref="' + b.id + '"');
      }
      return "<tr><td>" + b.id + "</td><td>" + delivery(b) + "</td><td>" + gallons(b.size) + "</td><td>" + PL.statusLabel(b.type) + "</td><td>" + rs(b.price) + "</td><td>" + badge(b.status) + "</td><td>" + (t ? t.plate : "-") + "</td>" + cell(a) + "</tr>";
    }
  });

  const billItems = PL.bills.filter(function (x) { return x.customer === PL.current.customer; }).map(function (x) {
    const b = booking(x.booking);
    return { id: x.id, booking: x.booking, date: b.date, amount: b.price, status: x.status };
  });
  if ($("billsBody")) {
    const sum = function (s) { return billItems.filter(function (i) { return i.status === s; }).reduce(function (n, i) { return n + i.amount; }, 0); };
    setText("billUnpaid", rs(sum("unpaid")));
    setText("billPaid", rs(sum("paid")));
    setText("billCount", billItems.length);
  }
  list({
    body: "billsBody", items: billItems, cols: 6, form: "billFilter", sort: "billSort",
    filters: [["billStatus", function (i, v) { return i.status === v; }]],
    info: "billInfo", prev: "billPrev", next: "billNext", pageSize: 6,
    text: function (i) { return i.id; },
    row: function (i) {
      return "<tr><td>" + i.id + "</td><td>" + i.booking + "</td><td>" + fmtDate(i.date) + "</td><td>" + rs(i.amount) + "</td><td>" + badge(i.status) + "</td>" +
        cell(i.status === "unpaid" ? btn("Pay now", "btn-primary", 'data-act="pay"') : "-") + "</tr>";
    }
  });

  if ($("bookingForm")) {
    fill("bookZone", options(PL.zones.map(function (z) { return [z.id, z.name]; }), "Select zone"));
    fill("bookSize", options(PL.rates.map(function (r) { return [r.size, num(r.size) + " gallons"]; }), "Select size"));
    fill("bookSlot", options(PL.slots.map(function (s, i) { return [i, s]; }), "Select time slot"));
    const sumUp = function () {
      const z = zone($("bookZone").value);
      const size = Number($("bookSize").value);
      const type = $("typeSubsidised").checked ? "subsidised" : "commercial";
      setText("sumHydrant", z ? z.hydrants.map(function (h) { return hydrant(h).name; }).join(", ") : "-");
      setText("sumRate", size ? rs(PL.priceOf(size, type)) : "-");
      setText("sumTotal", size ? rs(PL.priceOf(size, type)) : "-");
      setText("sumLimit", num(PL.limitGallons - subsidyUsed(PL.current.customer)) + " gallons");
    };
    ["bookZone", "bookSize", "typeCommercial", "typeSubsidised"].forEach(function (id) { $(id).addEventListener("change", sumUp); });
    sumUp();
  }

  if ($("applicationsBody")) {
    const latest = subsidyBadge();
    subsidyMeter();
    if (latest) setText("subsidyNote", latest.note ? latest.note + " (" + fmtDate(latest.date) + ")." : "Submitted on " + fmtDate(latest.date) + ".");
    fill("applicationsBody", PL.applications.filter(function (a) { return a.customer === PL.current.customer; }).map(function (a) {
      return "<tr><td>" + fmtDate(a.date) + "</td><td>" + a.category + "</td><td>" + a.proof + " (" + a.ref + ")</td><td>" + badge(a.status) + "</td><td>" + (a.note || "-") + "</td></tr>";
    }).join(""));
  }

  const officerZone = me && me.role === "officer" ? me.zone : "z1";
  const zoneBookings = PL.bookings.filter(function (b) { return b.zone === officerZone; });
  const zoneApps = PL.applications.filter(function (a) { return user(a.customer).zone === officerZone; });
  const zoneDisputes = PL.disputes.filter(function (d) { return booking(d.booking).zone === officerZone; });

  if ($("attentionBody")) {
    const pa = zoneApps.filter(function (a) { return a.status === "pending"; });
    const pb = zoneBookings.filter(function (b) { return b.status === "pending-approval"; });
    const pd = zoneDisputes.filter(function (d) { return d.status === "open"; });
    setText("statSubsidy", pa.length);
    setText("statApprovals", pb.length);
    setText("statDisputes", pd.length);
    setText("statToday", zoneBookings.filter(function (b) { return b.date === PL.today; }).length);
    const row = function (item, name, date, href) {
      return "<tr><td>" + item + "</td><td>" + name + "</td><td>" + fmtDate(date) + '</td><td><a class="btn btn-primary btn-sm" href="' + href + '">Review</a></td></tr>';
    };
    fill("attentionBody",
      pa.map(function (a) { return row("Subsidy application (" + a.category + ")", user(a.customer).name, a.date, "subsidy.html"); }).join("") +
      pb.map(function (b) { return row("Booking " + b.id + " needs approval", user(b.customer).name, b.date, "bookings.html"); }).join("") +
      pd.map(function (d) { return row("Dispute on " + d.booking, user(d.customer).name, d.date, "disputes.html"); }).join(""));
  }

  list({
    body: "zoneBookingsBody", items: zoneBookings, cols: 8, form: "zbFilter", search: "zSearch", sort: "zSort",
    filters: [["zStatus", function (i, v) { return i.status === v; }], ["zType", function (i, v) { return i.type === v; }]],
    info: "zInfo", prev: "zPrev", next: "zNext", pageSize: 6,
    text: function (b) { return [b.id, user(b.customer).name, b.address].join(" "); },
    row: function (b) {
      let a = detailBtn(b);
      if (b.status === "pending-approval") {
        a += btn("Approve", "btn-success", 'data-act="approve"');
        a += btn("Reject", "btn-danger", 'data-open="rejectDialog" data-ref="' + b.id + '"');
      }
      return "<tr><td>" + b.id + "</td><td>" + user(b.customer).name + "</td><td>" + b.address + "</td><td>" + gallons(b.size) + "</td><td>" + PL.statusLabel(b.type) + "</td><td>" + delivery(b) + "</td><td>" + badge(b.status) + "</td>" + cell(a) + "</tr>";
    }
  });

  list({
    body: "appsBody", items: zoneApps, cols: 8, form: "appFilter", search: "aSearch", sort: "aSort",
    filters: [["aStatus", function (i, v) { return i.status === v; }]],
    info: "aInfo", prev: "aPrev", next: "aNext", pageSize: 6,
    text: function (a) { return [user(a.customer).name, a.category, a.ref].join(" "); },
    row: function (a) {
      const act = a.status === "pending"
        ? btn("Approve", "btn-success", 'data-act="approve"') + btn("Reject", "btn-danger", 'data-open="rejectDialog" data-ref="' + user(a.customer).name + '"')
        : "Reviewed";
      return "<tr><td>" + user(a.customer).name + "</td><td>" + a.category + "</td><td>" + a.proof + " (" + a.ref + ")</td><td>" + (a.members || "-") + "</td><td>" + (a.income ? rs(a.income) : "-") + "</td><td>" + fmtDate(a.date) + "</td><td>" + badge(a.status) + "</td>" + cell(act) + "</tr>";
    }
  });

  list({
    body: "disputesBody", items: zoneDisputes, cols: 6, form: "dispFilter", sort: "dSort",
    filters: [["dStatus", function (i, v) { return i.status === v; }]],
    info: "dInfo", prev: "dPrev", next: "dNext", pageSize: 6,
    text: function (d) { return d.booking + " " + d.reason; },
    row: function (d) {
      return "<tr><td>" + d.booking + "</td><td>" + user(d.customer).name + "</td><td>" + d.reason + "</td><td>" + fmtDate(d.date) + "</td><td>" + badge(d.status) + "</td>" +
        cell(d.status === "open" ? btn("Resolve", "btn-primary", 'data-open="resolveDialog" data-ref="' + d.booking + '"') : "-") + "</tr>";
    }
  });

  const myHydrantId = me && me.role === "operator" ? me.hydrant : "h1";
  const hydrantBookings = PL.bookings.filter(function (b) { return b.hydrant === myHydrantId; });
  const myHydrant = hydrant(myHydrantId);

  if ($("todayBody")) {
    const today = hydrantBookings.filter(function (b) { return b.date === PL.today && b.tanker; });
    setText("statApproved", hydrantBookings.filter(function (b) { return b.status === "approved"; }).length);
    setText("statTrips", today.length);
    setText("statTankers", PL.tankers.filter(function (t) { return t.hydrant === myHydrantId && t.status === "available"; }).length);
    setText("statQuotaLeft", num(myHydrant.quota - myHydrant.used));
    setText("hydrantName", myHydrant.name);
    setText("quotaText", num(myHydrant.used) + " / " + num(myHydrant.quota) + " gallons");
    $("quotaBar").style.width = myHydrant.used / myHydrant.quota * 100 + "%";
    setText("hydrantHours", "Open " + myHydrant.opens + " - " + myHydrant.closes + ". Status: " + PL.statusLabel(myHydrant.status) + ".");
    fill("todayBody", today.map(function (b) {
      const d = user(b.driver);
      return "<tr><td>" + b.id + "</td><td>" + b.slot + "</td><td>" + gallons(b.size) + "</td><td>" + tanker(b.tanker).plate + "</td><td>" + (d ? d.name : "-") + "</td><td>" + badge(b.status) + "</td></tr>";
    }).join(""));
  }

  list({
    body: "hydrantBookingsBody", items: hydrantBookings, cols: 8, form: "obFilter", search: "oSearch", sort: "oSort",
    filters: [["oStatus", function (i, v) { return i.status === v; }]],
    info: "oInfo", prev: "oPrev", next: "oNext", pageSize: 6,
    text: function (b) { return [b.id, zone(b.zone).name, b.address].join(" "); },
    row: function (b) {
      const t = tanker(b.tanker);
      const d = user(b.driver);
      let a = detailBtn(b);
      if (b.status === "approved") a += btn("Assign", "btn-primary", 'data-open="assignDialog" data-ref="' + b.id + '"');
      if (b.status === "assigned") a += btn("Mark filled", "btn-aqua", 'data-act="filled"');
      if (b.status === "filled") a += btn("Tanker left", "btn-aqua", 'data-act="left"');
      return "<tr><td>" + b.id + "</td><td>" + delivery(b) + "</td><td>" + gallons(b.size) + "</td><td>" + zone(b.zone).name + "</td><td>" + badge(b.status) + "</td><td>" + (t ? t.plate : "-") + "</td><td>" + (d ? d.name : "-") + "</td>" + cell(a) + "</tr>";
    }
  });

  if ($("assignTanker")) {
    fill("assignTanker", options(PL.tankers.filter(function (t) { return t.hydrant === myHydrantId && t.status === "available"; }).map(function (t) { return [t.id, t.plate + " (" + num(t.size) + " gal)"]; }), "Select tanker"));
    fill("assignDriver", options(PL.users.filter(function (u) { return u.role === "driver" && u.hydrant === myHydrantId; }).map(function (u) { return [u.id, u.name]; }), "Select driver"));
  }

  if ($("hydrantBadge")) {
    const el = $("hydrantBadge");
    el.className = "badge " + badgeClass[myHydrant.status];
    el.textContent = PL.statusLabel(myHydrant.status);
    setText("hydrantInfo", myHydrant.name + ". Open " + myHydrant.opens + " - " + myHydrant.closes + ". Daily quota " + gallons(myHydrant.quota) + ".");
    const toggle = $("hydrantToggle");
    if (toggle) toggle.textContent = myHydrant.status === "active" ? "Mark unavailable" : "Mark available";
  }
  fill("tankersBody", PL.tankers.filter(function (t) { return t.hydrant === myHydrantId; }).map(function (t) {
    return "<tr><td>" + t.plate + "</td><td>" + gallons(t.size) + "</td><td>" + badge(t.status) + "</td>" +
      cell(btn(t.status === "available" ? "Mark unavailable" : "Mark available", "btn-line", 'data-act="tanker"')) + "</tr>";
  }).join(""));

  if ($("tripList")) {
    const render = function () {
      const f = $("tripStatus").value;
      const all = PL.bookings.filter(function (b) { return b.driver === PL.current.driver; });
      const items = all.filter(function (b) {
        if (f === "active") return ["assigned", "filled", "on-the-way", "arrived"].indexOf(b.status) !== -1;
        return !f || b.status === f;
      }).sort(function (a, b) { return a.date > b.date ? 1 : -1; });
      const box = $("tripList");
      box.innerHTML = "";
      if (!items.length) {
        box.innerHTML = '<p class="hint">No trips found.</p>';
        return;
      }
      items.forEach(function (b) {
        const node = $("tripTemplate").content.cloneNode(true);
        const set = function (name, value) { node.querySelector('[data-field="' + name + '"]').textContent = value; };
        set("id", b.id);
        set("status", PL.statusLabel(b.status));
        node.querySelector('[data-field="status"]').className = "badge " + badgeClass[b.status];
        set("slot", delivery(b));
        set("address", b.address);
        set("size", gallons(b.size));
        set("tanker", tanker(b.tanker).plate);
        set("customer", user(b.customer).name);
        const live = ["assigned", "filled", "on-the-way", "arrived"].indexOf(b.status) !== -1;
        node.querySelector('[data-action="arrived"]').hidden = !live || b.status === "arrived";
        node.querySelector('[data-action="delivered"]').hidden = b.status !== "arrived";
        node.querySelector('[data-action="failed"]').hidden = !live;
        node.querySelector('[data-action="failed"]').dataset.open = "failDialog";
        node.querySelector('[data-action="failed"]').dataset.ref = b.id;
        node.querySelector('[data-action="arrived"]').dataset.act = "arrived";
        node.querySelector('[data-action="delivered"]').dataset.act = "delivered";
        if (!live) node.querySelector(".trip-actions").hidden = true;
        box.appendChild(node);
      });
    };
    $("tripStatus").addEventListener("change", render);
    if ($("tripFilter")) $("tripFilter").addEventListener("submit", function (e) { e.preventDefault(); render(); });
    render();
  }

  list({
    body: "historyBody", items: PL.bookings.filter(function (b) { return b.driver === PL.current.driver && ["delivered", "confirmed", "failed"].indexOf(b.status) !== -1; }),
    cols: 6, form: "histFilter", sort: "hSort",
    filters: [["hStatus", function (i, v) { return i.status === v; }]],
    info: "hInfo", prev: "hPrev", next: "hNext", pageSize: 6,
    text: function (b) { return b.id + " " + b.address; },
    row: function (b) {
      return "<tr><td>" + b.id + "</td><td>" + fmtDate(b.date) + "</td><td>" + b.address + "</td><td>" + gallons(b.size) + "</td><td>" + badge(b.status) + "</td><td>" + (b.reason || "-") + "</td></tr>";
    }
  });

  if ($("statusBars")) {
    const all = PL.bookings;
    const done = all.filter(function (b) { return b.status === "delivered" || b.status === "confirmed"; });
    setText("statBookings", all.length);
    setText("statRevenue", num(done.reduce(function (n, b) { return n + b.price; }, 0)));
    setText("statGallons", num(done.reduce(function (n, b) { return n + b.size; }, 0)));
    setText("statSubsidised", all.filter(function (b) { return b.type === "subsidised"; }).length);
    const counts = {};
    all.forEach(function (b) { counts[b.status] = (counts[b.status] || 0) + 1; });
    const keys = Object.keys(counts);
    const max = Math.max.apply(null, keys.map(function (k) { return counts[k]; }));
    fill("statusBars", keys.map(function (k) {
      return '<div class="bar"><span>' + PL.statusLabel(k) + '</span><i style="width:' + counts[k] / max * 55 + '%"></i><b>' + counts[k] + "</b></div>";
    }).join(""));
    fill("hydrantUsage", PL.hydrants.map(function (h) {
      const pct = Math.round(h.used / h.quota * 100);
      return '<div class="bar"><span>' + h.name.replace(" Hydrant", "") + '</span><i style="width:' + pct * 0.55 + '%"></i><b>' + pct + "%</b></div>";
    }).join(""));
    fill("zoneReportBody", PL.zones.map(function (z) {
      const zb = all.filter(function (b) { return b.zone === z.id; });
      const zd = zb.filter(function (b) { return b.status === "delivered" || b.status === "confirmed"; });
      return "<tr><td>" + z.name + "</td><td>" + zb.length + "</td><td>" + num(zd.reduce(function (n, b) { return n + b.size; }, 0)) + "</td><td>" + num(zd.reduce(function (n, b) { return n + b.price; }, 0)) + "</td></tr>";
    }).join(""));
    if ($("reportFilter")) $("reportFilter").addEventListener("submit", function (e) { e.preventDefault(); toast("Preview only: report dates are not connected yet."); });
  }

  const editBtns = function () { return btn("Edit", "btn-line", 'data-act="edit"') + btn("Delete", "btn-danger", 'data-act="delete"'); };
  const hydrantOptions = options(PL.hydrants.map(function (h) { return [h.id, h.name]; }));
  fill("zoneHydrants", hydrantOptions);
  if ($("tankerSize")) {
    fill("tankerSize", options(PL.rates.map(function (r) { return [r.size, num(r.size) + " gallons"]; }), "Select size"));
    fill("tankerHydrant", options(PL.hydrants.map(function (h) { return [h.id, h.name]; }), "Select hydrant"));
    fill("tSizeFilter", options(PL.rates.map(function (r) { return [r.size, num(r.size) + " gallons"]; }), "All sizes"));
    fill("tHydrantFilter", options(PL.hydrants.map(function (h) { return [h.id, h.name]; }), "All hydrants"));
  }
  if ($("userZone")) {
    fill("userZone", options(PL.zones.map(function (z) { return [z.id, z.name]; }), "Not applicable"));
    fill("userHydrant", options(PL.hydrants.map(function (h) { return [h.id, h.name]; }), "Not applicable"));
  }

  list({
    body: "zonesBody", items: PL.zones, cols: 3, form: "zoneFilter", search: "zSearch", info: "zInfo", prev: "zPrev", next: "zNext", pageSize: 6,
    text: function (z) { return z.name; },
    row: function (z) {
      return "<tr><td>" + z.name + "</td><td>" + z.hydrants.map(function (h) { return hydrant(h).name; }).join(", ") + "</td>" + cell(editBtns()) + "</tr>";
    }
  });

  list({
    body: "hydrantsBody", items: PL.hydrants, cols: 5, form: "hydrantFilter", search: "hSearch", info: "hInfo", prev: "hPrev", next: "hNext", pageSize: 6,
    filters: [["hStatusFilter", function (i, v) { return i.status === v; }]],
    text: function (h) { return h.name; },
    row: function (h) {
      return "<tr><td>" + h.name + "</td><td>" + gallons(h.quota) + " per day</td><td>" + h.opens + " - " + h.closes + "</td><td>" + badge(h.status) + "</td>" + cell(editBtns()) + "</tr>";
    }
  });

  list({
    body: "tankersBody", items: PL.tankers, cols: 5, form: "tankerFilter", search: "tSearch", info: "tInfo", prev: "tPrev", next: "tNext", pageSize: 6,
    filters: [["tSizeFilter", function (i, v) { return String(i.size) === v; }], ["tHydrantFilter", function (i, v) { return i.hydrant === v; }]],
    text: function (t) { return t.plate; },
    row: function (t) {
      return "<tr><td>" + t.plate + "</td><td>" + gallons(t.size) + "</td><td>" + hydrant(t.hydrant).name + "</td><td>" + badge(t.status) + "</td>" + cell(editBtns()) + "</tr>";
    }
  });

  if ($("ratesBody")) {
    fill("ratesBody", PL.rates.map(function (r) {
      return "<tr><td>" + gallons(r.size) + "</td><td>" + rs(r.commercial) + "</td><td>" + rs(r.subsidised) + "</td>" + cell(btn("Edit", "btn-line", 'data-act="edit"')) + "</tr>";
    }).join(""));
    if ($("limitGallons")) $("limitGallons").value = PL.limitGallons;
  }

  list({
    body: "usersBody", items: PL.users, cols: 6, form: "userFilter", search: "uSearch", info: "uInfo", prev: "uPrev", next: "uNext", pageSize: 8,
    filters: [["uRole", function (i, v) { return i.role === v; }], ["uActive", function (i, v) { return (v === "active") === i.active; }]],
    text: function (u) { return u.name + " " + u.phone; },
    row: function (u) {
      const where = u.zone ? zone(u.zone).name : u.hydrant ? hydrant(u.hydrant).name : "-";
      const r = u.role === "officer" ? "Zone officer" : u.role === "operator" ? "Hydrant operator" : u.role === "admin" ? "Administrator" : PL.statusLabel(u.role);
      return "<tr><td>" + u.name + "</td><td>" + u.phone + "</td><td>" + r + "</td><td>" + where + "</td><td>" + badge(u.active ? "active" : "unavailable").replace("Unavailable", "Disabled") + "</td>" +
        cell(btn("Edit", "btn-line", 'data-act="edit"') + btn(u.active ? "Disable" : "Enable", "btn-danger", 'data-act="toggle"')) + "</tr>";
    }
  });

  if ($("calcSize")) {
    fill("calcSize", options(PL.rates.map(function (r) { return [r.size, num(r.size) + " gallons"]; }), "Select size"));
    const calc = function () {
      const size = Number($("calcSize").value);
      setText("calcTotal", size ? rs(PL.priceOf(size, $("calcType").value)) : "Rs -");
    };
    $("calcSize").addEventListener("change", calc);
    $("calcType").addEventListener("change", calc);
    $("calcSize").value = "3000";
    calc();
  }
  if ($("ratesGrid")) {
    fill("ratesGrid", PL.rates.map(function (r, i) {
      const off = Math.round((1 - r.subsidised / r.commercial) * 100);
      return '<div class="card price-card' + (i === 1 ? " featured" : "") + '">' + (i === 1 ? '<span class="tag">Most popular</span>' : "") +
        "<h3>" + PL.plans[i] + '</h3><div class="size">' + num(r.size) + ' gallons per tanker</div><div class="amount">' + rs(r.commercial) + " <small>commercial</small></div>" +
        "<ul><li>Subsidised rate: <b>" + rs(r.subsidised) + "</b></li><li>Subsidised customers save <b>" + off + "%</b></li><li>Delivered to your door</li><li>Filled at your zone hydrant</li></ul>" +
        '<a class="btn ' + (i === 1 ? "btn-aqua" : "btn-primary") + ' btn-block" href="login.html">Book ' + num(r.size) + " gallons</a></div>";
    }).join(""));
  }
  setText("statCustomers", num(PL.site.customers));
  setText("statBookings", num(PL.site.bookings));
  setText("statDeliveries", num(PL.site.deliveries));
  setText("statHydrants", PL.hydrants.length);
  fill("rateTableBody", PL.rates.map(function (r) {
    return "<tr><td>" + gallons(r.size) + "</td><td>" + rs(r.commercial) + "</td><td>" + rs(r.subsidised) + "</td></tr>";
  }).join(""));
  fill("signupZone", options(PL.zones.map(function (z) { return [z.id, z.name]; }), "Select your zone"));

  const placeUrls = function (z) {
    return {
      embed: "https://maps.google.com/maps?q=" + encodeURIComponent(z.query) + "&z=14&hl=en&output=embed",
      open: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(z.query)
    };
  };
  const routeUrls = function (z) {
    const h = hydrant(z.hydrants[0]);
    const stops = z.stops.map(function (s) { return s[1] + "," + s[2]; });
    return {
      embed: "https://maps.google.com/maps?saddr=" + h.lat + "," + h.lng + "&daddr=" + stops.join("+to:") + "&hl=en&output=embed",
      open: "https://www.google.com/maps/dir/?api=1&origin=" + h.lat + "," + h.lng + "&destination=" + stops[stops.length - 1] +
        "&waypoints=" + encodeURIComponent(stops.slice(0, -1).join("|")) + "&travelmode=driving"
    };
  };
  const showMap = function (frameId, z, urlFor) {
    const u = urlFor(z);
    $(frameId).src = u.embed;
    const link = $("routeLink");
    if (link) link.href = u.open;
  };
  const chipMap = function (chipsId, frameId, urlFor) {
    const box = $(chipsId);
    if (!box || !$(frameId)) return;
    box.innerHTML = PL.zones.map(function (z) {
      return '<button class="chip" type="button" data-zone="' + z.id + '">' + z.name + "</button>";
    }).join("");
    const pick = function (id) {
      box.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c.dataset.zone === id); });
      showMap(frameId, zone(id), urlFor);
    };
    box.addEventListener("click", function (e) {
      const c = e.target.closest("[data-zone]");
      if (c) pick(c.dataset.zone);
    });
    pick(PL.zones[0].id);
  };

  chipMap("zoneChips", "zoneMap", placeUrls);
  if ($("routeMap")) {
    if ($("routeMap").dataset.scope === "all") {
      chipMap("routeChips", "routeMap", routeUrls);
    } else {
      const mine = PL.zones.find(function (z) { return z.hydrants.indexOf(myHydrantId) !== -1; });
      showMap("routeMap", mine, routeUrls);
    }
  }
})();
