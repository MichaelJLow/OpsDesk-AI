# Demo pack: Quayside walkthrough

Synthetic data only. Story: [`../portfolio-notes.md`](../portfolio-notes.md).

## How demos work (easy path)

1. **Walkthrough (no email spam):** on the desk, click **Reset & seed walkthrough**.  
   That deletes old test requests and loads **six ready cases** (routine, urgent, chargeable, failure, grounding, evidence).
2. **One live proof (optional):** send a single Gmail into the lab inbox to show real intake → n8n → desk.

You do **not** need to send six emails every time.

Also available from the repo:

```bash
node scripts/seed-demo-walkthrough.mjs
```

(Requires root `.env` with `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. Same Supabase as Vercel, so the hosted desk updates too.)

Lab controls need `DEMO_RESET_ENABLED=true` on Vercel (and local `.env`) for the desk buttons.

---

## Walkthrough cases (after seed)

| Scenario | What to open / click |
|---|---|
| Routine | Draft → Approve → Send (optional) |
| Urgent | Hazard badge + urgent draft |
| Chargeable | Approved chargeable → **Create work order (lab)** |
| Failure | `needs_attention` → **Retry** |
| Grounding | Draft **Internal grounding** citations |
| Evidence pack | **Generate evidence pack** |

Fixtures: [`walkthrough-cases.json`](walkthrough-cases.json).

---

## One live proof email

To: `mikelow92+opsdesk@gmail.com`  
Subject: `Boiler rattling Flat 8 Riverside Court (live proof)`

> Hi, the boiler in Flat 8 at Riverside Court has been rattling for a few days. Heating still works. Access weekdays after 9am.
>
> (This is the single live Gmail proof email for portfolio demos.)

Label/inbox must match the OpsDesk Gmail trigger. Wait for n8n, then open the new row on the desk.

---

## Proven lab scenarios (history)

| Beat | What to show | Proof |
|---|---|---|
| Routine boiler | Email → desk → Slack → draft → Approve → Send | Happy path |
| Urgent / hazard | Water near electrics → urgent channel + hazard badge | DEC-021 |
| Chargeable HITL | Charge tenant → approve → lab work order (no invoice) | Execution stub |
| Integration failure → recovery | HubSpot fail → Retry | DEC-019 |
| Evidence pack | Generate evidence pack | DEC-025 |
| Routing eval | `npm run eval:routing` | DEC-026 |
| Context retrieval | Retrieve context / internal grounding | DEC-027–028 |

Do **not** leave HubSpot pointed at a broken URL after a failure demo. Simulate briefly, then restore.
