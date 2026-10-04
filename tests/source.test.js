// Independent source anchors, checked against public rankings on 2026-10-03.
// Update these only after verifying the corresponding source, never from generated data.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('data/2025_eva_air_marathon_data.js','utf8'),ctx);
const event=ctx.window.marathonData['2025_eva_air_marathon'];
assert.equal(event.metadata.source_url,'https://www.run2pix.com/report/report_w.php?EventCode=20251026&Race=MA&sn=354');
assert.deepEqual(Array.from(event.binsAndPr['2025_eva_air_marathon__MA__ALL'].sorted_seconds.slice(0,10)),
  [8292,8460,8758,8788,8990,9265,9474,9557,9648,9669],
  'MA: first ten finish times must match independently verified public ranking');
for(const [race,expected] of Object.entries({MA:8292,HM:4031,'10KM':1959})){
  const times=event.binsAndPr[`2025_eva_air_marathon__${race}__ALL`].sorted_seconds;
  assert.equal(times[0],expected,`${race}: fastest time must match verified formal ranking`);
  assert.equal(times.length,{MA:2623,HM:7145,'10KM':6592}[race],`${race}: count must match the complete formal ranking report`);
}
console.log('Source checks passed: EVA marathon 02:18:12, half 01:07:11, 10K 00:32:39.');
