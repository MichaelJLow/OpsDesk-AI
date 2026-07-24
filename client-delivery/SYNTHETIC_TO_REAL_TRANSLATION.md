# Synthetic → Real Translation Matrix

| Synthetic demonstration | Real-company equivalent | Discovery required |
|---|---|---|
| Gmail test inbox / plus-alias | Shared operations inbox | Access, ownership, volume, labels |
| HubSpot developer account | Existing CRM | Objects, scopes, source of truth |
| Slack test workspace | Slack or Teams | Channels, escalation, roles |
| Supabase synthetic data | Existing systems or sidecar DB | Ownership, sync, migration |
| Synthetic properties/sites | Real property/site records | IDs, quality, duplicates |
| Synthetic contractors | Approved supplier list | Capability, status, quals |
| Fictional policies | Real SOPs / approval policies | Owners, versions, authority |
| Fixed approval threshold | Client authority matrix | Roles, limits, exceptions |
| Labelled scenarios | Historical / curated cases | Anonymisation, consent |
| Demo dashboard | Operator workspace | Roles, adoption, accessibility |
| DEC-008 local TLS workaround | Proper corp CA / network policy | Never copy into client prod |

## Assumptions to revalidate

- Volume and SLA expectations  
- Who may approve spend  
- What “urgent” means operationally  
- Document freshness and ownership  

## Never copy blindly

- Synthetic contacts or properties into production  
- Service-role keys into browsers  
- Local TLS verify-disable settings  
- Unreviewed rule packs  
