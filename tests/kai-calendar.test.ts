import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectKaiMoment, easterDate, kaiMedia, KAI_MOMENTS } from '../src/content/kaiCalendar';

test('Kai calendar uses the Zurich calendar day at the year boundary', () => {
  assert.equal(selectKaiMoment(new Date('2026-12-31T23:01:00Z')), 'new-year');
  assert.equal(selectKaiMoment(new Date('2026-12-31T22:01:00Z')), 'new-years-eve');
});
test('Kai calendar gives celebrations precedence over seasons and computes movable dates', () => {
  for (const [date, expected] of [['2027-02-15','carnival'],['2027-03-28','easter'],['2028-04-24','sechselaeuten'],['2027-04-19','sechselaeuten'],['2027-08-01','swiss-national-day'],['2027-12-06','samichlaus'],['2027-12-24','christmas'],['2027-06-10','summer'],['2027-11-21','autumn'],['2027-01-15','winter'],['2027-05-10','spring'],['2027-08-20','back-to-school'],['2027-09-20','harvest'],['2027-03-05','spring-cleaning']]) {
    assert.equal(selectKaiMoment(new Date(date+'T12:00:00Z')),expected,date);
  }
  assert.equal(easterDate(2028).toISOString().slice(0,10),'2028-04-16');
  assert.equal(selectKaiMoment(new Date('2040-04-16T12:00:00Z')),'spring');
});
test('Kai preview accepts only known catalog IDs and returns stable media paths', () => {
  assert.equal(selectKaiMoment(new Date('2027-06-10T12:00:00Z'),'christmas'),'christmas');
  assert.equal(selectKaiMoment(new Date('2027-06-10T12:00:00Z'),'../../bad'),'summer');
  for(const id of KAI_MOMENTS) assert.equal(kaiMedia(id).hero,`/kai-calendar/${id}/hero-1440.webp`);
});
