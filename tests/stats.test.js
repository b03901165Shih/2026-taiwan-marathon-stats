const assert=require('node:assert/strict');
const S=require('../js/stats.js');
assert.deepEqual(S.metrics([60,60,90],60),{total:3,faster:0,equal:2,slower:1,rank:1,pr:1/3*100});
assert.equal(S.metrics([60,60,90],59).pr,100);
assert.equal(S.metrics([60,60,90],91).rank,4);
assert.equal(S.metrics([60,60,90],91).pr,0);
assert.equal(S.metrics([],60),null);
assert.equal(S.target([60,60,90],100).sec,59);
assert.equal(S.target([60,60,90],0).unbounded,true);
assert.equal(S.target([60,60,90],50).sec,59);
assert.equal(S.target([0],100),null);
assert.equal(S.target([],80),null);
// Verify inverse thresholds independently against a direct count, including ties.
for(const arr of [[1],[10,10,10],[10,20,20,30],[0,5,5,20]]){
  for(const pr of [0.1,25,33.3333333333,50,80,99.9,100]){
    const result=S.target(arr,pr);
    const eligible=Array.from({length:arr[arr.length-1]+1},(_,t)=>t).filter(t=>arr.filter(x=>x>t).length/arr.length*100+1e-10>=pr);
    assert.equal(result?.sec??null,eligible.length?eligible[eligible.length-1]:null);
  }
}
assert.equal(S.time(3661),'01:01:01');
assert.equal(S.rankTarget([10,20,20,30],3).cutoff,20);
assert.equal(S.rankTarget([10,20,20,30],3).sec,19);
assert.ok(S.rankTarget([10,20,20,30],3).metric.rank<=3);
assert.equal(S.rankTarget([10,20],10),null);
assert.equal(S.rankTarget([0],1).sec,null);
assert.equal(S.rankTarget([],10),null);
console.log('Statistics checks passed: ties, out-of-range, PR endpoints, inverse thresholds.');
