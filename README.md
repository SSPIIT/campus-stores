# Campus Stores

Campus Stores is a Product Engineer work sample set at a fictional campus media equipment desk. Work through a club’s screening, from equipment pickup to a partial return and the next morning’s handover. 

## My submission: a "Today at the desk" home screen

**Why I chose this:** when I opened the app, I didn't understand what I was supposed to do. I landed on a list of requests, had to click through four tabs to piece the job together, and it took a while just to get Kabir's kit out. So I added a home screen that shows what the desk is for and what needs doing right now.

**To try it:** open `index.html`. The app opens on **Today**, and you can play the whole shift from that one screen.

### What works well (I kept it)
The app is good at stopping mistakes. The projector in repair (PR-06) never shows up as an option, the camera can't be issued on the Film Society's request, and you can't hand out two of the same item. That's what you want at a busy counter, so I left it as it was.

### The moment I changed (what was hard before)
- **Fri 3:45 pm:** Kabir is waiting and the film starts at four. To get one kit out, I had to check Requests, the Desk book and Inventory, then fill the same form in the Loan register three times.
- **Fri 7:30 pm:** the adapter didn't come back because Leela had it. The app could only record that as a chat message.
- **Sat 9 am:** as the new shift, I had to dig through messages to find which loan to close, with two identical adapters in the same bin.

### My change
A **Today at the desk** screen that opens first:
- **To hand out:** approved kits not issued yet. **Issue kit** puts the whole kit in one form, already filled with units from the shelf.
- **Waiting to come back:** what's out, grouped by club, with who has it and when it's due. **Return kit** is a checklist. Untick anything that didn't come back and record who has it.
- **Check the label:** a warning when an identical unit sits in the same bin.

### The same shift, with the change
- **Fri 3:45 pm:** **Issue kit** → Kabir Sen → done. One form, no tab hopping.
- **Fri 7:30 pm:** **Return kit** → untick the adapter → *with Leela Das, until Sat 9 am* → save.
- **Sat 9 am:** the first screen shows *AD-15, with Leela, check the label against AD-12*. Click **Return kit**, save, and it's closed.

### What I'd watch at a real counter
I'd sit with someone on their first shift and time how long it takes from a student walking up to the kit being issued or returned. I'd also check whether they ever close the wrong loan.

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