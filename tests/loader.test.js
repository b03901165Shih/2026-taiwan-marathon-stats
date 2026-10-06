const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const loader=fs.readFileSync('js/data-loader.js','utf8');
function setup(entries,events={}){
  const scripts=[];
  const ctx={window:{RunEventCatalog:entries,marathonData:events}};
  ctx.document={createElement:()=>({}),head:{append:script=>scripts.push(script)}};
  vm.createContext(ctx);vm.runInContext(loader,ctx);
  return {store:ctx.window.RunDataStore,scripts,events:ctx.window.marathonData};
}
(async()=>{
  const proof={version:1,event_id:'sample',checked_at:'2026-10-04',sources:{MA:{ranked_count:1}}};
  const entry=ranking_audit=>({src:'sample.js',requires_ranking_audit:true,ranking_audit,metadata:{event_id:'sample',event_name:'Sample'}});
  const event=audit=>({metadata:{event_id:'sample',ranking_audit:audit},binsAndPr:{sample:{sorted_seconds:[1]}}});
  let state=setup([entry(undefined)],{sample:event(proof)});
  assert.equal(state.scripts.length,0,'catalog alone must not download event files');
  assert.equal(await state.store.load('sample'),null,'missing audit must not load');
  assert.match(state.store.failures.get('sample'),/查核/);

  state=setup([entry({...proof,checked_at:'later'})],{sample:event(proof)});
  let result=state.store.load('sample');state.scripts[0].onload();
  assert.equal(await result,null,'stale audit cannot enter comparisons');
  assert.equal(state.events.sample,undefined);

  state=setup([entry(proof)],{sample:event(proof)});
  result=state.store.load('sample');state.scripts[0].onload();
  assert.ok(await result,'verified, synchronized audit accepted');
  assert.equal(state.store.status('sample'),'loaded');

  const entries=['a','b','c'].map(id=>({src:id+'.js',metadata:{event_id:id,event_name:id}}));
  const events=Object.fromEntries(entries.map(e=>[e.metadata.event_id,{metadata:{},binsAndPr:{x:{sorted_seconds:[1]}}}]));
  state=setup(entries,events);
  const warm=state.store.prefetch(['a','b','c']);
  assert.equal(state.scripts.length,1,'background prefetch is sequential');
  const c=state.store.load('c',true,true);
  assert.equal(state.scripts.length,2,'selected event starts while a background load is running');
  assert.equal(state.scripts[1].src,'c.js','selected event is promoted ahead of queued background work');
  state.scripts[1].onload();await c;
  assert.equal(state.scripts.length,2,'another background load waits for an idle slot');
  state.scripts[0].onload();
  assert.equal(state.scripts[2].src,'b.js');state.scripts[2].onload();await warm;
  console.log('Loader checks passed: on-demand loading, priority, bounded prefetch and audit checks.');
})().catch(error=>{console.error(error);process.exitCode=1;});
