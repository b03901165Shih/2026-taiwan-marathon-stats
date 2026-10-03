(async () => {
  'use strict';
  const failed = await window.RunDataReady;
  const S = window.RunStats;
  const A = window.RunAge;
  const $ = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num = n => n.toLocaleString('zh-TW');
  const pct = n => n.toFixed(2) + '%';
  const colors = ['#127b68','#5974c5','#c77736','#9465ad','#cb6270','#408da3','#7a8837','#766453','#4c5979','#8c6a31'];
  const events = Object.values(window.marathonData || {}).filter(e => Object.keys(e.binsAndPr || {}).length).sort((a,b) => b.metadata.event_date.localeCompare(a.metadata.event_date));
  const eventById = new Map(events.map(e => [e.metadata.event_id,e]));
  const raceIndex = new Map(), cache = new Map();
  let histChart, compareChart, rows = [], skipped = [], selectedCharts = new Set(), comparisonKey = '';
  let activeTab = 'position', sec = 5400, timeValid = true;

  // Index source groups once; all queries use exactly the same population filter.
  for (const e of events) {
    const races = new Map();
    for (const [key,value] of Object.entries(e.binsAndPr)) {
      const [,race,group] = key.split('__');
      if (!race || !group || group === 'ALL') continue;
      if (!races.has(race)) races.set(race,[]);
      races.get(race).push({name:group,category:S.category(group),gender:S.gender(group),age:A.describe(group,e.metadata,race),seconds:value.sorted_seconds || []});
    }
    raceIndex.set(e.metadata.event_id,races);
  }
  function options(id, items, preferred) {
    const el=$(id); el.replaceChildren(...items.map(([value,label]) => new Option(label,value)));
    if (items.some(([value])=>value===preferred)) el.value=preferred;
  }
  const eventId = () => $('event').value;
  const distance = (id,race) => eventById.get(id)?.metadata.race_distances_km?.[race];
  const distanceName = km => km===21.0975?'半馬 · 21.0975K':km===42.195?'全馬 · 42.195K':km?`${km} 公里`:'距離未設定';
  function raceName(id,race) {
    const same = [...(raceIndex.get(id)?.keys() || [])].filter(r=>distance(id,r)===distance(id,race));
    return distanceName(distance(id,race))+(same.length>1?`（${race}）`:'');
  }
  function groups(id,race) {
    const base=(raceIndex.get(id)?.get(race)||[]).filter(g => $('category').value==='ALL'||g.category===$('category').value);
    const age=A.parse($('population').value);
    if(age)return A.match(base,age);
    return base.filter(g => $('population').value==='ALL'||g.gender===$('population').value||'group:'+g.name===$('population').value);
  }
  function population(id,race) {
    const key=JSON.stringify([id,race,$('category').value,$('population').value]);
    if (!cache.has(key)) {
      const arr=[];
      if ($('category').value==='ALL' && $('population').value==='ALL') {
        const all=eventById.get(id)?.binsAndPr[`${id}__${race}__ALL`]?.sorted_seconds;
        if (all) {cache.set(key,all);return all;}
      }
      for (const g of groups(id,race)) for (const t of g.seconds) arr.push(t);
      arr.sort((a,b)=>a-b); cache.set(key,arr);
    }
    return cache.get(key);
  }
  const current = () => population(eventId(),$('race').value);
  const populationName = () => `${$('category').value==='ALL'?'所有參賽類型':$('category').value} / ${$('population').selectedOptions[0].textContent}`;
  function updateRaces(preferred) {
    const races=[...(raceIndex.get(eventId())?.keys() || [])].sort((a,b)=>(distance(eventId(),a)||0)-(distance(eventId(),b)||0));
    options('race',races.map(r=>[r,raceName(eventId(),r)]),preferred);
    updateCategories();
  }
  function updateCategories(preferred=$('category').value) {
    const available=new Set((raceIndex.get(eventId())?.get($('race').value)||[]).map(g=>g.category));
    options('category',[['ALL','所有類型'],...['一般','輪椅','視障'].filter(c=>available.has(c)).map(c=>[c,c])],preferred||'一般');
    updatePopulations();
  }
  function updatePopulations(preferred=$('population').value) {
    const source=(raceIndex.get(eventId())?.get($('race').value)||[]).filter(g=>$('category').value==='ALL'||g.category===$('category').value);
    options('population',[['ALL','全體'],...['男','女'].filter(sex=>source.some(g=>g.gender===sex)).map(sex=>[sex,sex==='男'?'男性':'女性'])],preferred);
    const ageSection=document.createElement('optgroup');ageSection.label='年齡組（可跨場比較）';
    const rawSection=document.createElement('optgroup');rawSection.label='其他原始分組';
    const seen=new Set();
    source.sort((a,b)=>(a.age?.min??Infinity)-(b.age?.min??Infinity)||a.name.localeCompare(b.name,'zh-Hant')).forEach(g=>{
      if(!g.age && /^(男|女)(子)?組?$/.test(g.name)){
        if(preferred==='group:'+g.name)preferred=g.gender;
        return;
      }
      const value=g.age?A.value(g.age):'group:'+g.name;
      if(seen.has(value))return;seen.add(value);
      const label=A.groupLabel(g);
      (g.age?ageSection:rawSection).append(new Option(label,value));
      if(preferred==='group:'+g.name&&g.age)preferred=value;
    });
    if(ageSection.children.length)$('population').append(ageSection);
    if(rawSection.children.length)$('population').append(rawSection);
    if([...$('population').options].some(o=>o.value===preferred))$('population').value=preferred;
    updateTargetGroups();
  }
  function updateTargetGroups() {
    const previous=$('targetGroup').value;
    const selectedSex=A.parse($('population').value)?.sex||(['男','女'].includes($('population').value)?$('population').value:null);
    const source=(raceIndex.get(eventId())?.get($('race').value)||[]).filter(g=>($('category').value==='ALL'||g.category===$('category').value)&&(!selectedSex||g.gender===selectedSex)).sort((a,b)=>(a.age?.min??Infinity)-(b.age?.min??Infinity)||a.name.localeCompare(b.name,'zh-Hant'));
    const preferred=groups(eventId(),$('race').value).length===1?groups(eventId(),$('race').value)[0].name:previous;
    options('targetGroup',source.map(g=>[g.name,A.groupLabel(g)]),preferred);
    $('targetGroup').disabled=!source.length;
  }
  function readTime() {
    const values=['hours','minutes','seconds'].map(id=>$(id).value.trim());
    const ns=values.map(Number);
    timeValid=values.every(v=>/^\d+$/.test(v)) && ns.every((n,i)=>Number.isInteger(n)&&n>=0&&n<=(i===0?23:59));
    $('timeError').textContent=timeValid?'':'請輸入完整時間：時 0–23，分／秒 0–59，皆為整數。';
    if (timeValid) sec=ns[0]*3600+ns[1]*60+ns[2];
    return timeValid;
  }
  function rank(m) {return m.rank>m.total?`超出完賽範圍`:`${num(m.rank)} / ${num(m.total)}`;}
  function pace(t,km) {
    if (!km) return '—';
    const v=Math.round(t/km); return `${Math.floor(v/60)}′${String(v%60).padStart(2,'0')}″ / km`;
  }
  function stat(label,value,note,primary=false,pr=null) {
    return `<div class="stat${primary?' primary':''}"><div class="stat-label">${esc(label)}</div><div class="stat-value">${esc(value)}</div>${pr!==null?`<div class="pr-bar"><span style="width:${pr}%"></span></div>`:''}<small>${esc(note)}</small></div>`;
  }
  function renderPosition() {
    const arr=current(), m=timeValid?S.metrics(arr,sec):null;
    $('pace').textContent=timeValid?`配速 ${pace(sec,distance(eventId(),$('race').value))}`:'';
    if (!m) {$('positionResult').innerHTML='<p class="empty">'+(timeValid?'此族群沒有有效完賽資料。':'輸入有效時間後即可查看結果。')+'</p>'; $('groupResult').replaceChildren();return;}
    $('positionResult').innerHTML='<div class="stats-grid">'+stat('超越百分比 · PR',pct(m.pr),`嚴格超越 ${num(m.slower)} 人`,true,m.pr)+stat('試算排名',rank(m),`比較族群 ${num(m.total)} 位有效完賽者`)+stat('同時間人數',num(m.equal),`比你快 ${num(m.faster)} 人`)+`</div><p class="muted caption result-note">${esc(populationName())} · ${S.time(sec)}${m.rank>m.total?' · 你的時間慢於所有有效完賽成績，無對應場內名次。':''}</p>`;
    const groupRows=groups(eventId(),$('race').value).filter(g=>g.seconds.length).sort((a,b)=>a.name.localeCompare(b.name,'zh-Hant')).map(g=>{const x=S.metrics(g.seconds,sec);return `<tr><td>${esc(A.groupLabel(g))}</td><td>${rank(x)}</td><td>${num(x.total)}</td><td class="pr-cell">${pct(x.pr)}</td><td>${num(x.equal)}</td></tr>`;});
    $('groupResult').innerHTML=table(['分組','試算排名','完賽人數','PR','同時間'],groupRows);
  }
  function table(headers,body) {
    return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${body.join('')}</tbody></table></div>`;
  }
  function renderTarget() {
    const raw=$('targetPr').value.trim(), pr=Number(raw);
    if(raw&&Number.isFinite(pr)&&pr>=0&&pr<=100){$('prSlider').value=pr;$('prSliderValue').textContent=`PR ${pr}`;}
    document.querySelectorAll('[data-pr]').forEach(b=>b.setAttribute('aria-pressed',String(raw!==''&&Number(b.dataset.pr)===pr)));
    if (!raw || !Number.isFinite(pr)||pr<0||pr>100) {$('targetError').textContent='請輸入 0–100 的 PR 值。'; $('targetResult').replaceChildren();return;}
    $('targetError').textContent='';
    const t=S.target(current(),pr);
    if (!t) {$('targetResult').innerHTML='<p class="empty">此族群無資料，或此目標在非負秒數範圍無法達成。</p>';return;}
    $('targetResult').innerHTML='<div class="stats-grid">'+stat(t.unbounded?'最慢已觀測時間':'最慢達標時間',S.time(t.sec),t.unbounded?'PR 0 沒有時間上限':`跑在此時間以內，至少達到 PR ${pr}`,true)+stat('實際對應 PR',pct(t.pr),`嚴格超越 ${num(t.slower)} / ${num(t.total)} 人`)+stat('目標配速',pace(t.sec,distance(eventId(),$('race').value)),'依賽別設定距離換算')+`</div><div class="target-action">${gapNote(t.sec)}<button class="secondary" type="button" data-time="${t.sec}">帶入完賽時間</button></div><p class="muted caption">依整秒求門檻。同秒成績與人數會使 PR 跳動，實際 PR 可能高於目標；門檻不一定是已觀測成績。</p>`;
  }
  function gapNote(goal) {
    if(!timeValid)return '<span class="muted">輸入完賽時間後，可查看與目標的差距。</span>';
    const delta=sec-goal;
    return `<span class="muted">${delta>0?`距離目標還需快 ${S.time(delta)}`:delta<0?`目前比目標快 ${S.time(-delta)}`:'目前時間已達到門檻'}</span>`;
  }
  function renderRankTargets() {
    const place=Number($('targetPlace').value),km=distance(eventId(),$('race').value);
    $('rankHeading').textContent=`總排與分組，前 ${place} 要跑多快？`;
    const all=eventById.get(eventId())?.binsAndPr[`${eventId()}__${$('race').value}__ALL`]?.sorted_seconds||[];
    const group=(raceIndex.get(eventId())?.get($('race').value)||[]).find(g=>g.name===$('targetGroup').value);
    const pools=[{label:`總排前 ${place}`,name:'同賽別全場（含所有參賽類型）',arr:all},{label:`分組前 ${place}`,name:group?A.groupLabel(group):'無可用分組',arr:group?.seconds||[]}];
    $('rankTargetResult').innerHTML='<div class="rank-grid">'+pools.map(pool=>{
      const t=S.rankTarget(pool.arr,place);
      if(!t)return `<div class="rank-card"><h3>${pool.label}</h3><p class="muted">${esc(pool.name)} · ${num(pool.arr.length)} 人</p><p class="empty">未滿 ${place} 位有效完賽者，沒有第 ${place} 筆成績門檻。</p></div>`;
      return `<div class="rank-card"><h3>${pool.label}</h3><p class="muted">${esc(pool.name)} · ${num(pool.arr.length)} 人</p><div class="stat-label">建議目標 · 比門檻快 1 秒</div><div class="stat-value">${S.time(t.sec)}</div><div class="rank-facts"><span>第 ${place} 筆成績<strong>${S.time(t.cutoff)}</strong></span><span>目標配速<strong>${pace(t.sec,km)}</strong></span></div>${t.sec===null?'<p class="muted">門檻為 0 秒，無法以非負秒數超越。</p>':`<div class="target-action">${gapNote(t.sec)}<button type="button" class="secondary" data-time="${t.sec}">帶入完賽時間</button></div>`}</div>`;
    }).join('')+'</div>';
    const length=Math.min(10,Math.max(all.length,group?.seconds.length||0));
    const entries=Array.from({length},(_,i)=>`<tr><td>${i+1}</td><td>${S.time(all[i])}</td><td>${S.time(group?.seconds[i])}</td></tr>`);
    $('topTimes').innerHTML=table(['成績序列','全場完賽時間',group?`${A.groupLabel(group)}完賽時間`:'分組完賽時間'],entries)+'<p class="muted caption">按時間由快到慢列出前 10 筆，同秒可能占多筆；不代表官方頒獎名單。</p>';
  }
  function destroyChart(which) {if(which==='hist' && histChart){histChart.destroy();histChart=null;}if(which==='compare'&&compareChart){compareChart.destroy();compareChart=null;}}
  function chartOptions(yTitle,percent=false) {
    return {responsive:true,maintainAspectRatio:false,animation:false,interaction:{mode:'nearest',intersect:false},plugins:{legend:{display:false},tooltip:{callbacks:{title:items=>items.length?S.time(items[0].parsed.x*60):'',label:item=>`${item.dataset.label}: ${percent?pct(item.parsed.y):num(item.parsed.y)+' 人'}`}}},scales:{x:{type:'linear',title:{display:true,text:'完賽時間'},ticks:{maxTicksLimit:8,callback:v=>S.time(v*60).slice(0,5)},grid:{color:'#edf1ee'}},y:{beginAtZero:true,title:{display:true,text:yTitle},ticks:{callback:v=>percent?v+'%':v},grid:{color:'#edf1ee'}}}};
  }
  const markerPlugin={id:'timeMarker',afterDraw(chart,args,opts){if(!Number.isFinite(opts.sec))return;const x=chart.scales.x.getPixelForValue(opts.sec/60),area=chart.chartArea;if(x<area.left||x>area.right)return;const ctx=chart.ctx;ctx.save();ctx.strokeStyle='#183b36';ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(x,area.top);ctx.lineTo(x,area.bottom);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#183b36';ctx.font='12px sans-serif';ctx.textAlign=x>area.right-90?'right':'left';ctx.fillText('你的時間',x+(x>area.right-90?-5:5),area.top+13);ctx.restore();}};
  function drawHistogram() {
    destroyChart('hist'); const arr=current();
    $('distributionSummary').innerHTML=arr.length?[['有效完賽',num(arr.length)+' 人'],['中位數',S.time(S.quantile(arr,.5))],['PR 90 門檻',S.time(S.target(arr,90)?.sec)]].map(([label,value])=>`<span class="chip">${label}<strong>${value}</strong></span>`).join(''):'';
    if (!arr.length) {$('tailNote').textContent='此族群沒有有效完賽資料。';return;}
    const cutoff=$('range').value==='main'?S.quantile(arr,.999):arr[arr.length-1];
    const end=Math.floor(cutoff/300)*300+300, counts=new Map();
    for (const t of arr) {if(t<end){const b=Math.floor(t/300);counts.set(b,(counts.get(b)||0)+1);}}
    const points=[];for(let b=Math.floor(arr[0]/300);b<end/300;b++)points.push({x:b*5+2.5,y:counts.get(b)||0});
    const hidden=arr.length-S.lowerBound(arr,end);
    $('tailNote').textContent=`每柱涵蓋 5 分鐘區間。${hidden?`另有 ${num(hidden)} 筆 ${S.time(end)} 以後的成績未繪製；排名與 PR 仍使用完整資料。`:'已顯示全部成績。'}${timeValid&&sec>=end?' 你的時間位於圖表範圍之外。':''}`;
    if (!window.Chart) {$('tailNote').textContent+=' 圖表套件載入失敗，請確認網路後重整。';return;}
    const opts=chartOptions('人數');opts.plugins.timeMarker={sec:timeValid?sec:null};
    opts.plugins.tooltip.callbacks.title=items=>{const start=(items[0].parsed.x-2.5)*60;return `${S.time(start)}–${S.time(start+300)}（不含終點）`;};
    histChart=new Chart($('histCanvas'),{type:'bar',data:{datasets:[{label:'完賽人數',data:points,backgroundColor:points.map(p=>timeValid&&sec>=((p.x-2.5)*60)&&sec<((p.x+2.5)*60)?'#b6d94c':'#127b68aa'),borderRadius:3}]},options:opts,plugins:[markerPlugin]});
  }
  function compareRows() {
    skipped=[];
    if($('population').value.startsWith('group:'))return [];
    const km=distance(eventId(),$('race').value), reference=timeValid?S.metrics(current(),sec):null;
    if (!reference||!km) return [];
    const results=[];
    for(const e of events)for(const race of raceIndex.get(e.metadata.event_id).keys()){
      const id=e.metadata.event_id;if(distance(id,race)!==km)continue;
      const arr=population(id,race), m=S.metrics(arr,sec);if(!m){skipped.push({event:e.metadata,race});continue;}
      results.push({id,race,key:JSON.stringify([id,race]),event:e.metadata,arr,m,target:S.target(arr,reference.pr),sourceGroups:groups(id,race),reference:id===eventId()&&race===$('race').value});
    }
    return results;
  }
  function renderCompare() {
    rows=compareRows(); const ref=rows.find(r=>r.reference);
    const age=A.parse($('population').value);
    $('ageCompareNote').hidden=!age;
    $('ageCompareNote').innerHTML=age?`<strong>年齡組比較：${esc(A.label(age))}</strong><p>只納入性別及公布年齡範圍一致的組別；若原始分組較細，會合併完整相鄰組。各場年齡採計方式以簡章為準，不會從寬泛組別推估個別年齡。</p>${skipped.length?`<details><summary>${skipped.length} 個同距離賽別未納入：無相同範圍或分組定義待確認</summary><ul>${skipped.map(r=>`<li>${esc(r.event.event_name)} · ${esc(raceName(r.event.event_id,r.race))}</li>`).join('')}</ul></details>`:''}`:'';
    if(!ref){$('compareIntro').textContent=$('population').value.startsWith('group:')?'細分組可查單場分布、排名與目標時間。跨場分組界線尚未標準化，請選全體、男性或女性來比較。':'目前基準無可比較資料，請先選擇有效族群與時間。';$('compareResult').replaceChildren();$('chartChoices').replaceChildren();$('compareChartNote').textContent='';destroyChart('compare');return;}
    $('compareIntro').textContent=`${distanceName(distance(eventId(),$('race').value))} · ${populationName()} · ${S.time(sec)}。參考賽事 PR ${pct(ref.m.pr)}，列出 ${rows.length} 個可比較賽別。`;
    const sort=$('sort').value;
    rows.sort((a,b)=>sort==='pr'?b.m.pr-a.m.pr:sort==='count'?b.m.total-a.m.total:sort==='target'?(a.target?.sec??Infinity)-(b.target?.sec??Infinity):b.event.event_date.localeCompare(a.event.event_date));
    $('compareResult').innerHTML=table(['賽事 / 賽別','完賽人數','同時間排名','同時間 PR','與參考差距','同 PR 最慢時間','實際 PR'],rows.map(r=>`<tr${r.reference?' class="reference"':''}><td>${esc(r.event.event_name)}${r.reference?'<span class="badge">參考</span>':''}<span class="row-sub">${r.event.event_date} · ${esc(raceName(r.id,r.race))}</span>${age?`<span class="row-sub">原始分組：${esc(r.sourceGroups.map(g=>A.groupLabel(g)).join(' + '))}${r.sourceGroups[0]?.age?.source?` · <a href="${esc(r.sourceGroups[0].age.source)}" target="_blank" rel="noopener">分組依據 ↗</a>`:''}</span>`:''}</td><td>${num(r.m.total)}</td><td>${rank(r.m)}</td><td class="pr-cell">${pct(r.m.pr)}</td><td>${r.reference?'—':`${r.m.pr-ref.m.pr>=0?'+':''}${(r.m.pr-ref.m.pr).toFixed(2)} 個百分點`}</td><td>${S.time(r.target?.sec)}${r.target?.unbounded?'<span class="row-sub">PR 0 無時間上限</span>':''}</td><td>${r.target?pct(r.target.pr):'—'}</td></tr>`));
    const key=JSON.stringify([eventId(),$('race').value,$('category').value,$('population').value]);
    if(comparisonKey!==key){selectedCharts=new Set([ref.key,...rows.filter(r=>!r.reference).slice(0,2).map(r=>r.key)]);comparisonKey=key;}
    $('chartChoices').replaceChildren(...rows.map((r,i)=>{const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=selectedCharts.has(r.key);input.addEventListener('change',()=>{input.checked?selectedCharts.add(r.key):selectedCharts.delete(r.key);drawComparison();});label.style.color=colors[events.findIndex(e=>e.metadata.event_id===r.id)%colors.length];label.append(input,document.createTextNode(`${r.event.event_name} · ${raceName(r.id,r.race)}`));return label;}));
    drawComparison();
  }
  function drawComparison() {
    destroyChart('compare');if(!window.Chart)return;
    const mode=$('compareChartType').value, selected=rows.filter(r=>selectedCharts.has(r.key));
    $('compareChartNote').textContent=mode==='cdf'?'橫軸為時間，縱軸為該時間以前（含同秒）完賽的比例；曲線越靠左，這群跑者整體越快。採完整資料，無尾端裁切。':'各場以自身完賽人數換算比例，統一 5 分鐘區間，避免人數多的賽事看起來分布更高。';
    if(!selected.length){$('compareChartNote').textContent+=' 請勾選至少一個賽別。';return;}
    const datasets=selected.map(r=>{
      let data=[];
      if(mode==='cdf'){
        // Retain every unique time so ties and CDF transitions remain exact.
        data=[{x:Math.max(0,r.arr[0]-1)/60,y:0}];
        for(let i=0;i<r.arr.length;){const t=r.arr[i];let j=i+1;while(j<r.arr.length&&r.arr[j]===t)j++;data.push({x:t/60,y:j/r.arr.length*100});i=j;}
      }else{
        const bins=new Map();for(const t of r.arr){const b=Math.floor(t/300);bins.set(b,(bins.get(b)||0)+1);}
        for(let b=0;b<=Math.floor(r.arr[r.arr.length-1]/300);b++)data.push({x:b*5+2.5,y:(bins.get(b)||0)/r.arr.length*100});
      }
      const color=colors[events.findIndex(e=>e.metadata.event_id===r.id)%colors.length];
      return {label:`${r.event.event_name} · ${raceName(r.id,r.race)}`,data,borderColor:color,backgroundColor:color,borderWidth:r.reference?3:1.8,pointRadius:0,pointHitRadius:5,stepped:mode==='cdf'?'before':false};
    });
    const opts=chartOptions(mode==='cdf'?'累積完賽比例':'每 5 分鐘完賽比例',true);if(mode==='cdf')opts.scales.y.max=100;
    opts.plugins.timeMarker={sec};
    compareChart=new Chart($('compareCanvas'),{type:'line',data:{datasets},options:opts,plugins:[markerPlugin]});
  }
  function refresh() {
    const e=eventById.get(eventId());
    $('context').replaceChildren(document.createTextNode(`${e.metadata.event_date} · ${populationName()} · ${num(current().length)} 位有效完賽者 · `));
    if(/^https:\/\//.test(e.metadata.source_url||'')){const a=document.createElement('a');a.href=e.metadata.source_url;a.target='_blank';a.rel='noopener';a.textContent='查看成績來源 ↗';$('context').append(a);}
    $('shareStatus').textContent='';renderPosition();renderTarget();renderRankTargets();
    if(activeTab==='position')drawHistogram();if(activeTab==='compare')renderCompare();
  }
  function setTab(tab) {
    activeTab=['position','target','compare'].includes(tab)?tab:'position';
    document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===activeTab)));
    document.querySelectorAll('.panel').forEach(p=>p.hidden=p.id!==activeTab);
    refresh();
  }
  function shareUrl() {
    const url=new URL(location.href);url.search='';url.hash='';
    for(const [key,value] of Object.entries({event:eventId(),race:$('race').value,category:$('category').value,population:$('population').value,time:sec,pr:$('targetPr').value,place:$('targetPlace').value,targetGroup:$('targetGroup').value,tab:activeTab}))url.searchParams.set(key,value);
    return url.href;
  }
  $('share').addEventListener('click',async()=>{
    if(!readTime()){setTab('position');return;}
    const url=shareUrl();history.replaceState(null,'',url);
    try{await navigator.clipboard.writeText(url);$('shareStatus').textContent='已複製查詢連結。';}catch{$('shareStatus').textContent='請複製網址列中的查詢連結。';}
  });
  $('event').addEventListener('change',()=>{updateRaces($('race').value);refresh();});
  $('race').addEventListener('change',()=>{updateCategories();refresh();});
  $('category').addEventListener('change',()=>{updatePopulations();refresh();});
  $('population').addEventListener('change',()=>{updateTargetGroups();refresh();});
  $('timeForm').addEventListener('submit',e=>{e.preventDefault();readTime();refresh();});
  // Keep the other tabs consistent even before the submit button is pressed.
  for(const id of ['hours','minutes','seconds'])$(id).addEventListener('input',()=>{readTime();refresh();});
  $('targetForm').addEventListener('submit',e=>{e.preventDefault();renderTarget();});
  $('targetPr').addEventListener('input',renderTarget);
  $('prSlider').addEventListener('input',()=>{$('targetPr').value=$('prSlider').value;renderTarget();});
  for(const id of ['targetPlace','targetGroup'])$(id).addEventListener('change',renderRankTargets);
  $('target').addEventListener('click',e=>{
    const button=e.target.closest('[data-time]');if(!button)return;
    const value=Number(button.dataset.time);if(!Number.isInteger(value)||value<0||value>86399)return;
    $('hours').value=Math.floor(value/3600);$('minutes').value=Math.floor(value%3600/60);$('seconds').value=value%60;readTime();refresh();
  });
  document.querySelectorAll('[data-pr]').forEach(b=>b.addEventListener('click',()=>{$('targetPr').value=b.dataset.pr;renderTarget();}));
  document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{readTime();setTab(b.dataset.tab);}));
  $('range').addEventListener('change',drawHistogram);$('sort').addEventListener('change',renderCompare);$('compareChartType').addEventListener('change',drawComparison);
    if(!events.length){$('coverage').textContent='目前沒有可用成績';document.querySelectorAll('button,input,select').forEach(el=>el.disabled=true);return;}
  const params=new URLSearchParams(location.search);
  options('event',events.map(e=>[e.metadata.event_id,e.metadata.event_name]),params.get('event'));
  updateRaces(params.get('race'));updateCategories(params.get('category')||'一般');
  updatePopulations(params.get('population')||'ALL');
  const t=Number(params.get('time'));if(params.has('time')&&Number.isInteger(t)&&t>=0&&t<=86399){$('hours').value=Math.floor(t/3600);$('minutes').value=Math.floor(t%3600/60);$('seconds').value=t%60;}
  if(params.has('pr'))$('targetPr').value=params.get('pr');
  if(['1','3','5','10','20','50'].includes(params.get('place')))$('targetPlace').value=params.get('place');
  if([...$('targetGroup').options].some(o=>o.value===params.get('targetGroup')))$('targetGroup').value=params.get('targetGroup');
  $('coverage').textContent=`${events.length} 場賽事 · ${[...new Set(events.map(e=>e.metadata.event_date.slice(0,4)))].sort().join('–')}`;
  if(failed?.some(Boolean))$('coverage').textContent+=` · ${failed.filter(Boolean).length} 場載入失敗，請重整`;
  readTime();setTab(params.get('tab'));
})();
