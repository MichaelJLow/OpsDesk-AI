import { GmailMark } from "@/app/components/source-marks";
import { formatWhen } from "@/lib/format";

type Props = {
  body: string | null;
  senderName: string;
  senderEmail: string;
  receivedAt: string;
  attachmentLabel?: string;
};

export function ResidentMessagePanel({
  body,
  senderName,
  senderEmail,
  receivedAt,
  attachmentLabel = "email-thread.txt",
}: Props) {
  return (
    <section className="message-panel inbound" aria-label="Resident message">
      <div className="message-panel-inner">
        <div className="section-heading-row">
          <div className="section-heading-main">
            <h3>Resident message</h3>
            <GmailMark />
          </div>
        </div>
        <p className="message-meta">
          From {senderName} · {senderEmail} · {formatWhen(receivedAt)}
        </p>
        <div className="message-body">
          {body?.trim() || "(empty body)"}
        </div>
        <div className="attachment-row">
          <span className="attachment-chip">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M21.44 11.05l-8.49 8.49a5 5 0 0 1-7.07-7.07l8.49-8.49a3.5 3.5 0 0 1 4.95 4.95l-8.49 8.49a2 2 0 1 1-2.83-2.83l7.78-7.78" />
            </svg>
            {attachmentLabel}
          </span>
        </div>
      </div>
    </section>
  );
}
