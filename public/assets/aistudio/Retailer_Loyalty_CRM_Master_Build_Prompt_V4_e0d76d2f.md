# RetailPulse : Retailer Digital Loyalty CRM 

**Premium visual direction + complete functional scope**  
Version 4.0 | Responsive web CRM + retailer PWA/mobile experience

> Use the supplied banking dashboard images as visual-quality references, and the original Retailer Digital Loyalty Platform PDF as the functional source of truth. Preserve all features; redesign the experience rather than copying the old basic dashboard.

## 0. Non-negotiable instruction to the coding agent

You are acting as a principal product designer, design-systems lead, staff frontend engineer, and SaaS platform architect. Build and modify the actual application in the provided repository. Do not stop at a plan, mockup, feature checklist, or static dashboard. The existing basic CRM result is rejected. Replace its visual language and interaction quality with a polished, premium, modern product informed by the two supplied banking dashboard references while preserving the complete retailer loyalty feature scope from the original functional specification PDF.

The banking references are visual inspiration for layout, refinement, colour restraint, rounded-but-controlled surfaces, strong typographic hierarchy, vivid lime accents, compact navigation, layered cards and dashboard composition. Do not copy banking-specific content or make this a banking product. Translate the visual quality into a retailer loyalty CRM. Preserve the actual domain: invoices, points, rewards, gifts, cash redemption, payouts, performance, customers/transactions, campaigns, tasks, support and admin operations.

Do not ask the user to settle obvious design decisions. Inspect the repository, make high-quality design decisions, implement the first coherent release, run it, test it and report what is genuinely working versus mocked.

## 1. Product vision and product surfaces

Create a retailer-centric Digital Loyalty Platform with two connected surfaces: (A) a friendly, high-clarity retailer portal/PWA for store owners and staff; (B) a powerful internal CRM/operations console for programme, support, finance and platform teams. Consumer/customer loyalty screens are enabled only when the programme supports consumer loyalty and the viewer is authorised.

The experience must feel like a premium, thoughtfully art-directed SaaS product, not a generic admin template. It should be calm, bright, clean and highly interactive, with meaningful visualisation and high-quality details. Use the same design system across desktop, tablet and mobile, but adapt the information architecture to each form factor instead of shrinking desktop layouts.

Primary business goals:
- Make points, cash eligibility, payment status and reward progress understandable at a glance.
- Make invoice submission and review traceable from upload to decision and reward credit.
- Support vouchers, physical gifts and cash redemption with transparent eligibility, stock and status.
- Track retailer targets, eligible sales, brands, categories, SKUs, tasks and campaign performance.
- Give operations teams CRM-grade queues, searchable records, safe bulk actions and audit trails.
- Support multi-store, multi-brand and multi-programme contexts without mixing balances or tenant data.

## 2. Visual art direction — match the quality, not the banking content

Use the supplied bright banking dashboards as a quality bar: generous light canvas, soft neutral panels, near-black typography, vivid lime/lime-green highlight, carefully layered surfaces, clean iconography, attractive data charts, crisp pill tabs, compact top navigation, balanced card proportions and restrained shadows. Translate those qualities into loyalty and CRM operations.

Core palette suggestion:
- App canvas: #F5F7F3 or similar warm/cool neutral.
- Surface: #FFFFFF; subtle secondary surface: #F7F8F5.
- Primary ink: #172018 or deep navy/charcoal.
- Brand accent: vivid lime #C8F43D or #C7F54B for selected navigation, primary retailer actions and highlight moments.
- Dark brand accent: deep forest #153B2B for contrast and premium panels.
- Positive: accessible emerald/teal; pending: warm amber; error/risk: muted coral/red; voucher/category accent: restrained violet.
- Keep semantic colours consistent. Lime is an accent, not a background for every component.

Typography:
- Use Inter, Geist, or an equivalent high-quality sans-serif already available.
- Strong heading scale; readable labels; tabular numerals for points and money; avoid oversized text for ordinary tables.
- Use sentence case, concise labels and meaningful helper text.

Surface and layout rules:
- Use an 8px spacing system; 10–16px corner radii for most components; larger feature panels only where composition requires it.
- Thin, low-contrast borders; subtle shadows only for elevation; no thick grey outlines on every card.
- Use a mix of compact cards, chart panels, data tables, segmented controls, side drawers and timeline rows. Vary hierarchy intentionally.
- Use line icons from one coherent icon family. Do not use random emoji as UI icons.
- Use gradients only for occasional brand/hero moments; no default gradient on every metric.
- Avoid huge empty whitespace, huge blank banners, oversized rounded cards, plain unstyled tables, black generic sidebar, disconnected grey boxes, excessive pills, inconsistent radii, decorative illustrations unrelated to loyalty, and a dashboard made only of four KPI cards and one table.
- Add subtle motion for navigation, drawers, charts and state changes (about 150–220ms), respecting reduced-motion settings.

## 3. Responsive application shell and navigation

Desktop CRM:
- Left navigation rail around 228–252px, with brand mark, workspace/programme selector, grouped nav labels, clear active state and collapse-to-icon mode.
- Top bar with global search/command palette, breadcrumbs, date/programme context, notification centre, help and avatar menu.
- Main content uses the available width intelligently with a 12-column grid and readable max-width only where appropriate.
- Keep table headers sticky where helpful; use right-side contextual drawers for quick record inspection while preserving list context.
- Provide a keyboard-accessible command palette for navigating modules and common actions.

Suggested CRM navigation:
Overview
Retailers & Stores
Customer Directory (conditional)
Invoice Claims
Points & Wallet Ledger
Rewards Catalogue
Redemptions & Gift Orders
Cash Redeem & Payouts
Performance & Targets
Programmes & Earn Rules
Campaigns & Segments
Tasks, Surveys & Training
Notifications & Content
Support Tickets & Disputes
Fraud & Risk Review
Reports & Exports
Integrations & Webhooks
Users, Roles & Approvals
Audit Log
Settings

Retailer portal:
Home, Upload Invoice/Scan, Points Wallet, Rewards (Vouchers/Gifts/Cash), My Orders, Payments, Performance, Customers & Transactions (conditional), Tasks/Surveys/Training, Programme Details, Notifications, Support, Profile/Store/KYC/Bank-UPI settings.

Mobile:
- Retailer portal: compact top bar, bottom navigation for Home, Rewards, Scan/Upload, Points, Profile; Scan/Upload receives clear visual priority.
- Internal CRM: mobile-first assigned queue, global search, claim detail, retailer profile and support; use a menu/drawer for less frequent modules.
- Never merely squeeze the desktop sidebar and tables into a phone.

## 4. Dashboard: operational command centre, not a card gallery

Build a distinctive overview page inspired by the supplied references: a clear header, compact but informative metrics, a large main trend chart, secondary performance panels, a needs-attention queue and a timeline. The screen should feel composed, alive and useful, with a strong focal point rather than a uniform grid of identical cards.

Header:
- Workspace greeting/title, current programme/store context, date-range selector, compare-period toggle and one primary CTA relevant to role.
- Retailer primary CTA: Upload Invoice / Scan Invoice.
- Admin primary CTA may be Review Claims, Add Retailer or Create Campaign.
- Include dashboard customisation only if the user can actually add/reorder/hide widgets.

KPI strip:
- Active retailers; eligible sales; points issued; points redeemed; pending payouts; outstanding reward liability.
- Retailer-specific view: available points, pending points, cash redeemable, total payment earned, paid, pending, vouchers available and target achievement.
- Each metric has clear unit, comparison period, trend/sparkline if meaningful, tooltip definition and click-through to underlying filtered records.
- Do not show metrics that do not apply to the current role/programme.

Primary analytics:
- Eligible sales trend line/area chart with daily/weekly/monthly switch.
- Points earned vs redeemed chart.
- Target-vs-achievement progress.
- Programme/campaign performance, budget usage and redemption rate.
- Brand/category/SKU contribution where relevant.
- Charts require actual axes, labels, legends, tooltips, loading/empty/error states and accessible table alternatives. Use a charting library, not fake chart shapes.

Operational panels:
- Needs attention: invoice claims ageing, OCR exceptions, payout failures, low voucher inventory, expiring campaigns, KYC issues and unresolved support tickets.
- Each item shows severity, count/age, assigned owner or status, and a direct action.
- Recent activity timeline: invoice approved, points credited, voucher issued, gift shipped, payout updated, task approved and support response.
- Top retailers/focus products with values, progress and trend.
- Quick actions: upload invoice, review claims, redeem reward, view wallet, inspect payout and raise ticket.

Interactions:
- Clicking a KPI or chart point opens a filtered list or detail drawer.
- Filters change all applicable visualisations and tables.
- Save/share view only if filters are serialised or persisted.
- Use realistic seeded data with totals that reconcile across modules.

## 5. Retailer and store CRM

Directory:
- Search by retailer/store name, store code, programme, territory, distributor and authorised identifiers.
- Filters for programme, tier, active/inactive, KYC status, territory, last activity, risk state, payout hold and performance band.
- Saved views such as All Retailers, Needs KYC, High Performers, Inactive 30 Days, Pending Payout and New This Month.
- Sortable, paginated table with configurable columns, density option, row selection, bulk actions, export and clear empty states.
- Suggested columns: retailer/store, tier, programmes, eligible sales, available points, pending invoices, payout status, last activity and account status.
- Bulk actions must be permission-scoped; destructive and financial operations require confirmation and maker-checker where configured.

Profile:
- Header with avatar/logo, store code, tier, programme memberships, assigned distributor/rep, KYC state and action menu.
- Summary: eligible sales, available/pending points, pending claims, lifetime rewards, total earned/paid/pending payout and last activity.
- Tabs: Overview, Stores, Invoices, Wallet & Ledger, Rewards/Orders, Payments, Performance, Tasks, Support, Documents and Activity/Audit.
- Unified timeline joins invoices, points events, redemption, payout, tasks and tickets.
- Support multi-store parent/child relationships and a store switcher.
- Sensitive field edits require permissions, audit event, reason and re-verification when appropriate.

## 6. Authentication, onboarding, KYC and profile

- Branded welcome/splash and programme-specific welcome content.
- Mobile number + OTP; optional PAN/business-ID onboarding only when operationally appropriate and legally reviewed.
- OTP request, countdown, resend limits, expired code, invalid code, rate limits and account recovery.
- Mask PAN, phone, bank/UPI and identity data by default.
- Configurable first-login survey: retailer type, outlet category, programme participation, smartphone/WhatsApp availability and consent.
- Store/programme selection for multi-store and multi-brand accounts.
- Terms, privacy notice, consent records and communication opt-ins.
- KYC/KYB submission, document capture, status timeline, rejection reason, resubmission and reviewer notes.
- Secure expiring onboarding link from approved SMS/WhatsApp; validate token server-side.
- Session expiry, logout, device/session management, account suspension and support escalation.
- Profile includes owner, store name, phone, email, location, PAN/GST where applicable, bank/UPI destination and documents with proper masking and permissions.

## 7. Invoice upload, OCR and claim review

Retailer flow:
- Upload via camera, gallery, PDF or file picker; support multiple pages/images.
- Show preview, rotate/crop, replace/remove page, upload progress, retry and resumable upload.
- Capture invoice number/date, supplier/distributor, retailer/store, line items, SKU, quantity, unit price, discount, tax and totals.
- Validate file type/size, readability, required fields and arithmetic consistency before submission.
- OCR field confidence and correction UI; label OCR as pending/unavailable if no provider is configured.
- Duplicate detection using invoice number + supplier, file hash, date/amount, image similarity and line-item signature.
- Statuses: Draft, Submitted, Processing, Needs Information, Pending Review, Approved, Partially Approved, Rejected, Duplicate Flagged, Reversed.
- Detail timeline shows submitted date, review steps, eligible value, reward calculation, decision, reason and appeal/resubmission.

Admin review workspace:
- Queues by status; filters for date, retailer, supplier, amount, OCR confidence, age/SLA, campaign, assigned reviewer and risk flags.
- Split view: invoice/PDF viewer on left; extracted fields and line-item grid on right; linked retailer and ledger context.
- Show duplicate matches, mismatched totals, rule eligibility and explainable points/payout calculation.
- Actions: assign, request info, approve, partial approve, reject with mandatory reason, flag duplicate, escalate and open support case.
- Maker-checker for high-risk overrides; immutable review evidence and versioned decisions.
- Reversal/return creates compensating ledger event; never delete the original claim or transaction.

## 8. Points wallet and ledger

- Separate Available, Pending, Redeemed, Expired, Reversed and Lifetime Earned points.
- Show point-to-currency conversion only when configured; clarify that equivalent value may not be cash value.
- Filters by date, brand, invoice, earn/redeem type, campaign, asset and status.
- Ledger columns: date/time, event ID, source/reference, retailer/customer, asset type, credit/debit, status, expiry, rule version and actor/source.
- Transaction detail drawer links to source invoice, redemption, campaign or payout and shows rule evaluation and audit history.
- Expiry planner, expiry reminders, promotional vs standard points and tier progress where configured.
- Manual adjustment requires account, amount, direction, reason, evidence and permissions; maker-checker for risky changes.
- Ledger is append-only. Corrections use adjustment/reversal entries with reason, actor, timestamp and evidence.
- Prevent duplicate credit with idempotency keys and unique event references; balances reconcile to ledger entries.

## 9. Rewards catalogue, vouchers, gifts and cash redemption

Voucher catalogue:
- Search, categories, filters, brand/provider, featured offers, points cost, validity, eligibility, stock, terms and details.
- Detail view includes provider status, redemption analytics, terms, code instructions and expiry.
- Voucher issuance and code reveal are protected; re-authentication where appropriate; support copy code, redemption instructions and expiry.
- States: Available, Reserved, Issued, Redeemed, Expired, Failed, Cancelled and Refunded where supported.
- Inventory import, masked codes, allocation, expiry and provider reconciliation.

Physical gifts:
- Professional catalogue grid/list with image, point cost, stock, delivery estimate and eligibility.
- Address selection, order confirmation, address book, order history and tracking.
- States: Created, Reserved, Confirmed, Packed, Shipped, Delivered, Failed, Cancelled, Returned.
- Delivery proof, carrier tracking, support ticket linkage and stock thresholds.

Cash redeem:
- Show eligible points, conversion rate, min/max amount, fees, deductions and estimated net payout.
- Enter points or cash amount with two-way calculation; display confirmation summary and masked destination.
- Validate KYC, limits, balance, risk holds and programme rules; step-up authentication/OTP where required.
- Bank/UPI only where supported by configured provider and policy.
- Statuses: Requested, Validation, Approved, Processing, Paid, Failed, On Hold, Reversed.
- Display provider reference, statement and exact failure reason where available.
- Never promise instant payout without a verified SLA; on failure, restore held value through a controlled compensating transaction.
- Atomically reserve balance and inventory; prevent double-spend and overselling; make provider requests idempotent.

## 10. Payments and payout operations

Retailer view:
- Summary of Total Payment Earned, Paid/Received, Pending, On Hold, Failed and Last Payment.
- Payout summary tabs: Total Earned / Paid / Pending; year/month filters and export.
- Table columns: period, description, eligible amount, gross payout, deductions/tax if configured, net amount, status, UTR/provider reference and date.
- Show next expected payout only when a reliable configured schedule exists.
- Payout destination management with verification, masked details, change approval and cool-off controls for suspicious changes.

Admin finance:
- Queue for Requested, Validation, Approved, Processing, Paid, Failed, On Hold and Reversed.
- Batch flow: select eligible items → validate → list exceptions → review totals → maker-checker approve → submit to provider → track callback → reconcile.
- Compare internal ledger, provider statement and bank settlement; show unmatched entries and variance totals.
- Distinguish provider acknowledgement from final settlement.
- Safe retry prevents duplicate transfer; failed payouts require clear next action and audit trail.
- Deductions such as TDS appear only when configured and validated by finance/legal; label estimates vs final values.

## 11. Performance tracker and sales intelligence

- Targets by month, quarter, year and configurable business period.
- Metrics: target value, actual eligible sales, achievement %, remaining target, units, invoice count, active SKUs, brand/category mix and reward points earned.
- Focus product table: SKU/product, sales till date, monthly target, achievement, points credited, incentive rule and trend.
- Performance by distributor, territory, brand, product category, programme and store.
- Visualisations: target-vs-actual, trend line, bar comparison, top products and ranking with progress.
- Filters: date range, programme, brand, distributor, product, category, territory and store.
- Explain data source and refresh time; distinguish gross sales, net sales, eligible sales, returns and reversals.
- Alerts for near-target progress, underperformance, unusual returns and missing data.
- Export CSV/XLSX/PDF with role-based row access.
- Clicking chart segment or row drills down to the exact stores, invoices or transactions.

## 12. Customer-level loyalty and transactions

Only enable when consumer loyalty is part of the programme and user permissions permit it.
- Customer profile, consent, membership ID, tier, points, vouchers, rewards, purchase history and support history.
- Search by authorised identifiers, QR/member ID scan and duplicate-profile resolution.
- Earn/redeem history with source, receipt, status and reversal.
- Vouchers available/used/expired/cancelled, terms and usage details.
- Customer money/cashback states: earned, pending, available, redeemed and refunded; distinguish consumer cashback from retailer payouts.
- Segments: new, active, repeat, at-risk, high-value and inactive; criteria must be explainable.
- Communication preferences, opt-out, merge, recovery, consent withdrawal and data request flows.
- If the product is retailer-only B2B loyalty, do not fabricate consumer records or expose customers from unrelated programmes.

## 13. Tasks, surveys, training and field execution

- Task catalogue with title, instructions, eligibility, points, due date, evidence requirements and status.
- Surveys with configurable question types, branching, validation, image proof and versioned responses.
- Quizzes/training with attempts, score, pass threshold, retake rules and completion certificate.
- Field visit check-in/out, assigned territory, checklist, optional geo/time proof and offline drafts.
- Merchandising/display compliance, placement, shelf share, promotional material placement and photo evidence.
- States: Assigned, In Progress, Submitted, Under Review, Approved, Rejected, Expired and Appealed.
- Award points only after configured completion/approval; safely reject duplicate submissions.

## 14. Programmes, campaigns, segmentation and earn-rule builder

- Configure programmes, tenant/brand, eligible retailer types, geography, period, budget, assets and lifecycle.
- Visual rule builder for SKU/category/brand, invoice value, units, store tier, geography, channel, task, time window and campaign.
- Support formulas, minimum thresholds, caps, stacking/exclusions, rounding, priority, budget limits and expiry.
- Lifecycle: Draft → Test → Approve → Schedule → Active → Paused/Ended/Archived.
- Rule versioning and effective dates; old transactions retain the rule version used.
- Simulator with sample invoice and explainable outcome: eligible lines, exclusions, formula, caps and final reward.
- Campaigns: welcome/activation, bonus periods, milestone rewards, reactivation and expiry reminders.
- Advanced: A/B testing, holdout groups and incrementality reporting where attribution is reliable.
- Show audience estimate, spend, budget burn, earned/redeemed rewards, conversion and ROI only where measurable.
- Include safe pause/rollback with impact preview and version diff.

## 15. Notifications, inbox, messaging and content

- In-app notifications, push, SMS, email and WhatsApp integrations where consent/provider policies allow.
- Events: OTP, onboarding status, invoice submitted/approved/rejected, points credited, voucher issued/expiring, gift shipped, payout status, task due and support update.
- Read/unread, category filters, deep links, preferences, opt-outs and delivery status.
- Template editor with variables, localisation, preview, approval and version history.
- Retry, delivery receipts, rate limits, quiet hours and frequency caps.
- Never include sensitive identity or financial information in insecure message content.
- Programme Details page with active offers, eligibility, product info, terms, approved brand assets and education content.
- Optional short-video feed for product education, campaign announcements and retailer training with captions, mute/playback controls, reporting and moderation.
- Do not award points for video views unless programme rules explicitly define it.

## 16. Orders and redemption history

- Unified My Orders with Voucher, Gift and Cash tabs.
- Order detail shows reference, dates, status timeline, points/cash impact, next action and linked support.
- Gift tracking includes carrier, tracking number and delivery proof.
- Voucher view includes validity, provider state and redemption instructions; sensitive codes remain protected.
- Cash history includes requested amount, deductions, net payout, destination (masked), provider reference and statement.
- Refund/cancellation/reversal behaviour must be explicit and reflected through compensating ledger entries.

## 17. Support, disputes and risk

- Help centre search, FAQs, guided issue categories and contact escalation.
- Ticket creation: category, issue type, linked invoice/payout/redemption, description, attachments and preferred contact.
- States: Open, Assigned, Waiting for User, In Progress, Escalated, Resolved and Closed.
- Ticket list/detail with timeline, replies, attachments, SLA, owner, internal notes and closure confirmation.
- Categories include login, KYC, invoice, points, voucher, gift delivery, cash redemption, payout, customer profile and programme eligibility.
- Link tickets to transactions. Support agents cannot mutate ledger directly; corrections use authorised adjustment workflow.
- Fraud/risk queue with evidence, reason codes, human review and appeal path; avoid automatic high-impact penalties without review.

## 18. Admin CRM and operations

- Global search for retailer, store, customer (conditional), invoice, transaction, voucher, payout, order and ticket.
- Data tables with saved filters, bulk actions, column chooser, pagination, export and row-level permissions.
- Retailer lifecycle, KYC queue, programme assignments, tier changes, staff access and account holds.
- Invoice decision queue, reward catalogue/stock, campaign budgets, payout approvals and reconciliation.
- Fraud/risk cases, rule approvals, maker-checker, admin action audit and controlled support impersonation.
- Bulk imports with validation preview, row-level errors, duplicate handling and rollback plan.
- Tenant configuration, feature flags, localisation, content and provider health.
- User/role/permission matrix and read-only auditor role.

## 19. Data model, APIs and integrations

Core entities: Tenant, User, Role, Permission, UserRole, Session, Retailer, Store, Customer, ConsentRecord, KycCase, Programme, ProgrammeVersion, EarnRule, Campaign, Segment, Supplier, Product/SKU, InvoiceClaim, InvoiceLine, Transaction, WalletAccount, LedgerEvent, LedgerEntry, Reward, Voucher, GiftOrder, Redemption, Payout, PayoutBatch, TaskTemplate, TaskAssignment, Survey, SurveyResponse, Notification, SupportTicket, Dispute, FraudCase, WebhookEndpoint, WebhookDelivery, AuditEvent and ExportJob.

Use UUID/ULID IDs, UTC timestamps, tenant scoping, foreign keys and database constraints. Store money in integer minor units (paise) or exact decimal types, never binary floating point. Define points precision and rounding. Store evidence in protected object storage with expiring signed URLs and access logging.

API:
- Versioned REST such as /api/v1, JSON, TLS, schema validation, cursor pagination, standard error envelopes and correlation IDs.
- Idempotency-Key for claims, redemptions, payouts and adjustments.
- Authenticate and enforce ownership/permissions server-side; never trust client-supplied retailer/customer ownership IDs.
- Endpoint groups: auth/OTP, retailers/stores, claims, wallet/ledger, rewards/redemptions, cash/payouts, tasks/surveys, support, admin rules/decisions/adjustments, payout batches, reports and integrations.
- Integrations may include OCR, POS/ERP/distributor, voucher providers, shipping/logistics, payout providers, KYC, SMS/email/WhatsApp and analytics. Use sandbox adapters when credentials are unavailable.
- Use signed webhooks, replay protection, retries, dead-letter queue and reconciliation jobs.

## 20. Security, privacy, financial integrity and reliability

- TLS, encryption at rest, secret management, key rotation, secure file scanning and upload limits.
- RBAC, tenant isolation, least privilege, privileged-action MFA, session revocation and rate limits.
- OTP abuse controls, signed webhooks, replay protection and idempotent consumers.
- Audit programme/rule changes, access, exports, approvals, adjustments, payouts and impersonation.
- Mask PAN, phone, bank/UPI and KYC documents; restrict access by role and purpose.
- Privacy notice, data minimisation, retention/deletion policy and consent history.
- Ledger append-only; corrections are compensating entries. Balance, stock and payout checks must be atomic.
- Transactional outbox/inbox, queues, retries, dead-letter handling, backups, restore tests and provider outage playbooks.
- Review applicable privacy, payment, tax, consumer, KYC and messaging laws with qualified local experts; requirements vary by jurisdiction.

## 21. Analytics and reporting

- Retailer activation, monthly active retailers, retention, repeat invoice rate and engagement.
- Eligible sales, points issued/redeemed, reward liability and expiry/breakage.
- Invoice approval rate, OCR confidence, duplicate rate, review ageing and dispute rate.
- Voucher/gift redemption, fulfilment SLA, stockouts and provider failures.
- Cash redemption/payout success, processing time, reconciliation variance and outstanding payable.
- Campaign spend, budget burn, incremental lift and ROI with documented attribution.
- Target attainment by store, territory, distributor, brand, category and SKU.
- Consumer metrics only where consumer data is in scope and consent/legal basis is established.
- Save report views, schedule exports and enforce row-level permissions.

## 22. Advanced differentiators

- Unified activity timeline joining invoices, points, redemptions, payouts, tasks and support.
- Explainable next-best-action recommendations.
- Points-expiry planner and relevant reward suggestions.
- Retailer health score based on transparent criteria.
- Offline invoice drafts and queued uploads for poor connectivity.
- Multi-store owner account with consolidated view and store switcher.
- Multi-brand wallet with programme-specific balances and terms.
- Automated reconciliation alerts and finance exception workbench.
- Fraud anomaly flags with human review and appeal.
- Rule simulator, audit diff and safe rollback.
- Saved report views, scheduled exports, role-based dashboards, localisation and low-bandwidth mode.
- AI-assisted OCR and ticket summarisation with confidence display, human override and no autonomous high-impact account penalties.

## 23. Required interaction and state quality

Every visible element must have a defined behaviour:
- Search queries seeded/real records and navigates to results.
- Filters change data; applied filters appear as removable chips.
- Saved views preserve relevant filters/sort.
- Sorting, pagination, row selection, column visibility and exports work when shown.
- Tabs change real content; drawers show the selected record and preserve list context.
- Forms validate inline and show success/failure.
- Destructive and financial actions show amount, destination and consequence before confirmation.
- Use skeletons, empty states with next-step CTA, permission-denied, offline, validation, error/retry, partial-failure and success states.
- Keyboard navigation, visible focus, accessible labels, screen-reader support and reduced-motion support.
- Never show fake success for an external action. Provider states must be explicit.
- Demo data must have a persistent Demo/Sandbox label.

## 24. Responsive behaviour and accessibility

Desktop (1200px+): full sidebar, top bar, multi-column dashboards, full tables and detail drawers.
Tablet (768–1199px): collapsible sidebar, reduced chart columns, filter drawer and responsive table density.
Mobile (<768px): retailer bottom navigation, compact top bar, prominent upload/scan action, stacked summaries, full-screen detail flows and carefully handled tables.
- No horizontal page overflow, clipped labels or hover-only interactions.
- Touch targets around 44px; readable typography and proper keyboard handling.
- Camera capture, resumable uploads and save-draft behaviour where supported.
- Contrast must be WCAG-aware; colour cannot be the only status signal.
- Provide chart data table alternatives and accessible form errors.

## 25. Suggested delivery order

Phase 1 — Foundation: design tokens, app shell, auth/onboarding, retailer profile, invoice upload/review, rules evaluation, wallet/ledger, retailer dashboard, basic vouchers, notification centre and support.
Phase 2 — Operations: gifts/fulfilment, cash redeem/payout provider, payout summary, performance tracker, admin CRM, KYC and reconciliation.
Phase 3 — Engagement: campaigns, tiers, tasks, surveys, training, consumer loyalty if in scope, segmentation and messaging.
Phase 4 — Scale: offline workflows, multi-brand/tenant, advanced fraud, experimentation, recommendations, AI-assisted OCR/triage, data warehouse and partner APIs.
Each phase includes test data, migration plan, observability, access controls, runbooks and acceptance tests. Build vertical slices that work end-to-end rather than many disconnected static screens.

## 26. Acceptance criteria

1. Retailer can onboard, complete required checks and reach a useful dashboard.
2. Invoice upload supports validation, progress, status tracking, evidence view, rejection reason and resubmission.
3. An approved claim credits rewards exactly once, including retries.
4. Wallet history reconciles to available/pending/lifetime balances.
5. Voucher redemption and gift ordering validate stock, eligibility and balance atomically.
6. Cash redeem validates eligibility and accurately represents sandbox/live status.
7. Payment totals reconcile to payout and ledger records.
8. Performance filters work and all metrics are defined.
9. Customer data appears only for authorised roles and correct tenant/programme.
10. Admin decisions and adjustments are auditable and permission-checked.
11. Web/mobile layouts work on phone, tablet, laptop and wide desktop.
12. Loading, empty, offline, validation, provider failure, duplicate and retry states are tested.
13. Tests cover ledger invariants, permissions, idempotency, state transitions and provider callbacks.
14. The visual interface is materially more polished than the rejected basic screenshot and uses the supplied references as quality inspiration.
15. No dead buttons, fake charts, fake payment success or misleading live integrations.

## 27. Exact instructions for the implementation agent

Start by inspecting the repository: framework, package manager, routing, existing components, auth, API layer and tests. Do not destroy working code without explaining the impact. Then implement:
1. Design tokens, typography, icon system and reusable component primitives.
2. Responsive application shell and role-aware navigation.
3. Overview dashboard with real charts, needs-attention queue, timeline and functional drill-downs.
4. Retailer directory/profile and invoice claims queue/detail.
5. Points ledger, rewards/redemption and payouts.
6. Performance tracker, support, tasks and remaining modules.
7. Seeded coherent data and mock/sandbox adapters.
8. Tests, responsive checks, console-error fixes and setup documentation.

Use the project's existing stack where practical. Reuse an installed chart library; if none exists, add an appropriate one only if dependency installation is permitted. Do not draw static divs pretending to be charts. Keep business logic out of UI components. Enforce financial invariants, access control, idempotency and ledger correctness server-side.

At completion, report: screens built, working interactions, tests run, run commands, mocked integrations, required credentials, remaining limitations and known issues. Do not claim end-to-end functionality unless verified. Do not stop at a plan or a design description—edit and run the application.

## 28. Original reference feature coverage checklist

The original PDF's referenced workflows must remain in scope: retailer home dashboard; tier/points/voucher summary; payment earned/paid/pending; performance tracker tables; customer and transaction list; rewards and redemption categories; voucher detail and generation; physical gift order flow; cash redemption and UPI/bank transfer; notifications; points history; support ticket creation/resolution; invoice upload/list/detail/re-upload; profile and store details; onboarding with PAN/mobile and OTP; customer survey; programme details and short-form training content. Also retain admin CRM, programme rules, campaigns, ledger, payouts/reconciliation, reporting, integrations, security and audit functionality described in the source PDF.

