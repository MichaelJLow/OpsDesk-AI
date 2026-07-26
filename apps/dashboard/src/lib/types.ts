export type OpsRequest = {
  id: string;
  external_message_id: string;
  sender_email: string;
  subject: string | null;
  raw_body: string | null;
  category: string | null;
  confidence: number | null;
  status: string;
  urgency: string | null;
  received_at: string;
  created_at: string;
  company_id?: string | null;
  contact_id?: string | null;
};

export type OpsContact = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  authorised_for_account_changes: boolean;
  company_id: string | null;
};

export type OpsCompany = {
  id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  lifecycle_stage: string | null;
  status: string;
};

export type OpsSite = {
  id: string;
  name: string;
  address_line: string | null;
  status: string;
};

export type StructuredExtraction = {
  vertical?: string;
  category?: string;
  confidence?: number;
  urgency?: string;
  siteReference?: string | null;
  unitReference?: string | null;
  assetType?: string | null;
  issueSummary?: string;
  accessNotes?: string | null;
  heatingStillWorking?: boolean | null;
  missingInformation?: string[];
  suggestedRoute?: string;
  [key: string]: unknown;
};

export type RequestExtraction = {
  id: string;
  request_id: string;
  model_provider: string | null;
  model_name: string | null;
  prompt_version: string | null;
  structured_output: StructuredExtraction | null;
  validation_status: string;
  created_at: string;
};

export type ProposedAction = {
  id: string;
  request_id: string;
  action_type: string;
  payload: {
    channel?: string;
    draftText?: string;
    sender?: string;
    [key: string]: unknown;
  } | null;
  reason: string | null;
  risk_level: string | null;
  requires_approval: boolean;
  status: string;
  created_at: string;
};

export type WorkflowEvent = {
  id: string;
  request_id: string | null;
  event_type: string;
  step_name: string | null;
  status: string;
  payload: unknown;
  error: string | null;
  occurred_at: string;
};
