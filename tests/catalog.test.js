const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const config=require('../events_config.json');
const ctx={window:{}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('data/event-catalog.js','utf8'),ctx);
const catalog=ctx.window.RunEventCatalog;
const events=[...config.past_events,...config.events].filter(e=>fs.existsSync(`data/${e.id}_data.js`));
assert.equal(catalog.length,events.length);
for(const e of events){
  const entry=catalog.find(c=>c.metadata.event_id===e.id);
  assert.ok(entry,e.id+' registered automatically');
  assert.equal(entry.src,`data/${e.id}_data.js`);
  assert.equal(entry.metadata.event_date,e.date);
  assert.equal(entry.metadata.event_name,e.name);
  assert.equal(entry.metadata.notes,e.notes||'');
  assert.equal(entry.requires_ranking_audit,Boolean(e.ranking_validation),e.id+' audit requirement follows settings');
  assert.deepEqual(JSON.parse(JSON.stringify(entry.metadata.race_distances_km)),e.race_distances_km);
  vm.runInContext(fs.readFileSync(entry.src,'utf8'),ctx);
  for(const key of Object.keys(ctx.window.marathonData[e.id].binsAndPr)){
    assert.ok(e.race_distances_km[key.split('__')[1]]>0,`${e.id}: catalog covers actual race distance`);
  }
  for(const [race,groups] of Object.entries(e.group_age_ranges||{})){
    assert.match(e.group_age_source,/^https:\/\//);
    for(const [group,band] of Object.entries(groups)){
      assert.ok(ctx.window.marathonData[e.id].binsAndPr[`${e.id}__${race}__${group}`],`${e.id}: exact source group ${group}`);
      assert.ok(Number.isInteger(band[0])&&band[0]>=0&&(band[1]===null||Number.isInteger(band[1])&&band[1]>=band[0]));
    }
  }
  assert.deepEqual(JSON.parse(JSON.stringify(entry.metadata.group_age_ranges||{})),e.group_age_ranges||{});
}
console.log(`Catalog checks passed: ${events.length} files, settings synchronized, age mappings reference real groups.`);
