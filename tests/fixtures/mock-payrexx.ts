import axios from 'axios';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

// No socket is opened: reject any unexpected outbound axios request.
axios.defaults.adapter = async config => {
  assert.equal(config.url, 'https://api.payrexx.com/v1.0/Gateway/?instance=isolated-test');
  const payload = new URLSearchParams(String(config.data));
  const signature = payload.get('ApiSignature');
  payload.delete('ApiSignature');
  const signable = Array.from(payload).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v).replace(/%20/g, '+')}`).join('&');
  assert.equal(signature, crypto.createHmac('sha256', 'test-secret').update(signable).digest('base64'));
  assert.equal(payload.get('amount'), '1235');
  assert.equal(payload.get('currency'), 'CHF');
  assert.equal(payload.get('fields[forename][value]'), 'Test');
  assert.equal(payload.get('fields[surname][value]'), 'Person');
  assert.equal(payload.get('successRedirectUrl'), 'http://localhost:3000/quote?payment=success');
  return { status: 200, statusText: 'OK', headers: {}, config, data: { status: 'success', data: [{ id: 42, link: 'https://example.invalid/payment' }] } };
};
