import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ApplicationStatus } from '../data/types';
import {
  ContactMessageDto,
  ConfirmationEmailDto,
  DeletionEmailDto,
  ResubmissionEmailDto,
  ResponseEmailDto,
  StatusUpdateEmailDto,
} from '../data/interfaces';

// ─── Shared helpers ───────────────────────────────────────────────────────────

const year = new Date().getFullYear();

const ntcFooter = `
  <div style="background:#0038A8;color:#fff;padding:24px;text-align:center;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;">
    <p style="margin:0 0 6px;font-weight:bold;font-size:15px;">National Telecommunications Commission</p>
    <p style="margin:4px 0;font-size:12px;">BIR Road, East Triangle, Diliman, Quezon City 1101, Philippines</p>
    <p style="margin:4px 0;font-size:12px;">
      📞 8-924-3775 &nbsp;|&nbsp;
      🌐 <a href="https://ntc.gov.ph" style="color:#FFD700;text-decoration:none;">www.ntc.gov.ph</a>
    </p>
    <p style="margin:14px 0 0;font-size:11px;color:#ccc;">© ${year} National Telecommunications Commission. All rights reserved.</p>
  </div>
`;

const ntcHeader = (subtitle: string) =>
  `<div style="background:#0038A8;color:#fff;padding:22px 20px;text-align:center;border-bottom:5px solid #FF0000;font-family:Arial,sans-serif;">
    <h1 style="margin:10px 0 4px;font-size:22px;">National Telecommunications Commission</h1>
    <h2 style="margin:0;font-size:16px;font-weight:normal;">${subtitle}</h2>
  </div>`;

const infoBox = (content: string) =>
  `<div style="background:#e8f0fe;border-left:4px solid #0038A8;padding:14px 16px;margin:20px 0;border-radius:0 5px 5px 0;font-family:Arial,sans-serif;">
    ${content}
  </div>`;

const alertBox = (content: string, color = '#FF0000') =>
  `<div style="background:#fff3f3;border-left:4px solid ${color};padding:14px 16px;margin:20px 0;border-radius:0 5px 5px 0;font-family:Arial,sans-serif;">
    ${content}
  </div>`;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const wrapEmail = (header: string, body: string) =>
  `<!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"/><title>NTC Portal</title></head>
  <body style="margin:0;padding:0;background:#f5f5f5;">
    <div style="max-width:620px;margin:0 auto;background:#fff;">
      ${header}
      <div style="padding:30px;font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.7;">
        ${body}
        <p style="margin-top:32px;padding-top:18px;border-top:1px solid #eaeaea;color:#555;font-size:13px;">
          <em>This is an automated message. Please do not reply directly to this email.<br/>
          For inquiries, contact <a href="mailto:human.resource@ntc.gov.ph" style="color:#0038A8;">human.resource@ntc.gov.ph</a>.</em>
        </p>
      </div>
      ${ntcFooter}
    </div>
  </body>
  </html>`;

const refNumber = (id: number) => `NTC-APP-${String(id).padStart(6, '0')}`;

const contactAdminAddress = process.env.CONTACT_ADMIN_EMAIL?.trim() || '';

// clearer fallback text used when date/time details are not yet available
const tbaText = 'To be announced — details will be sent in a follow-up email.';

// normalize values: treat empty strings as missing, format Date objects
const renderValue = (v?: string | Date | null) => {
  if (v == null) return tbaText;
  if (v instanceof Date) {
    if (isNaN(v.valueOf())) return tbaText;
    return v.toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' });
  }
  const s = String(v).trim();
  return s ? s : tbaText;
};

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class MailerService {
  private transporter: Transporter | undefined;
  private readonly logger = new Logger(MailerService.name);
  private fromAddress = '"NTC Portal" <no-reply@ntc.gov.ph>';

  private disabled = false;
  private ready: Promise<void>;

  constructor() {
    this.ready = this.init();
  }

  private async init(): Promise<void> {
    const host = process.env.MAIL_HOST;
    const port = Number(process.env.MAIL_PORT);
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;

    if (!host || !port || !user || !pass) {
      this.disabled = true;
      this.logger.error(
        'Missing required mail env vars: MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS',
      );
      return;
    }

    this.fromAddress = `"NTC Portal" <${user}>`;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    await new Promise<void>((resolve) => {
      this.transporter!.verify((err) => {
        if (err) {
          this.logger.error(`SMTP connection failed: ${err.message}`);
        } else {
          this.logger.log('SMTP connection verified ✅');
        }
        resolve();
      });
    });
  }

  // ─── Internal send helper ─────────────────────────────────────────────────

  private async send(options: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<boolean> {
    await this.ready;
    if (this.disabled || !this.transporter) {
      this.logger.warn(`Mail disabled — skipping send to ${options.to}`);
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        replyTo: 'human.resource@ntc.gov.ph',
        ...options,
      });
      this.logger.log(`Mail sent → ${options.to} | ${options.subject}`);
      return true;
    } catch (err: unknown) {
      this.logger.error(
        `Mail failed → ${options.to} | ${(err as Error).message}`,
      );
      return false;
    }
  }

  async onModuleDestroy() {
    if (
      this.transporter &&
      typeof (this.transporter as any).close === 'function'
    ) {
      try {
        (this.transporter as any).close();
        this.logger.log('SMTP transporter closed');
      } catch (e) {
        this.logger.warn('Failed closing transporter');
      }
    }
  }

  // ─── 1. Deletion email ────────────────────────────────────────────────────

  async deletionEmail(dto: DeletionEmailDto): Promise<boolean> {
    const { to, firstName, lastName, applicationId } = dto;
    const fullName = `${firstName} ${lastName}`;
    const ref = refNumber(applicationId);

    const html = wrapEmail(
      ntcHeader('OJT Application Portal'),
      `<p>Dear <strong>${fullName}</strong>,</p>
      <p>Good day!</p>
      <p>We are writing to inform you that your application record on the <strong>NTC OJT Application Portal</strong> has been <strong>deleted</strong> from our system by an administrator.</p>

      ${infoBox(`<strong>Reference No.:</strong> ${ref}<br/><strong>Action:</strong> Application Record Deleted`)}

      <p>This action may have been taken for one or more of the following reasons:</p>
      <ul style="padding-left:20px;">
        <li>Duplicate application submission</li>
        <li>Incomplete or invalid requirements</li>
        <li>Failure to respond within the required period</li>
        <li>Routine system data cleanup</li>
      </ul>

      <p>Please be informed that this action is carried out in compliance with NTC's <strong>Data Retention Policy</strong>, established under the <em>Data Privacy Act of 2012 (RA 10173)</em>.</p>
      <p>We apologize for any inconvenience this may have caused.</p>

      <p style="margin-top:28px;">
        Sincerely,<br/>
        <strong>David M. Zaldua</strong><br/>
        Administrative Officer IV<br/>
        Human Resource Division
      </p>`,
    );

    const text = [
      'NATIONAL TELECOMMUNICATIONS COMMISSION — OJT Application Portal',
      '='.repeat(60),
      `Dear ${fullName},`,
      '',
      'Your application record has been deleted.',
      `Reference No.: ${ref}`,
      '',
      'Possible reasons:',
      '  - Duplicate application submission',
      '  - Incomplete or invalid requirements',
      '  - Failure to respond',
      '  - System data cleanup',
      '',
      'This is in compliance with the Data Privacy Act of 2012 (RA 10173).',
      '',
      'David M. Zaldua',
      'Administrative Officer IV | Human Resource Division',
      '',
      '(Automated message — do not reply.)',
    ].join('\n');

    return this.send({
      to,
      subject: `NTC Application – Record Deletion Notification [${ref}]`,
      html,
      text,
    });
  }

  // ─── 2. Confirmation email ────────────────────────────────────────────────

  async confirmationEmail(dto: ConfirmationEmailDto): Promise<boolean> {
    const {
      to,
      firstName,
      lastName,
      applicationId,
      applicationType,
      submittedAt = new Date(),
    } = dto;
    const fullName = `${firstName} ${lastName}`;
    const ref = refNumber(applicationId);
    const submittedDate = submittedAt.toLocaleString('en-PH', {
      dateStyle: 'long',
      timeStyle: 'short',
    });

    const html = wrapEmail(
      ntcHeader('OJT Application Portal'),
      `<p>Dear <strong>${fullName}</strong>,</p>
      <p>Good day!</p>
      <p>Thank you for submitting your application to the <strong>National Telecommunications Commission OJT Application Portal</strong>. We have successfully received your application and it is now under review.</p>

      ${infoBox(`
        <strong>Submission ID:</strong> ${ref}<br/>
        <strong>Date Submitted:</strong> ${submittedDate}<br/>
        <strong>Status:</strong> Under Review
      `)}

      <p>Please keep this email for your records and use your <strong>Submission ID (${ref})</strong> when following up.</p>

      <p><strong>What happens next?</strong></p>
      <ol style="padding-left:20px;">
        <li>Our team reviews your submitted documents.</li>
        <li>You will receive a separate email regarding the outcome.</li>
        <li>If scheduled, you will be informed of your interview details via email.</li>
      </ol>

      <p style="margin-top:28px;">
        Sincerely,<br/>
        <strong>David M. Zaldua</strong><br/>
        Administrative Officer IV<br/>
        Human Resource Division
      </p>`,
    );

    const text = [
      'NATIONAL TELECOMMUNICATIONS COMMISSION — OJT Application Portal',
      '='.repeat(60),
      `Dear ${fullName},`,
      '',
      'Your application has been received and is now under review.',
      '',
      `Submission ID   : ${ref}`,
      `Application Type: ${applicationType}`,
      `Date Submitted  : ${submittedDate}`,
      `Status          : Pending`,
      '',
      'David M. Zaldua',
      'Administrative Officer IV | Human Resource Division',
      '',
      '(Automated message — do not reply.)',
    ].join('\n');

    return this.send({
      to,
      subject: `NTC Application – Submission Confirmed [${ref}]`,
      html,
      text,
    });
  }

  // ─── 3. Response email (scheduled / rejected) ─────────────────────────────

  async responseEmail(dto: ResponseEmailDto): Promise<boolean> {
    const {
      to,
      firstName,
      lastName,
      applicationId,
      status,
      interviewDate,
      interviewTime,
      acceptedDate,
      acceptedTime,
      interviewLocation,
      adminNote,
    } = dto;

    const fullName = `${firstName} ${lastName}`;
    const ref = refNumber(applicationId);

    const isScheduled = status === 'scheduled';
    const isOrientation = status === 'orientation';
    const isApproved = isScheduled || isOrientation;

    const subjectLine = isScheduled
      ? `NTC Application – Interview Scheduled [${ref}]`
      : isOrientation
        ? `NTC Application – Orientation Scheduled [${ref}]`
        : `NTC Application – Application Status Update [${ref}]`;

    const statusBadge = isScheduled
      ? `<span style="display:inline-block;background:#1a7f37;color:#fff;padding:4px 14px;border-radius:20px;font-size:13px;font-weight:bold;">INTERVIEW SCHEDULED</span>`
      : isOrientation
        ? `<span style="display:inline-block;background:#0038A8;color:#fff;padding:4px 14px;border-radius:20px;font-size:13px;font-weight:bold;">ORIENTATION SCHEDULED</span>`
        : `<span style="display:inline-block;background:#cf222e;color:#fff;padding:4px 14px;border-radius:20px;font-size:13px;font-weight:bold;">APPLICATION NOT APPROVED</span>`;

    const detailsBlock = isScheduled
      ? infoBox(`
        <strong>Interview Details</strong><br/><br/>
        📅 <strong>Date:</strong> ${renderValue(interviewDate)}<br/>
        🕐 <strong>Time:</strong> ${renderValue(interviewTime)}<br/>
        📍 <strong>Location:</strong> ${interviewLocation ?? 'NTC Main Office, Quezon City'}<br/>
        🔖 <strong>Reference No.:</strong> ${ref}
      `)
      : isOrientation
        ? infoBox(`
        <strong>Orientation Details</strong><br/><br/>
        📅 <strong>Date:</strong> ${renderValue(acceptedDate)}<br/>
        🕐 <strong>Time:</strong> ${renderValue(acceptedTime)}<br/>
        🔖 <strong>Reference No.:</strong> ${ref}
      `)
        : infoBox(`<strong>Reference No.:</strong> ${ref}`);

    const noteBlock = adminNote
      ? alertBox(
          `<strong>Note from the Administrator:</strong><br/>${adminNote}`,
          isScheduled ? '#0038A8' : isOrientation ? '#1a7f37' : '#FF0000',
        )
      : '';

    const reminders = isScheduled
      ? `<p><strong>Important reminders:</strong></p>
       <ul style="padding-left:20px;">
         <li>Arrive at least <strong>15 minutes</strong> before your scheduled interview.</li>
         <li>Bring a valid government-issued ID and a printed copy of your application.</li>
         <li>Dress appropriately in <strong>business attire</strong>.</li>
         <li>If you are unable to attend, please notify us <strong>at least 24 hours</strong> in advance.</li>
       </ul>`
      : isOrientation
        ? `<p><strong>Important reminders:</strong></p>
       <ul style="padding-left:20px;">
         <li>Arrive at least <strong>15 minutes</strong> before the orientation starts.</li>
         <li>Bring a valid government-issued ID and any required documents.</li>
         <li>If you are unable to attend, please notify us <strong>at least 24 hours</strong> in advance.</li>
       </ul>`
        : '';

    const opening = isApproved
      ? isScheduled
        ? `We are pleased to inform you that your application has been reviewed and you have been <strong>selected for an interview</strong>.`
        : `Congratulations! Your application has been <strong>accepted</strong>. Please attend the scheduled orientation below.`
      : `Thank you for your interest in the <strong>NTC OJT Program</strong>. After careful review, we regret to inform you that your application has <strong>not been approved</strong> at this time.`;

    const closing = isApproved
      ? `<p>We look forward to meeting you. Good luck!</p>`
      : `<p>We encourage you to apply again in future application periods.</p>`;

    const bodyContent = `
    <p>Dear <strong>${fullName}</strong>,</p>
    <p>Good day!</p>
    <p>${opening}</p>
    <p style="margin:16px 0 6px;">${statusBadge}</p>
    ${detailsBlock}
    ${noteBlock}
    ${reminders}
    ${closing}
    <p style="margin-top:28px;">
      Sincerely,<br/>
      <strong>David M. Zaldua</strong><br/>
      Administrative Officer IV<br/>
      Human Resource Division
    </p>`;

    const html = wrapEmail(ntcHeader('OJT Application Portal'), bodyContent);

    const text = isScheduled
      ? [
          'NATIONAL TELECOMMUNICATIONS COMMISSION — OJT Application Portal',
          '='.repeat(60),
          'INTERVIEW SCHEDULED',
          '='.repeat(60),
          '',
          `Dear ${fullName},`,
          '',
          `Reference No. : ${ref}`,
          `Date          : ${renderValue(interviewDate)}`,
          `Time          : ${renderValue(interviewTime)}`,
          `Location      : ${interviewLocation ?? 'NTC Main Office, Quezon City'}`,
          '',
          adminNote ? `Note: ${adminNote}\n` : '',
          'David M. Zaldua',
          'Administrative Officer IV | Human Resource Division',
          '',
          '(Automated message — do not reply.)',
        ].join('\n')
      : isOrientation
        ? [
            'NATIONAL TELECOMMUNICATIONS COMMISSION — OJT Application Portal',
            '='.repeat(60),
            'ORIENTATION SCHEDULED',
            '='.repeat(60),
            '',
            `Dear ${fullName},`,
            '',
            `Reference No. : ${ref}`,
            `Date          : ${renderValue(acceptedDate)}`,
            `Time          : ${renderValue(acceptedTime)}`,
            '',
            adminNote ? `Note: ${adminNote}\n` : '',
            'David M. Zaldua',
            'Administrative Officer IV | Human Resource Division',
            '',
            '(Automated message — do not reply.)',
          ].join('\n')
        : [
            'NATIONAL TELECOMMUNICATIONS COMMISSION — OJT Application Portal',
            '='.repeat(60),
            'APPLICATION STATUS: NOT APPROVED',
            '='.repeat(60),
            '',
            `Dear ${fullName},`,
            '',
            `Reference No.: ${ref}`,
            '',
            adminNote ? `Note: ${adminNote}\n` : '',
            'We encourage you to apply again in future periods.',
            '',
            'David M. Zaldua',
            'Administrative Officer IV | Human Resource Division',
            '',
            '(Automated message — do not reply.)',
          ].join('\n');

    return this.send({ to, subject: subjectLine, html, text });
  }

  // ─── 5. Resubmission email ────────────────────────────────────────────────

  async resubmissionEmail(dto: ResubmissionEmailDto): Promise<boolean> {
    const { to, firstName, lastName, applicationId, requiredFiles } = dto;
    const fullName = `${firstName} ${lastName}`;
    const ref = refNumber(applicationId);
    const portalUrl = process.env.FRONTEND_URL || 'https://ojt.ntc.gov.ph';
    const resubmitLink = `${portalUrl}/apply/resubmit?id=${applicationId}&email=${encodeURIComponent(to)}`;

    const filesList = requiredFiles
      .map((file) => `<li>${file}</li>`)
      .join('\n');

    const html = wrapEmail(
      ntcHeader('OJT Application Portal'),
      `<p>Dear <strong>${fullName}</strong>,</p>
      <p>Good day!</p>
      <p>Thank you for your application to the <strong>National Telecommunications Commission OJT Application Portal</strong>.</p>

      ${alertBox(
        `<strong>Action Required:</strong> We need you to <strong>resubmit the following documents</strong> to proceed with your application review.`,
        '#d97706',
      )}

      <p><strong>Required Files to Resubmit:</strong></p>
      <ul style="padding-left:20px;">
        ${filesList}
      </ul>

      <p style="margin-top:24px;"><strong>How to Resubmit:</strong></p>
      <ol style="padding-left:20px;">
        <li>Click the button below to access the resubmission form</li>
        <li>Your previous information will be pre-filled</li>
        <li>Upload the required documents</li>
        <li>Submit your resubmission</li>
      </ol>

      <div style="text-align:center;margin:32px 0;">
        <a href="${resubmitLink}" style="display:inline-block;background:#0038A8;color:#fff;padding:12px 28px;text-decoration:none;border-radius:4px;font-weight:bold;">Resubmit Documents</a>
      </div>

      <p style="margin:24px 0;padding:16px;background:#f0f8ff;border-left:4px solid #0038A8;border-radius:0 4px 4px 0;">
        <strong>Reference No.:</strong> ${ref}<br/>
        <strong>Status:</strong> Pending Resubmission<br/>
        <strong>Deadline:</strong> 7 days from receipt of this email
      </p>

      <p style="margin-top:28px;">
        Sincerely,<br/>
        <strong>David M. Zaldua</strong><br/>
        Administrative Officer IV<br/>
        Human Resource Division
      </p>`,
    );

    const text = [
      'NATIONAL TELECOMMUNICATIONS COMMISSION — OJT Application Portal',
      '='.repeat(60),
      'DOCUMENT RESUBMISSION REQUIRED',
      '='.repeat(60),
      '',
      `Dear ${fullName},`,
      '',
      `Reference No.: ${ref}`,
      `Status       : Pending Resubmission`,
      '',
      'Required Files:',
      requiredFiles.map((f) => `  - ${f}`).join('\n'),
      '',
      `Resubmit here: ${resubmitLink}`,
      '',
      'Deadline: 7 days from receipt of this email',
      '',
      'David M. Zaldua',
      'Administrative Officer IV | Human Resource Division',
      '',
      '(Automated message — do not reply.)',
    ].join('\n');

    return this.send({
      to,
      subject: `NTC Application – Document Resubmission Required [${ref}]`,
      html,
      text,
    });
  }

  async statusUpdateEmail(dto: StatusUpdateEmailDto): Promise<boolean> {
    const { to, firstName, lastName, applicationId, status, adminNote } = dto;
    const fullName = `${firstName} ${lastName}`;
    const ref = refNumber(applicationId);

    const statusConfig: Record<
      ApplicationStatus,
      { label: string; color: string; message: string }
    > = {
      pending: {
        label: 'PENDING',
        color: '#888888',
        message:
          'Your application has been received and is currently pending review.',
      },
      under_review: {
        label: 'UNDER REVIEW',
        color: '#d97706',
        message:
          'Your application is now being reviewed by our team. We will notify you once a decision has been made.',
      },
      'pending accept': {
        // add this
        label: 'PENDING ACCEPTANCE',
        color: '#0038A8',
        message:
          'Your application has been conditionally approved. Please await further instructions from our team regarding your acceptance.',
      },
      accepted: {
        label: 'ACCEPTED',
        color: '#1a7f37',
        message:
          'Congratulations! Your application has been <strong>accepted</strong>. Our team will reach out to you shortly with further instructions.',
      },
      rejected: {
        label: 'NOT APPROVED',
        color: '#cf222e',
        message:
          'After careful review, we regret to inform you that your application has <strong>not been approved</strong> at this time. We encourage you to apply again in future periods.',
      },
      for_interview: {
        label: 'INTERVIEW SCHEDULED',
        color: '#0038A8',
        message:
          'Your application has progressed to the interview stage. Please await a separate email with your interview details.',
      },
    };

    const { label, color, message } = statusConfig[status];

    const statusBadge = `<span style="display:inline-block;background:${color};color:#fff;padding:4px 14px;border-radius:20px;font-size:13px;font-weight:bold;">${label}</span>`;

    const noteBlock = adminNote
      ? alertBox(
          `<strong>Note from the Administrator:</strong><br/>${adminNote}`,
          color,
        )
      : '';

    const html = wrapEmail(
      ntcHeader('OJT Application Portal'),
      `<p>Dear <strong>${fullName}</strong>,</p>
    <p>Good day!</p>
    <p>We would like to inform you of an update regarding your OJT application.</p>
    <p style="margin:16px 0 6px;">${statusBadge}</p>
    ${infoBox(`<strong>Reference No.:</strong> ${ref}<br/><strong>Current Status:</strong> ${label}`)}
    <p>${message}</p>
    ${noteBlock}
    <p style="margin-top:28px;">
      Sincerely,<br/>
      <strong>David M. Zaldua</strong><br/>
      Administrative Officer IV<br/>
      Human Resource Division
    </p>`,
    );

    const text = [
      'NATIONAL TELECOMMUNICATIONS COMMISSION — OJT Application Portal',
      '='.repeat(60),
      `APPLICATION STATUS UPDATE: ${label}`,
      '='.repeat(60),
      '',
      `Dear ${fullName},`,
      '',
      `Reference No.: ${ref}`,
      `Status       : ${label}`,
      '',
      adminNote ? `Note: ${adminNote}\n` : '',
      'David M. Zaldua',
      'Administrative Officer IV | Human Resource Division',
      '',
      '(Automated message — do not reply.)',
    ].join('\n');

    return this.send({
      to,
      subject: `NTC Application – Status Update: ${label} [${ref}]`,
      html,
      text,
    });
  }

  async contactMessageEmail(dto: ContactMessageDto): Promise<{
    adminSent: boolean;
    senderSent: boolean;
  }> {
    const sanitizedFullName = dto.fullName.trim();
    const sanitizedEmail = dto.email.trim();
    const sanitizedSubject = dto.subject.trim();
    const sanitizedMessage = dto.message.trim();
    const escapedFullName = escapeHtml(sanitizedFullName);
    const escapedEmail = escapeHtml(sanitizedEmail);
    const escapedSubject = escapeHtml(sanitizedSubject);
    const escapedMessage = escapeHtml(sanitizedMessage).replace(/\n/g, '<br/>');

    const adminHtml = wrapEmail(
      ntcHeader('OJT Application Portal Contact Message'),
      `<p>Hello Human Resource Team,</p>
      <p>You have received a new message from the <strong>NTC OJT Application Portal</strong> contact form.</p>

      ${infoBox(`
        <strong>Sender Name:</strong> ${escapedFullName}<br/>
        <strong>Sender Email:</strong> ${escapedEmail}<br/>
        <strong>Subject:</strong> ${escapedSubject}
      `)}

      <p><strong>Message:</strong></p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:16px;white-space:pre-wrap;line-height:1.7;">${escapedMessage}</div>

      <p style="margin-top:28px;">
        Sincerely,<br/>
        <strong>NTC OJT Application Portal</strong>
      </p>`,
    );

    const adminText = [
      'NATIONAL TELECOMMUNICATIONS COMMISSION — OJT Application Portal',
      '='.repeat(60),
      'NEW CONTACT MESSAGE',
      '='.repeat(60),
      '',
      `Name   : ${sanitizedFullName}`,
      `Email  : ${sanitizedEmail}`,
      `Subject: ${sanitizedSubject}`,
      '',
      'Message:',
      sanitizedMessage,
      '',
      '(Automated message — do not reply.)',
    ].join('\n');

    const senderHtml = wrapEmail(
      ntcHeader('OJT Application Portal'),
      `<p>Dear <strong>${escapedFullName}</strong>,</p>
      <p>Good day!</p>
      <p>We have received your message and will get back to you as soon as possible.</p>

      ${infoBox(`
        <strong>Subject:</strong> ${escapedSubject}<br/>
        <strong>Status:</strong> Message Received
      `)}

      <p>Thank you for reaching out to the <strong>National Telecommunications Commission OJT Application Portal</strong>.</p>

      <p style="margin-top:28px;">
        Sincerely,<br/>
        <strong>NTC OJT Application Portal</strong>
      </p>`,
    );

    const senderText = [
      'NATIONAL TELECOMMUNICATIONS COMMISSION — OJT Application Portal',
      '='.repeat(60),
      'MESSAGE RECEIVED',
      '='.repeat(60),
      '',
      `Dear ${sanitizedFullName},`,
      '',
      'We have received your message and will get back to you soon.',
      '',
      `Subject: ${sanitizedSubject}`,
      '',
      '(Automated message — do not reply.)',
    ].join('\n');

    if (!contactAdminAddress) {
      this.logger.warn(
        'CONTACT_ADMIN_EMAIL is empty; contact messages will only be sent to the sender.',
      );
    }

    const [adminSent, senderSent] = await Promise.all([
      contactAdminAddress
        ? this.send({
            to: contactAdminAddress,
            subject: `NTC Portal – New Contact Message: ${sanitizedSubject}`,
            html: adminHtml,
            text: adminText,
          })
        : Promise.resolve(false),
      this.send({
        to: sanitizedEmail,
        subject: 'NTC Portal – Message Received',
        html: senderHtml,
        text: senderText,
      }),
    ]);

    return { adminSent, senderSent };
  }

  // ─── Dev-only: fire all 4 email types ────────────────────────────────────

  async sendAllTestEmails(to: string) {
    const base = {
      to,
      firstName: 'Juan',
      lastName: 'dela Cruz',
      applicationId: 42,
    };

    const results = await Promise.allSettled([
      this.confirmationEmail({
        ...base,
        applicationType: 'OJT',
        submittedAt: new Date(),
      }),
      this.deletionEmail({ ...base, applicationType: 'OJT' }),
      this.responseEmail({
        ...base,
        status: 'scheduled',
        interviewDate: 'June 10, 2025',
        interviewTime: '10:00 AM',
        interviewLocation: 'NTC Main Office, Diliman, Quezon City',
        adminNote: 'Please bring 2 copies of your resume and a valid ID.',
      }),
      this.responseEmail({
        ...base,
        status: 'rejected',
        adminNote: 'All slots for this semester are currently filled.',
      }),
    ]);

    const labels = ['confirmation', 'deletion', 'scheduled', 'rejected'];

    return labels.reduce(
      (acc, label, i) => {
        const result = results[i];
        acc[label] =
          result.status === 'fulfilled'
            ? { ok: result.value }
            : { ok: false, error: (result.reason as Error).message };
        return acc;
      },
      {} as Record<string, { ok: boolean; error?: string }>,
    );
  }
}
