import assert from 'node:assert/strict';
import { fetchWindGeneration } from '../src/services/windDataService.js';
const OriginalDate=Date;
class TestDate extends OriginalDate { constructor(...args){super(...(args.length?args:['2026-11-01T12:00:00Z']))} static now(){return OriginalDate.parse('2026-11-01T12:00:00Z')} }
globalThis.Date=TestDate;
const originalFetch=globalThis.fetch;
try {
 for(const [datetime,hours] of [['2026-10-20T00:00:00+02:00',24],['2026-03-29T00:00:00+01:00',23],['2026-10-25T00:00:00+02:00',25]]){
  let requested;
  globalThis.fetch=async url=>{if(String(url).startsWith('/esios-api'))return new Response('{}',{status:403});requested=new URL(url,'https://example.test');return Response.json({included:[{attributes:{title:'Eólica',values:[{datetime,value:hours*5000,percentage:.2},{datetime:'2026-11-01T00:00:00+01:00',value:999999,percentage:.9}]}},{attributes:{title:'Nuclear',values:[{datetime,value:hours*20000,percentage:.8}]}}]})};
  const result=await fetchWindGeneration();assert.equal(result.windMw,5000);assert.equal(result.totalMw,25000);assert.equal(result.normalizedPower,5000/31679);assert.equal(result.share,.2);assert.equal(result.dataBasis,'REData');assert(result.status.includes('base REData'));assert.equal(requested.searchParams.get('end_date'),'2026-10-31T23:59');
 }
 globalThis.fetch=async()=>Response.json({indicator:{name:'Eolica',values:[{datetime:'2026-11-01T12:00:00Z',value:4416,geo_name:'Peninsula'}]}});
 const esios=await fetchWindGeneration();assert.equal(esios.windMw,4416);assert.equal(esios.dataBasis,'ESIOS');
 console.log(JSON.stringify({passed:true,closedDay:true,mwhToMeanMw:true,hoursTested:[23,24,25],esiosUnchanged:true}));
} finally {globalThis.Date=OriginalDate;globalThis.fetch=originalFetch}
