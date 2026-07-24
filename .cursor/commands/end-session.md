Close the current OpsDesk AI build session properly.

1. Inspect all work completed during this session.
2. Run the relevant tests and checks.
3. Compare the result against the current task's acceptance criteria.
4. Update `PROJECT_CONTROL_CENTRE.md`:
   - completed checklist items;
   - current task;
   - next three tasks;
   - blockers;
   - milestone status;
   - evidence ledger;
   - metrics where measured.
5. Update `project-status.json`.
6. Add any significant decisions to the decision log.
7. Add meaningful failures and fixes to the failure log.
8. Confirm whether regression tests were added.
9. Identify screenshots, traces or recordings that should be captured.
10. Do not mark a phase complete unless its exit condition has been demonstrated.
11. Summarise remaining risks.
12. Recommend one Git commit message.

Respond with:

- Work completed
- Tests and evidence
- Control Centre updates
- Decisions recorded
- Failures recorded
- Remaining blockers
- Exact next task
- Recommended commit message
