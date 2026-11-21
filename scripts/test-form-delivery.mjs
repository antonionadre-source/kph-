import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Execute the real submit handlers with inert Auth/Storage/Firestore/notification boundaries.
function loadHandler(path, name, scope) {
  const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let initializer;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === name) initializer = node.initializer;
    ts.forEachChild(node, visit);
  }
  visit(source); assert.ok(initializer, `${name} exists in ${path}`);
  const javascript = ts.transpileModule(`(${initializer.getText(source)})`, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  return vm.runInNewContext(javascript, { console: { log() {}, warn() {}, error() {} }, window: { scrollTo() {} }, ...scope });
}
const event = { preventDefault() {} };
const emptyUpload = { fileUrl: '', fileUrls: '', fileName: '', fileCount: 0, attemptedCount: 0, files: [], errors: [] };
const cv = new File([new Uint8Array(1024 * 1024)], 'actual-cv.pdf', { type: 'application/pdf' });
const uploaded = { name: cv.name, url: 'https://example.invalid/private-cv', path: 'job_applications/local-test/cv.pdf', contentType: cv.type, size: cv.size };
let checks = 0;

async function careerCase({ primary = true, secondary = true, attachment = null, upload = emptyUpload, authFails = false, invalidCv = false, staleName = '', existing = false } = {}) {
  let submitted = false; let error = null; let loading = false; let notice = ''; let saved; let writes = 0; let notifications = 0; let uploads = 0;
  const submissionRef = { current: null };
  const handler = loadHandler('components/CareersPage.tsx', 'handleSubmit', {
    db: {}, cvFile: attachment, language: 'es', submissionRef, externalSubmissionsEnabled: true,
    formData: { name: 'Local test', phone: '+41000000000', position: 'Cleaning', region: 'test', permit: 'test', startDate: '', pensum: 'part-time', certificates: '', languages: '', message: 'isolated', cvName: staleName },
    SERVICE_ID: 'test', TEMPLATE_ID: 'test', PUBLIC_KEY: 'test', MAKE_WEBHOOK_URL: 'https://example.invalid/hook',
    async ensureUploadUser() { if (authFails) throw new Error('auth-disabled'); return 'local-test'; },
    validateCvAttachment() { if (invalidCv) throw new Error('attachment/unsupported-cv'); },
    async uploadFilesToStorage(files, options) { uploads++; assert.equal(options.directory, 'job_applications'); return upload; },
    collection() { return {}; }, doc() { return { id: 'receipt-1' }; }, async getDoc() { return { exists: () => existing }; },
    serverTimestamp() { return 'SERVER_TIMESTAMP'; }, sanitizeFirestoreData: data => data,
    async setDoc(_ref, payload) { writes++; saved = payload; if (!primary) throw new Error('Firestore rejected'); },
    async postWebhook(_url, payload) { notifications++; if (!secondary) throw new Error('Make rejected'); assert.equal(payload.fileCount, upload.fileCount); },
    emailjs: { async send() { notifications++; if (!secondary) throw new Error('EmailJS rejected'); } },
    withPortalTimeout: operation => operation,
    attachmentText(_lang, key) { return `attachment:${key}`; },
    t: { errorMsg: 'Application not confirmed.' },
    setError(value) { error = value; }, setIsLoading(value) { loading = value; }, setDeliveryNotice(value) { notice = value; }, setIsSubmitted(value) { submitted = value; },
  });
  await handler(event);
  return { handler, submitted, error, loading, notice, saved, writes, notifications, uploads, submissionRef };
}
for (const primary of [false, true]) for (const secondary of [false, true]) {
  const result = await careerCase({ primary, secondary });
  assert.equal(result.submitted, primary, 'Careers requires the primary Firestore receipt');
  assert.equal(Boolean(result.error), !primary);
  assert.equal(result.loading, false);
  if (!primary) assert.equal(result.notifications, 0, 'Do not notify before persistence');
  if (primary && !secondary) assert.equal(result.notice, 'attachment:saved', 'Secondary failure preserves saved application');
  checks++;
}
const failedCv = await careerCase({ attachment: cv, upload: { ...emptyUpload, attemptedCount: 1, errors: [{ name: cv.name, code: 'storage/unauthorized' }] } });
assert.equal(failedCv.submitted, false); assert.equal(failedCv.writes, 0); assert.equal(failedCv.notifications, 0); checks++;
const actualCv = await careerCase({ attachment: cv, upload: { ...emptyUpload, fileUrl: uploaded.url, fileUrls: uploaded.url, fileName: uploaded.name, fileCount: 1, attemptedCount: 1, files: [uploaded] } });
assert.equal(actualCv.submitted, true); assert.equal(actualCv.saved.cvUrl, uploaded.url); assert.equal(actualCv.saved.cvData, ''); assert.equal(actualCv.saved.cvName, cv.name); checks++;
const phantomCv = await careerCase({ staleName: 'missing-cv.pdf' });
assert.equal(phantomCv.saved.cvName, ''); assert.equal(phantomCv.saved.cvUrl, ''); assert.equal(phantomCv.saved.cvData, ''); checks++;
for (const options of [{ authFails: true }, { attachment: cv, invalidCv: true }]) {
  const result = await careerCase(options); assert.equal(result.submitted, false); assert.equal(result.writes, 0); assert.equal(result.notifications, 0); checks++;
}
const recovered = await careerCase({ primary: false, existing: true });
await recovered.handler(event);
assert.equal(recovered.submissionRef.current.id, 'receipt-1', 'Retry reuses the same receipt ID'); checks++;

async function businessCase({ primary = true, upload = emptyUpload, plans = [], authFails = false, phone = '+41000000000' } = {}) {
  let complete = false; let error = ''; let busy = false; let saved; let writes = 0; let notices = 0;
  const handler = loadHandler('components/CommercialQuotePage.tsx', 'handleSubmit', {
    db: {}, language: 'es', quoteRef: { current: null }, monthly: 1200, annual: 14400,
    formData: { companyName: 'Test company', contactName: 'Test person', contactEmail: 'test@example.invalid', contactPhone: phone, postalCode: '8200', city: 'Schaffhausen', address: 'Test address', buildingType: 'office', numBuildings: 1, totalArea: 100, hours: 2, services: { dailyCleaning: true, gardening: false }, protocols: { ecoOnly: true }, frequency: 'weekly', floorPlans: plans },
    async ensureUploadUser() { if (authFails) throw new Error('auth-disabled'); return 'local-test'; },
    validateFloorPlan() {}, async uploadFilesToStorage(_files, options) { assert.equal(options.directory, 'b2b_quotes'); return upload; },
    collection() { return {}; }, doc() { return { id: 'business-1' }; }, async getDoc() { return { exists: () => false }; },
    serverTimestamp() { return 'SERVER_TIMESTAMP'; }, sanitizeFirestoreData: data => data,
    async setDoc(_ref, payload) { writes++; saved = payload; if (!primary) throw new Error('Firestore rejected'); },
    sendLead() { notices++; return Promise.resolve(); }, withPortalTimeout: operation => operation,
    portalText(_language, key) { return `portal:${key}`; }, attachmentText(_language, key) { return `attachment:${key}`; },
    setErrorMsg(value) { error = value; }, setSubmitting(value) { busy = value; }, setComplete(value) { complete = value; }, setStep() {},
  });
  await handler(); return { complete, error, busy, saved, writes, notices };
}
for (const primary of [false, true]) {
  const result = await businessCase({ primary });
  assert.equal(result.complete, primary); assert.equal(Boolean(result.error), !primary); assert.equal(result.busy, false);
  if (!primary) assert.equal(result.notices, 0);
  if (primary) { assert.equal(result.saved.userId, 'local-test'); assert.deepEqual(Array.from(result.saved.services), ['dailyCleaning']); assert.equal(result.saved.floorPlans.length, 0); }
  checks++;
}
const noPlan = await businessCase({ plans: [{ name: cv.name, rawFile: cv }], upload: { ...emptyUpload, errors: [{ name: cv.name, code: 'storage/unauthorized' }] } });
assert.equal(noPlan.complete, false); assert.equal(noPlan.writes, 0); checks++;
const realPlan = await businessCase({ plans: [{ name: cv.name, rawFile: cv }], upload: { ...emptyUpload, fileCount: 1, files: [uploaded], fileUrl: uploaded.url, fileName: uploaded.name } });
assert.equal(realPlan.complete, true); assert.equal(realPlan.saved.floorPlans[0].url, uploaded.url); assert.equal(realPlan.saved.floorPlans[0].content, undefined); assert.equal(realPlan.saved.floorPlans[0].rawFile, undefined); checks++;
for (const options of [{ authFails: true }, { phone: '' }]) { const result = await businessCase(options); assert.equal(result.complete, false); assert.equal(result.writes, 0); checks++; }
console.log(`Form delivery checks passed: ${checks} primary-receipt, CV/attachment, authentication, retry and B2B schema scenarios (all boundaries mocked; no data sent).`);
