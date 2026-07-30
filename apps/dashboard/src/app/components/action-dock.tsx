"use client";

import { DecisionForm } from "../requests/[id]/decision-form";
import { ExecuteWorkOrderForm } from "../requests/[id]/execute-form";
import { SendForm } from "../requests/[id]/send-form";
import { RetryFailureButton } from "../requests/[id]/retry-form";

type DockMode =
  | {
      kind: "chargeable_approve";
      proposedActionId: string;
      requestId: string;
    }
  | {
      kind: "chargeable_execute";
      proposedActionId: string;
      requestId: string;
    }
  | {
      kind: "draft_approve";
      proposedActionId: string;
      requestId: string;
    }
  | {
      kind: "draft_send";
      proposedActionId: string;
      requestId: string;
    }
  | {
      kind: "retry";
      requestId: string;
    }
  | {
      kind: "idle";
      message: string;
    };

export function ActionDock({ mode }: { mode: DockMode }) {
  if (mode.kind === "idle") {
    return (
      <div className="action-dock">
        <div className="dock-status">
          <span className="muted">{mode.message}</span>
        </div>
        <div className="dock-actions">
          <button type="button" className="btn" disabled>
            Add internal note
          </button>
          <button type="button" className="btn" disabled>
            Escalate
          </button>
        </div>
      </div>
    );
  }

  if (mode.kind === "chargeable_approve") {
    return (
      <div className="action-dock">
        <div className="dock-status">
          <span className="warn-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z" />
            </svg>
          </span>
          <span>
            1 decision blocks execution. Approve or reject authority to proceed.
          </span>
        </div>
        <div className="dock-actions">
          <button type="button" className="btn" disabled>
            Add internal note
          </button>
          <button type="button" className="btn" disabled>
            Escalate
          </button>
          <DecisionForm
            proposedActionId={mode.proposedActionId}
            requestId={mode.requestId}
            mode="chargeable_work"
            compact
          />
        </div>
      </div>
    );
  }

  if (mode.kind === "chargeable_execute") {
    return (
      <div className="action-dock">
        <div className="dock-status">
          <span>
            Authority approved. Create a simulated work order — no invoice or
            dispatch.
          </span>
        </div>
        <div className="dock-actions">
          <ExecuteWorkOrderForm
            proposedActionId={mode.proposedActionId}
            requestId={mode.requestId}
          />
        </div>
      </div>
    );
  }

  if (mode.kind === "draft_approve") {
    return (
      <div className="action-dock">
        <div className="dock-status">
          <span className="warn-icon" aria-hidden="true">
            ⚠
          </span>
          <span>Review the proposed reply, then approve or reject.</span>
        </div>
        <div className="dock-actions">
          <button type="button" className="btn" disabled>
            Add internal note
          </button>
          <DecisionForm
            proposedActionId={mode.proposedActionId}
            requestId={mode.requestId}
            mode="draft_reply"
            compact
          />
        </div>
      </div>
    );
  }

  if (mode.kind === "draft_send") {
    return (
      <div className="action-dock">
        <div className="dock-status">
          <span>Reply approved. Sending emails the original resident via n8n.</span>
        </div>
        <div className="dock-actions">
          <SendForm
            proposedActionId={mode.proposedActionId}
            requestId={mode.requestId}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="action-dock">
      <div className="dock-status">
        <span className="warn-icon" aria-hidden="true">
          ⚠
        </span>
        <span>Workflow failed. Retry the failed integration step.</span>
      </div>
      <div className="dock-actions">
        <RetryFailureButton requestId={mode.requestId} />
      </div>
    </div>
  );
}
