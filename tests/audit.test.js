const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const config=require('../events_config.json'),audits=require('../data/source-audit.json');
const allEvents=[...config.past_events,...config.events].filter(e=>e.bravelog_source_url||e.bravelog_filters||['www.bravelog.tw','bravelog.tw','www.run2pix.com','run2pix.com'].includes(new URL(e.source_url).hostname));
const completedOnly=process.argv.includes('--completed-only');
const events=completedOnly?allEvents.filter(e=>audits[e.id]):allEvents;
for(const e of events){
  const audit=audits[e.id];assert.ok(audit,e.id+' must have completed source audit');
  assert.equal(audit.version,1);assert.equal(audit.method,e.ranking_validation);
  assert.deepEqual(Object.keys(audit.sources).sort(),e.race_types.slice().sort());
  const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(`data/${e.id}_data.js`,'utf8'),ctx);
  const event=ctx.window.marathonData[e.id];assert.deepEqual(JSON.parse(JSON.stringify(event.metadata.ranking_audit)),audit,e.id+' workbook proof matches published source record');
  const publicRows=[];
  for(const [race,source] of Object.entries(audit.sources)){
    if(audit.method==='bravelog_individual')assert.equal(source.profile_count,source.raw_count,e.id+' all raw rows independently checked, including missing list clocks');
    if(audit.method==='bravelog_individual')assert.equal((source.verified_profile_count??source.raw_count)+(source.unavailable_no_clock_count??0),source.raw_count,e.id+' verified profiles and explicit source gaps cover raw list');
    const times=event.binsAndPr[`${e.id}__${race}__ALL`]?.sorted_seconds||[];
    assert.equal(times.length,source.ranked_count,e.id+' '+race+' count matches audited source');
    assert.deepEqual(Array.from(times.slice(0,10)),source.first_ten_seconds,e.id+' '+race+' source anchors');
    for(const [key,entry] of Object.entries(event.binsAndPr)){
      const prefix=`${e.id}__${race}__`;
      if(!key.startsWith(prefix))continue;
      const group=key.slice(prefix.length);if(group==='ALL')continue;
      for(const seconds of entry.sorted_seconds)publicRows.push([race,group,seconds]);
    }
  }
  publicRows.sort((a,b)=>(a[0]<b[0]?-1:a[0]>b[0]?1:0)||(a[1]<b[1]?-1:a[1]>b[1]?1:0)||a[2]-b[2]);
  const digest=crypto.createHash('sha256').update(JSON.stringify(publicRows)).digest('hex');
  assert.equal(digest,audit.public_data_digest,e.id+' all published groups and times match qualified source');
}
console.log(`Ranking audit checks passed: ${events.length}/${allEvents.length} BraveLog events, complete counts, source anchors and every group/time digest.${completedOnly?' Completed subset only; this does not certify pending events.':''}`);
