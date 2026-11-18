(() => {
  const storageKey = "campus-stores.shift.v1";
  const root = document.getElementById("campus-stores");
  const q = (selector) => root.querySelector(selector);
  const requests = [
    {
      id: "RQ-214",
      club: "Film Society",
      event: "Courtyard screening",
      owner: "Isha Rao",
      due: "Fri 8 pm",
      items: ["HDMI projector", "Portable speaker", "USB-C → HDMI adapter"],
      note: "Playback is from a USB-C-only laptop. The host will collect at 4 pm.",
    },
    {
      id: "RQ-209",
      club: "Debate Union",
      event: "Finals rehearsal",
      owner: "Tara Shah",
      due: "Sat 10 am",
      items: ["Wireless microphone"],
      note: "Rehearsal runs into the evening.",
    },
    {
      id: "RQ-217",
      club: "Photo Circle",
      event: "Street portrait walk",
      owner: "Dev Menon",
      due: "Sat noon",
      items: ["Digital camera"],
      note: "Collection on Saturday morning.",
    },
  ];
  const assets = [
    { id: "PR-04", type: "HDMI projector", model: "BenQ MH550", bin: "A2" },
    {
      id: "PR-06",
      type: "HDMI projector",
      model: "Epson EB-X49",
      bin: "Workshop",
      repair: true,
    },
    { id: "SP-02", type: "Portable speaker", model: "JBL Eon One", bin: "B1" },
    { id: "SP-05", type: "Portable speaker", model: "Bose S1", bin: "B2" },
    {
      id: "AD-12",
      type: "USB-C → HDMI adapter",
      model: "Belkin AVC002",
      bin: "C4",
    },
    {
      id: "AD-15",
      type: "USB-C → HDMI adapter",
      model: "Anker A8312",
      bin: "C4",
    },
    { id: "MI-09", type: "Wireless microphone", model: "Shure BLX", bin: "B3" },
    { id: "CA-03", type: "Digital camera", model: "Sony A6400", bin: "D2" },
  ];
  const people = [
    "Isha Rao",
    "Kabir Sen",
    "Leela Das",
    "Tara Shah",
    "Dev Menon",
  ];
  const shifts = [
    {
      time: "Friday · 3:45 pm",
      title: "Pickup at the counter",
      text: "Kabir is here for the Film Society screening. The film starts at four. Can he leave with everything he needs?",
      next: "Move to return time",
    },
    {
      time: "Friday · 7:30 pm",
      title: "The kit comes back in pieces",
      text: "Kabir has brought back the projector and speaker. “Leela still has the adapter. She’ll drop it off tomorrow at nine.” Take the return and hand over to the morning shift.",
      next: "Move to next morning",
    },
    {
      time: "Saturday · 9:00 am",
      title: "Morning shift",
      text: "You’ve just taken over. Leela walks in with an adapter. Work out what was outstanding from the screening and close the loan for the right item.",
    },
  ];
  const pages = [
    ["Today", "package-open"],
    ["Requests", "clipboard-list"],
    ["Inventory", "package"],
    ["Loan register", "book-open"],
    ["Desk book", "messages-square"],
  ];
  const original = () => ({
    version: 1,
    tab: "Today",
    phase: 0,
    kitting: "",
    selected: "",
    filter: "All items",
    loans: [
      {
        num: 401,
        req: "RQ-209",
        asset: "MI-09",
        who: "Tara Shah",
        due: "Sat 10 am",
        back: false,
      },
    ],
    notes: [],
    editing: false,
    returning: "",
    onlyOpen: true,
    notice: "Sample shift · All records are fictional.",
  });
  let s = original();
  const getAsset = (id) => assets.find((x) => x.id === id);
  const getReq = (id) => requests.find((x) => x.id === id);
  const out = (id) => s.loans.find((l) => l.asset === id && !l.back);
  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const opts = (list) =>
    list
      .map(([v, t]) => '<option value="' + esc(v) + '">' + esc(t) + "</option>")
      .join("");
  const btn = (label, act, val = "", style = "") =>
    '<button type="button" data-action="' +
    act +
    '" data-val="' +
    esc(val) +
    '" class="' +
    style +
    '">' +
    esc(label) +
    "</button>";
  const head = (title, sub, control = "") =>
    '<div class="sectionhead"><div><h2>' +
    title +
    "</h2><small>" +
    sub +
    "</small></div>" +
    control +
    "</div>";
  const row = (label, sub, right) =>
    '<div class="row"><div><strong>' +
    esc(label) +
    "</strong><small>" +
    esc(sub) +
    "</small></div><div>" +
    right +
    "</div></div>";
  const badge = (t, good = false) =>
    '<span class="tag' +
    (good ? " good" : /(^Out$|out$|^On loan$)/.test(t) ? " warn" : "") +
    '">' +
    esc(t) +
    "</span>";
  // Kit status: one line per approved item, built from the loan slips,
  // so anyone on any shift can see what is still out and with whom.
  function kitLines(r) {
    return r.items.map((type) => {
      const slips = s.loans.filter(
        (l) => l.req === r.id && getAsset(l.asset).type === type,
      );
      const loan = slips.find((l) => !l.back) || slips[slips.length - 1];
      let state = "Not issued";
      if (loan) state = loan.back ? "Returned" : "Out";
      return { type, loan, state };
    });
  }
  function kitSummary(r) {
    const lines = kitLines(r);
    const out = lines.filter((x) => x.state === "Out").length;
    const back = lines.filter((x) => x.state === "Returned").length;
    if (!out && !back) return badge("Not issued");
    if (!out) return badge("All returned", true);
    return badge(out + " of " + lines.length + " out");
  }
  function kitPanel(r) {
    const lines = kitLines(r);
    const outCount = lines.filter((x) => x.state === "Out").length;
    const backCount = lines.filter((x) => x.state === "Returned").length;
    let html =
      '<div class="kit"><div class="kithead"><h3>Kit status</h3><small>' +
      backCount +
      " of " +
      lines.length +
      " returned · " +
      outCount +
      " out</small></div>";
    for (const { type, loan, state } of lines) {
      const unit = loan ? getAsset(loan.asset) : null;
      let sub = "No unit issued yet";
      if (unit) {
        sub = unit.id + " · " + unit.model + " · Slip L-" + loan.num + " · ";
        if (loan.back) sub += "Back in stock";
        else if (loan.holder)
          sub +=
            "Now with " +
            loan.holder +
            " · Back " +
            loan.holderDue +
            " · Issued to " +
            loan.who;
        else sub += "With " + loan.who + " · Due " + loan.due;
      }
      let actions = badge(state, state === "Returned");

      html +=
        '<div class="row kitrow ' +
        (state === "Out" ? "isout" : state === "Returned" ? "isback" : "") +
        '"><div><strong>' +
        esc(type) +
        "</strong><small>" +
        esc(sub) +
        '</small></div><div class="kitactions">' +
        actions +
        "</div></div>";
    }
    return html + "</div>";
  }
  // "Waiting to come back": open slips grouped by club kit, with who has
  // each unit now, so a shift that did not issue it can close the right one.
  function unitLine(l) {
    const a = getAsset(l.asset);
    const twins = assets.filter(
      (x) => x.type === a.type && x.id !== a.id && x.bin === a.bin,
    );
    return (
      "<strong>" +
      esc(a.id + " · " + a.type) +
      "</strong><small>" +
      esc(
        a.model +
          " · Slip L-" +
          l.num +
          " · " +
          (l.holder
            ? "With " + l.holder + " · back " + l.holderDue + " · issued to " + l.who
            : "With " + l.who + " · due " + l.due),
      ) +
      "</small>" +
      (twins.length
        ? '<small class="checklabel">Check the label: ' +
          esc(twins.map((t) => t.id + " (" + t.model + ")").join(", ")) +
          " looks the same.</small>"
        : "")
    );
  }
  function waitingList() {
    const open = s.loans.filter((l) => !l.back);
    if (!open.length) return "";
    let html =
      '<div class="waiting"><div class="kithead"><h3>Waiting to come back</h3><small>' +
      open.length +
      " unit" +
      (open.length > 1 ? "s" : "") +
      " out</small></div>";
    const reqIds = [...new Set(open.map((l) => l.req))];
    for (const id of reqIds) {
      const r = getReq(id);
      const mine = open.filter((l) => l.req === id);
      html +=
        '<div class="kitgroup"><div class="row"><div><strong>' +
        esc(r.club + " · " + r.event) +
        "</strong><small>" +
        mine.length +
        " item" +
        (mine.length > 1 ? "s" : "") +
        " out · " +
        esc(r.id) +
        '</small></div><div class="kitactions">' +
        (s.returning === id ? "" : btn("Return kit", "retkit", id, "primary")) +
        "</div></div>";
      if (s.returning === id) html += returnForm(mine);
      else
        for (const l of mine)
          html += '<div class="row kitrow isout"><div>' + unitLine(l) + "</div></div>";
      html += "</div>";
    }
    return html + "</div>";
  }
  // Return kit: one checklist for the whole kit. Anything not ticked stays
  // on its slip, with who has it now and when it will come back.
  function returnForm(mine) {
    const pick = (name, list, current) =>
      '<select name="' +
      name +
      '">' +
      opts(list.map((x) => [x, x])).replace(
        'value="' + esc(current) + '"',
        'value="' + esc(current) + '" selected',
      ) +
      "</select>";
    let html = '<form data-return class="handform">';
    for (const l of mine) {
      html +=
        '<div class="returnrow"><label class="tick"><input type="checkbox" name="back" value="' +
        l.num +
        '" checked /> Back now</label><div>' +
        unitLine(l) +
        '<div class="notback"><span>If not back: with</span>' +
        pick("holder-" + l.num, people, l.holder || l.who) +
        "<span>until</span>" +
        pick(
          "due-" + l.num,
          ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"],
          l.holderDue || l.due,
        ) +
        "</div></div></div>";
    }
    return (
      html +
      '<div class="buttons"><button type="submit" class="primary">Save return</button>' +
      btn("Cancel", "retcancel") +
      "</div></form>"
    );
  }
  function requestPage() {
    let html = head(
      "Approved requests",
      "Student Activities Office · 3 approved forms",
    );

    if (s.selected) {
      const r = getReq(s.selected);
      html +=
        btn("Back to list", "close") +
        '<div class="record"><small>' +
        r.id +
        " · Approved</small><h3>" +
        r.event +
        "</h3><p>" +
        r.club +
        " · Filed by " +
        r.owner +
        "</p><p><b>Return by</b> " +
        r.due +
        "</p><p><b>Approved equipment</b></p><ul>" +
        r.items.map((x) => "<li>" + x + "</li>").join("") +
        "</ul><p>" +
        r.note +
        "</p></div>" +
        kitPanel(r);
    } else
      html += requests
        .map((r) =>
          row(
            r.event,
            r.id + " · " + r.club,
            kitSummary(r) + " " + btn("View form", "request", r.id),
          ),
        )
        .join("");
    return html;
  }
  function inventory() {
    let html = head(
      "Inventory",
      "Physical units · home shelf and current availability",
    );
    html +=
      '<div class="buttons"><label>Show <select data-filter>' +
      opts(
        ["All items", "On shelf", "On loan", "In repair"].map((f) => [f, f]),
      ) +
      "</select></label></div>";
    for (const a of assets) {
      const status = a.repair
        ? "In repair"
        : out(a.id)
          ? "On loan"
          : "On shelf";
      if (s.filter !== "All items" && s.filter !== status) continue;
      html += row(
        a.id + " · " + a.type,
        a.model + " · " + a.bin,
        badge(status, status === "On shelf"),
      );
    }
    return html;
  }
  function register() {
    let html = head(
      "Loan register",
      "One slip per physical unit",
      s.editing
        ? btn("Cancel", "cancel")
        : btn("New issue slip", "new", "", "primary"),
    );
    if (s.editing) {
      const available = assets.filter((a) => !a.repair && !out(a.id));
      const select = (label, key, options) =>
        "<label><span>" +
        label +
        '</span><select name="' +
        key +
        '" required><option value="">Select…</option>' +
        opts(options) +
        "</select></label>";
      return (
        html +
        '<form data-issue><div class="form">' +
        select(
          "Approved request",
          "req",
          requests.map((r) => [r.id, r.id + " · " + r.club]),
        ) +
        select(
          "Unit leaving the desk",
          "asset",
          available.map((a) => [a.id, a.id + " · " + a.type]),
        ) +
        select(
          "Collected by",
          "who",
          people.map((p) => [p, p]),
        ) +
        select(
          "Return by",
          "due",
          ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"].map((d) => [d, d]),
        ) +
        '</div><button type="submit" class="primary">Save issue slip</button></form>'
      );
    }
    html +=
      '<div class="buttons">' +
      ["Outstanding", "All slips"]
        .map(
          (v, i) =>
            '<button type="button" data-action="scope" data-val="' +
            i +
            '" aria-pressed="' +
            (s.onlyOpen === (i === 0)) +
            '">' +
            v +
            "</button>",
        )
        .join("") +
      "</div>";
    const shown = s.loans
      .filter((l) => !s.onlyOpen || !l.back)
      .slice()
      .reverse();
    if (!shown.length) html += "<p>No outstanding slips.</p>";
    for (const l of shown)
      html += row(
        "L-" + l.num + " · " + l.asset,
        l.req +
          " · " +
          l.who +
          " · Due " +
          l.due +
          (l.holder && !l.back
            ? " · Now with " + l.holder + ", back " + l.holderDue
            : ""),
        l.back
          ? badge("Returned")
          : btn("Record return", "return", String(l.num)),
      );
    return html;
  }
  function deskbook() {
    let html = head(
      "Desk book",
      "Messages from clubs and notes for the next shift",
    );
    const entries = [
      [
        "Friday · 3:20 pm",
        "Isha Rao · Film Society",
        "Kabir Sen is picking up our whole screening kit. Please issue it in his name. I’m setting up in the courtyard.",
      ],
      [
        "Friday · 3:30 pm",
        "Tara Shah · Debate Union",
        "Our microphone stays with me overnight. I’ll return it by 10 am Saturday.",
      ],
    ];
    if (s.phase >= 1)
      entries.push([
        "Friday · 7:30 pm",
        "Kabir Sen · Film Society",
        "I brought the projector and speaker. Leela Das has our adapter. She’ll be at the counter at 9 am tomorrow.",
      ]);
    for (const n of s.notes)
      entries.push([shifts[n.phase].time, "Counter handover", n.text]);
    for (const [t, author, body] of entries.slice().reverse())
      html +=
        '<article class="record"><small>' +
        esc(t) +
        "</small><h3>" +
        esc(author) +
        "</h3><p>" +
        esc(body) +
        "</p></article>";
    return (
      html +
      '<form data-note><div class="form"><label class="full"><span>Note for the next shift</span><textarea name="note" rows="2" maxlength="400" required></textarea></label></div><button type="submit">Add handover note</button></form>'
    );
  }
  // Today at the desk: the home screen. Says what the desk is for, what
  // needs handing out, and what is waiting to come back.
  function today() {
    let html = head(
      "Today at the desk",
      "Lend approved equipment to clubs, take it back, and leave the next shift a clear picture.",
    );
    const pending = requests.filter((r) =>
      kitLines(r).some((x) => x.state === "Not issued"),
    );
    html +=
      '<div class="waiting handout"><div class="kithead"><h3>To hand out</h3><small>' +
      pending.length +
      " approved kit" +
      (pending.length === 1 ? "" : "s") +
      "</small></div>";
    if (!pending.length) html += "<p>Nothing waiting to go out.</p>";
    for (const r of pending) {
      const missing = kitLines(r).filter((x) => x.state === "Not issued");
      html +=
        '<div class="row kitrow"><div><strong>' +
        esc(r.club + " · " + r.event) +
        "</strong><small>" +
        esc(
          missing.map((x) => x.type).join(", ") +
            " · Return by " +
            r.due +
            " · " +
            r.note,
        ) +
        '</small></div><div class="kitactions">' +
        (s.kitting === r.id
          ? ""
          : btn("Issue kit", "kit", r.id, "primary")) +
        "</div></div>";
      if (s.kitting === r.id) html += kitForm(r, missing);
    }
    html += "</div>";
    const waiting = waitingList();
    return (
      html +
      (waiting ||
        '<div class="waiting"><div class="kithead"><h3>Waiting to come back</h3></div><p>Nothing is out.</p></div>')
    );
  }
  // One form for the whole kit instead of one slip at a time.
  function kitForm(r, missing) {
    const free = (type) =>
      assets.filter((a) => a.type === type && !a.repair && !out(a.id));
    let html = '<form data-kit class="handform"><div class="form">';
    for (const { type } of missing) {
      const units = free(type);
      html +=
        "<label><span>" +
        esc(type) +
        '</span><select name="unit" required>' +
        (units.length
          ? opts(units.map((a) => [a.id, a.id + " · " + a.model + " · Bin " + a.bin]))
          : '<option value="">None on shelf</option>') +
        "</select></label>";
    }
    html +=
      '<label><span>Collected by</span><select name="who" required><option value="">Select…</option>' +
      opts(people.map((p) => [p, p])) +
      "</select></label>" +
      '<label><span>Return by</span><select name="due" required>' +
      opts(
        ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"].map((d) => [d, d]),
      ).replace('value="' + r.due + '"', 'value="' + r.due + '" selected') +
      "</select></label></div>" +
      '<p class="hint">Check the Desk book if someone else is collecting for the club.</p>' +
      '<div class="buttons"><button type="submit" class="primary">Issue ' +
      missing.length +
      " item" +
      (missing.length === 1 ? "" : "s") +
      "</button>" +
      btn("Cancel", "kitcancel") +
      "</div></form>";
    return html;
  }
  const screens = {
    Today: today,
    Requests: requestPage,
    Inventory: inventory,
    "Loan register": register,
    "Desk book": deskbook,
  };
  function paint() {
    const phase = shifts[s.phase];
    q("[data-clock]").textContent = phase.time;
    q("[data-shift-title]").textContent = phase.title;
    q("[data-shift]").textContent = phase.text;
    const advance = q('[data-action="advance"]');
    advance.hidden = !phase.next;
    advance.textContent = phase.next || "";
    q("[data-nav]").innerHTML = pages
      .map(
        ([n, icon]) =>
          '<button type="button" data-action="tab" data-val="' +
          n +
          '" aria-pressed="' +
          (s.tab === n) +
          '"><svg aria-hidden="true" class="store-icon"><use href="#icon-' +
          icon +
          '"></use></svg>' +
          n +
          "</button>",
      )
      .join("");
    q("[data-page]").innerHTML = screens[s.tab]();
    if (q("[data-filter]")) q("[data-filter]").value = s.filter;
    q("[data-status]").textContent = s.notice;
  }
  function commit(msg) {
    if (msg) s.notice = msg;
    paint();
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      q("[data-status]").textContent +=
        " Browser storage is unavailable. Progress lasts for this visit.";
    }
  }
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const v = b.dataset.val;
    switch (b.dataset.action) {
      case "restart":
        s = original();
        break;
      case "advance":
        if (s.phase < 2) s.phase++;
        s.notice = "Shift time updated.";
        break;
      case "tab":
        s.tab = v;
        s.editing = false;
        s.returning = "";
        s.kitting = "";
        break;
      case "close":
        s.selected = "";
        break;
      case "request":
        s.selected = v;
        break;
      case "new":
        s.editing = true;
        break;
      case "cancel":
        s.editing = false;
        break;
      case "kit":
        s.kitting = v;
        break;
      case "kitcancel":
        s.kitting = "";
        break;
      case "retkit":
        s.returning = v;
        break;
      case "retcancel":
        s.returning = "";
        break;
      case "scope":
        s.onlyOpen = v === "0";
        break;
      case "return": {
        const l = s.loans.find((l) => l.num === Number(v));
        if (!l || l.back) return;
        l.back = true;
        s.returning = "";
        s.notice = l.asset + " returned to stock. Slip L-" + l.num + " closed.";
        break;
      }
    }
    commit();
  });
  root.addEventListener("change", (e) => {
    if (e.target.matches("[data-filter]")) {
      s.filter = e.target.value;
      commit();
    }
  });
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const form = new FormData(f);
    if (f.matches("[data-note]")) {
      const text = String(form.get("note")).trim();
      if (!text) return;
      s.notes.push({ phase: s.phase, text });
      commit("Handover note saved.");
      return;
    }
    if (f.matches("[data-kit]")) {
      const r = getReq(s.kitting);
      const units = form.getAll("unit").map(getAsset);
      const who = form.get("who"),
        due = form.get("due");
      if (!r || !people.includes(who) || !due) return;
      for (const u of units) {
        if (
          !u ||
          u.repair ||
          out(u.id) ||
          !r.items.includes(u.type) ||
          s.loans.some(
            (l) => l.req === r.id && !l.back && getAsset(l.asset).type === u.type,
          )
        ) {
          q("[data-status]").textContent =
            "One of those units is not available. Pick another.";
          return;
        }
      }
      const nums = [];
      for (const u of units) {
        const num = Math.max(...s.loans.map((l) => l.num)) + 1;
        s.loans.push({ num, req: r.id, asset: u.id, who, due, back: false });
        nums.push("L-" + num);
      }
      s.kitting = "";
      commit(
        "Issued " +
          units.map((u) => u.id).join(", ") +
          " to " +
          who +
          " on slips " +
          nums.join(", ") +
          ".",
      );
      return;
    }
    if (f.matches("[data-return]")) {
      const ticked = form.getAll("back").map(Number);
      const mine = s.loans.filter((l) => l.req === s.returning && !l.back);
      const backIds = [],
        later = [];
      for (const l of mine) {
        if (ticked.includes(l.num)) {
          l.back = true;
          backIds.push(l.asset);
          continue;
        }
        const holder = form.get("holder-" + l.num),
          due = form.get("due-" + l.num);
        if (!people.includes(holder) || !due) return;
        l.holder = holder;
        l.holderDue = due;
        later.push(l.asset + " with " + holder + " until " + due);
      }
      s.returning = "";
      commit(
        (backIds.length ? "Returned " + backIds.join(", ") + "." : "") +
          (later.length ? " Still out: " + later.join("; ") + "." : ""),
      );
      return;
    }
    if (!f.matches("[data-issue]")) return;
    const [req, asset, who, due] = ["req", "asset", "who", "due"].map((k) =>
      form.get(k),
    );
    const unit = getAsset(asset),
      r = getReq(req);
    if (!r || !unit || unit.repair || out(asset) || !people.includes(who))
      return;
    if (!r.items.includes(unit.type)) {
      q("[data-status]").textContent =
        "This equipment type is outside the approved request. Choose an approved unit.";
      return;
    }
    if (
      s.loans.some(
        (l) => l.req === req && !l.back && getAsset(l.asset).type === unit.type,
      )
    ) {
      q("[data-status]").textContent =
        "The approved quantity of this equipment type is already on loan.";
      return;
    }
    const num = Math.max(...s.loans.map((l) => l.num)) + 1;
    s.loans.push({ num, req, asset, who, due, back: false });
    s.editing = false;
    commit("Issued " + asset + " to " + who + " on slip L-" + num + ".");
  });
  function restore(d) {
    if (
      !d ||
      d.version !== 1 ||
      !Object.hasOwn(screens, d.tab) ||
      !shifts[d.phase] ||
      (d.selected && !getReq(d.selected)) ||
      !Array.isArray(d.notes) ||
      !d.notes.every(
        (n) => n && shifts[n.phase] && typeof n.text === "string",
      ) ||
      !Array.isArray(d.loans) ||
      !d.loans.length ||
      !d.loans.every(
        (l) =>
          l && getReq(l.req) && getAsset(l.asset) && Number.isInteger(l.num),
      )
    )
      return;
    s = {
      ...original(),
      ...d,
      loans: d.loans.map((l) => ({ ...l })),
      notes: d.notes.map((n) => ({ ...n })),
    };
    // Always open on the home screen, whatever tab was last used.
    s.tab = "Today";
    s.selected = "";
    s.editing = false;
    s.kitting = "";
    s.returning = "";
    paint();
  }
  paint();
  try {
    restore(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
    // Keep the fresh shift when storage is unavailable or the saved data is invalid.
  }
})();