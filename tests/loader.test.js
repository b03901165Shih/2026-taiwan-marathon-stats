const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const loader=fs.readFileSync('js/data-loader.js','utf8');
async function load(audit,checkpoint){
  const event={metadata:{event_id:'sample',ranking_audit:audit},binsAndPr:{}};
  const ctx={window:{RunEventCatalog:[{src:'sample.js',requires_ranking_audit:true,ranking_audit:checkpoint,metadata:{event_id:'sample',event_name:'Sample'}}],marathonData:{sample:event}}};
  ctx.document={createElement:()=>({}),head:{append:script=>script.onload()}};
  vm.createContext(ctx);vm.runInContext(loader,ctx);
  return {failures:await ctx.window.RunDataReady,event:ctx.window.marathonData.sample};
}
(async()=>{
  const proof={version:1,event_id:'sample',checked_at:'2026-10-04',sources:{MA:{ranked_count:1}}};
  let result=await load(undefined,proof);
  assert.equal(result.event,undefined,'legacy unaudited event cannot enter comparisons');
  assert.match(result.failures[0],/查核/);
  result=await load(proof,{...proof,checked_at:'later'});
  assert.equal(result.event,undefined,'old data cannot reuse a different current source checkpoint');
  result=await load(proof,proof);
  assert.ok(result.event,'verified, synchronized event stays available');
  assert.equal(result.failures[0],null);
  console.log('Loader checks passed: missing proof and stale data excluded; synchronized audit accepted.');
})().catch(error=>{console.error(error);process.exitCode=1;});
