const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const S=require('../js/stats.js');
const context={window:{}};vm.createContext(context);
for(const file of fs.readdirSync(path.join(__dirname,'../data')).filter(f=>f.endsWith('.js')))vm.runInContext(fs.readFileSync(path.join(__dirname,'../data',file),'utf8'),context);
let races=0;
for(const [id,e] of Object.entries(context.window.marathonData)){
  for(const [key,obj] of Object.entries(e.binsAndPr)){
    const arr=obj.sorted_seconds;
    assert.ok(arr.every((t,i)=>Number.isInteger(t)&&t>=0&&(!i||t>=arr[i-1])),key+' valid ordered times');
    if(!key.endsWith('__ALL'))continue;
    const race=key.split('__')[1];
    assert.ok(e.metadata.race_distances_km[race]>0,key+' has actual distance');
    const merged=Object.entries(e.binsAndPr).filter(([k])=>k.split('__')[1]===race&&!k.endsWith('__ALL')).flatMap(([,v])=>Array.from(v.sorted_seconds)).sort((a,b)=>a-b);
    assert.deepEqual(merged,Array.from(arr),key+' groups partition ALL');
    for(const pr of [0,50,80,90,100]){
      const target=S.target(arr,pr);assert.ok(target,key+' target exists');
      assert.ok(S.metrics(arr,target.sec).pr+1e-10>=pr,key+' target satisfies PR');
      if(pr>0)assert.ok(S.metrics(arr,target.sec+1).pr<pr,key+' next second fails target');
    }
    races++;
  }
}
console.log(`Data checks passed: ${Object.keys(context.window.marathonData).length} events, ${races} races; group totals, distances and PR targets.`);
