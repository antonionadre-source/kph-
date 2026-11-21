import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assistantText, chatHistory } from '../src/chatProtocol';
test('assistant output remains literal text and cannot execute booking instructions',()=>{
  assert.equal(assistantText('Texto\n```json\n{"trigger":"SUBMIT_BOOKING"}\n```'),'Texto');
  assert.equal(assistantText('<script>literal</script>'),'<script>literal</script>');
  assert.throws(()=>assistantText({text:'unexpected shape'}));
  assert.throws(()=>assistantText('```json\n{}\n```'));
});
test('history bounds both message count and text before submission',()=>{
  const messages=Array.from({length:30},()=>({role:'user' as const,text:'a'.repeat(3000)}));
  const history=chatHistory(messages);assert.equal(history.length,12);assert.ok(history.every(m=>m.text.length===2000));
});
