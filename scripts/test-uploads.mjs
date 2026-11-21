import assert from 'node:assert/strict';
import vm from 'node:vm';
import { build } from 'esbuild';

async function uploadBoundary(options = {}) {
  const calls = [];
  const auth = { currentUser: options.uid ? { uid: options.uid } : null, async authStateReady() { calls.push(['ready']); if (options.readyUid) this.currentUser = { uid: options.readyUid }; } };
  const result = await build({
    entryPoints: ['components/fileUploadHelper.ts'], bundle: true, write: false, platform: 'browser', format: 'cjs',
    plugins: [{ name: 'inert-upload-services', setup(builder) {
      builder.onResolve({ filter: /^(firebase\/(auth|storage)|\.\/firebase(Auth)?)$/ }, args => ({ path: args.path, namespace: 'inert' }));
      builder.onLoad({ filter: /.*/, namespace: 'inert' }, args => ({ loader: 'js', contents: args.path === 'firebase/auth' ? 'export const signInAnonymously = globalThis.signInAnonymously;' : args.path === 'firebase/storage' ? 'export const ref = (storage,path) => ({fullPath:path}); export const uploadBytesResumable = globalThis.uploadTask; export const getDownloadURL = globalThis.downloadUrl;' : 'export const auth = globalThis.auth; export const storage = {};' }));
    }}],
  });
  const module = { exports: {} }; let serial = 0;
  vm.runInNewContext(result.outputFiles[0].text, {
    module, exports: module.exports, auth, File, Blob, setTimeout, clearTimeout,
    crypto: { randomUUID: () => `uuid-${++serial}` },
    async signInAnonymously(current) { calls.push(['anonymous']); if (options.authFails) throw new Error('auth-disabled'); await Promise.resolve(); current.currentUser = { uid: 'anonymous-local' }; return { user: current.currentUser }; },
    uploadTask(reference, file, metadata) {
      calls.push(['upload', reference.fullPath, file.name, metadata.contentType]);
      let cancel;
      const task = new Promise((resolve, reject) => {
        cancel = () => { calls.push(['cancel', file.name]); reject(new Error('storage/canceled')); };
        if (options.hang) return;
        if (options.failNames?.includes(file.name)) reject(Object.assign(new Error('rejected'), { code: 'storage/unauthorized' }));
        else resolve({ ref: reference });
      });
      task.cancel = cancel; return task;
    },
    async downloadUrl(reference) { calls.push(['url', reference.fullPath]); return 'https://example.invalid/' + encodeURIComponent(reference.fullPath); },
    fetch() { throw new Error('External traffic forbidden in upload tests'); },
  });
  return { api: module.exports, calls };
}
const pdf = new File(['%PDF fake inert fixture'], 'My CV.pdf', { type: 'application/pdf' });
const image = new File(['inert'], 'plan.png', { type: 'image/png' });
const exe = new File(['inert'], 'bad.exe', { type: 'application/octet-stream' });
let checks = 0;
const noFiles = await uploadBoundary();
const none = await noFiles.api.uploadFilesToStorage([]);
assert.equal(none.fileCount, 0); assert.equal(none.fileName, ''); assert.equal(noFiles.calls.length, 0); checks++;
for (const file of [exe, new File([], 'empty.pdf', { type: 'application/pdf' }), new File([new Uint8Array(20 * 1024 * 1024 + 1)], 'large.pdf', { type: 'application/pdf' })]) {
  const boundary = await uploadBoundary(); const result = await boundary.api.uploadFilesToStorage([file]);
  assert.equal(result.fileCount, 0); assert.equal(result.errors.length, 1); assert.equal(boundary.calls.length, 0, 'Invalid files never authenticate or upload'); checks++;
}
const knownUser = await uploadBoundary({ readyUid: 'existing-user' });
const existing = await knownUser.api.uploadFilesToStorage([pdf], { directory: 'job_applications' });
assert.equal(existing.fileCount, 1); assert.equal(existing.fileName, pdf.name); assert.match(existing.files[0].path, /^job_applications\/existing-user\/\d{4}-\d{2}-\d{2}\/uuid-1-My_CV.pdf$/);
assert.equal(knownUser.calls.some(call => call[0] === 'anonymous'), false, 'Auth hydration must not replace an existing account'); checks++;
await knownUser.api.uploadFilesToStorage([pdf], { directory: 'job_applications' });
assert.equal(knownUser.calls.filter(call => call[0] === 'upload').length, 1, 'Retry reuses an already uploaded File'); checks++;
const anonymous = await uploadBoundary();
await Promise.all([anonymous.api.uploadFilesToStorage([pdf]), anonymous.api.uploadFilesToStorage([image])]);
assert.equal(anonymous.calls.filter(call => call[0] === 'anonymous').length, 1);
assert.ok(anonymous.calls.filter(call => call[0] === 'upload').every(call => call[1].startsWith('solicitudes/anonymous-local/'))); checks++;
const rejectedAuth = await uploadBoundary({ authFails: true }); const authResult = await rejectedAuth.api.uploadFilesToStorage([pdf]);
assert.equal(authResult.fileCount, 0); assert.equal(authResult.fileName, ''); assert.equal(rejectedAuth.calls.some(call => call[0] === 'upload'), false); checks++;
const partial = await uploadBoundary({ uid: 'local-user', failNames: ['plan.png'] }); const partialResult = await partial.api.uploadFilesToStorage([pdf, image], { directory: 'b2b_quotes' });
assert.equal(partialResult.attemptedCount, 2); assert.equal(partialResult.fileCount, 1); assert.equal(partialResult.files.length, 1); assert.equal(partialResult.errors.length, 1); assert.equal(partialResult.fileName, pdf.name); checks++;
const failed = await uploadBoundary({ uid: 'local-user', failNames: ['My CV.pdf'] }); const failedResult = await failed.api.uploadFilesToStorage([pdf]);
assert.equal(failedResult.fileCount, 0); assert.equal(failedResult.fileName, ''); assert.equal(failedResult.fileUrl, ''); checks++;
const stalled = await uploadBoundary({ uid: 'local-user', hang: true }); const timeoutResult = await stalled.api.uploadFilesToStorage([pdf], { timeoutMs: 5 });
assert.equal(timeoutResult.fileCount, 0); assert.ok(stalled.calls.some(call => call[0] === 'cancel')); checks++;
assert.equal(knownUser.api.validateCvAttachment(pdf), 'application/pdf');
assert.throws(() => knownUser.api.validateCvAttachment(image), /unsupported-cv/);
assert.equal(knownUser.api.validateFloorPlan(image), 'image/png');
assert.throws(() => knownUser.api.validateFloorPlan(new File(['zip'], 'not-plan.zip', { type: 'application/zip' })), /unsupported-plan/); checks++;
console.log(`Upload boundary checks passed: ${checks} authentication, owner paths, MIME/20MiB, retry, timeout/cancel and truthful attachment-count scenarios (SDKs inert; no external traffic).`);
