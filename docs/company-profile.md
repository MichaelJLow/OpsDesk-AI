# Company Profile — Quayside Property Services

## Overview

**Quayside Property Services** is a fictional small property-maintenance and facilities business used as the first vertical for OpsDesk AI.

OpsDesk AI automates Quayside’s shared operations inbox. All company and customer data in this project is synthetic. Integrations, workflows, approvals and evaluation are real.

## Business snapshot

| Attribute | Value |
|---|---|
| Industry | Property maintenance & facilities services |
| Size | ~12 internal staff |
| Clients | ~25 client organisations (landlords, managing agents, small commercial) |
| Portfolio | ~50 managed sites/properties (residential + light commercial) |
| Contacts | ~60 (landlords, PMs, tenants/occupants, internal) |
| Contractors | ~12 approved trades (plumbing, heating, electrical, roofing, general) |
| Inbox | Shared Gmail operations inbox (dev: `mikelow92+opsdesk@gmail.com` / label `OpsDesk`) |

## Roles

| Role | Responsibility |
|---|---|
| Operations manager | Escalations, approvals, contractor decisions |
| Maintenance coordinators | Triage inbox, book contractors, chase updates |
| Client / property managers | Client relationship, chargeable-work decisions |
| Finance / approval | Threshold approvals for spend |
| External contractors | Attend, quote, complete, evidence |

## Systems (fictional current state + OpsDesk target)

| System | Role |
|---|---|
| Shared Gmail | Primary inbound channel |
| HubSpot | Client organisations and contacts (not request state) |
| Slack | Internal routing / urgent / approvals |
| Spreadsheets + email search | Current-state history and tracking (pain) |
| Supabase | OpsDesk source of truth for requests, sites, assets, jobs, audit |
| Photos / PDFs | Attachments: leaks, boilers, invoices, reports |

## Who sends requests

- Landlords and freeholders  
- Property / managing agents  
- Tenants or occupants  
- Commercial clients  
- Internal staff  
- Approved contractors (updates, quotes, completion notes)

## What arrives

Email text, forwards, photos, invoices, contractor reports, quotes, access notes, tenancy/service documents, phone-call notes typed into email.

## Public description

> OpsDesk AI is a production-style simulation of Quayside Property Services’ operations desk, built with real APIs and synthetic property data so the full request-to-resolution workflow can be demonstrated without exposing confidential information.

## Vertical note

Property maintenance is the **first vertical configuration**. A later **inspection-services** portability proof reuses the same core without forking the engine. See Master Build Brief and `client-delivery/`.
