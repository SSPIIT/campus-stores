# Campus Stores

Campus Stores is a Product Engineer work sample set at a fictional campus media equipment desk. Work through a club’s screening, from equipment pickup to a partial return and the next morning’s handover. Open **Candidate brief** in the app for the assignment.

## My submission: Kit status for partial returns

**Start here:** open `index.html`, play the shift, and look at **Requests**, which now has a *Waiting to come back* list and a *Kit status* panel on each request.

### One moment the product handles well (keep it)
At Friday 3:45 pm, issuing the Film Society kit to Kabir: the issue slip only offers units that are on the shelf. The projector in repair (PR-06) never appears, so it can't be handed out by mistake. When I tried to issue the camera on RQ-214, the app blocked it as outside the approved request. It also refuses a second unit of the same type. These rules are right, and I kept all of them unchanged.

### One moment I would change
At Friday 7:30 pm, Kabir brought back the projector and speaker and said Leela still had the adapter. The app could only close a slip or leave it open. The adapter slip still said *Kabir Sen, due Fri 8 pm*, and the fact that Leela had it lived only as a chat message in the Desk book.

At Saturday 9 am, as the morning shift, I had to read the Desk book, then the Loan register (which shows the Debate Union mic and the adapter as open slips), then Inventory, to work out which loan Leela's adapter belonged to. There are two identical USB-C → HDMI adapters (AD-12 Belkin and AD-15 Anker) in the same bin, C4, and nothing warned me to check which one came back. The facts were all in the app but spread across four tabs and free text.

### The change
The loan record now holds what actually happened, and the request shows the state of the whole kit.

1. **Kit status panel** on each request: every approved item with its unit (ID and model), slip number, who has it, and Not issued / Out / Returned. There's a summary line such as *2 of 3 returned · 1 out*.
2. **"Still with someone else"** on an item that is out records the new holder and when they will bring it back, on the slip itself (*Now with Leela Das · back Sat 9 am · issued to Kabir Sen*). The Loan register shows the same line.
3. **Waiting to come back** list at the top of Requests: every open slip with who has it and when it is due, a one-click **Record return**, and a *Check the label* warning when a look-alike unit exists (*AD-12 (Belkin AVC002) looks the same*).
4. **Status at a glance:** each request in the list shows *Not issued*, *1 of 3 out* or *All returned*, and "out" states are highlighted.

### The same job with the change
- **Fri 3:45 pm:** issue PR-04, SP-02 and AD-15 to Kabir as before. Kit status shows 3 out.
- **Fri 7:30 pm:** open *Courtyard screening* and **Record return** on the projector and speaker. On the adapter, choose **Still with someone else** → Leela Das, Sat 9 am. The kit reads *2 of 3 returned · 1 out*.
- **Sat 9 am:** the morning shift opens Requests and sees *Waiting to come back*: AD-15 Anker, Film Society, with Leela Das, back Sat 9 am, with a note to check the label against AD-12. They check the unit in Leela's hand and click **Record return**. The mic slip for Debate Union is clearly a different club and person, so it isn't touched.

### What I kept
The data model (one slip per physical unit), the issue rules, the Loan register, Inventory and the Desk book. Desk-book notes are still there for anything unusual, but the facts the next shift needs are no longer only in free text.

### What I'd watch at a real counter
When a returning student hands over an item that someone else issued, I'd time from "here's the adapter" to the slip being closed, and count wrong slips closed (wrong unit, or the wrong club's slip). If the change works, morning-shift returns get faster and wrong-slip closures drop to zero, without staff opening the Desk book.

### Files changed
- `app.js`: kit status, partial-return holder on the slip, waiting list, look-alike warning.
- `styles.css`: styling for the new panels and highlighted "out" states.

---

## Run the app

Open `index.html` in a modern browser. The app includes its scripts, styles, and icons and can run offline.

To serve it over local HTTP, run this from the repository folder and visit `http://localhost:8000`.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Each browser stores its own sample shift locally when browser storage is available. **Restart sample shift** restores the fictional starting records.

## Source

- `index.html` contains the desk layout, candidate brief, and bundled icons.
- `app.js` contains the sample records and interactions.
- `styles.css` defines the desktop and mobile layouts.

Icon license notices are in [third-party/lucide-LICENSE.txt](third-party/lucide-LICENSE.txt).


## Submit your work

1. [Fork Campus Stores](https://github.com/virinchi-healthcare/campus-stores/fork) into your GitHub account. Complete the candidate brief and push your changes to your public fork. In your README, point reviewers to your work and explain the decision you made.
2. In your fork, open **Commits**, select the final commit you want reviewed, and copy the page URL. It should look like `https://github.com/YOUR-USERNAME/campus-stores/commit/COMMIT-SHA`.
3. [Submit your work through the Google Form](https://docs.google.com/forms/d/e/1FAIpQLScvzoh1R4WS-SkiwAVBQbMvniieJYSoOEfLMyVo5CyjOvYUgQ/viewform). Your **roll number**, **email ID**, and **final commit link from your public fork** are required. Enter your roll number and email ID in the form only.