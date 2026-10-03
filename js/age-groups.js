/* Published race age bands. Unknown letter groups are never inferred. */
(function(root) {
  function describe(name, metadata, race) {
    const sex = name.includes('男') ? '男' : name.includes('女') ? '女' : null;
    if (!sex || /輪椅|視障/.test(name)) return null;
    let band = null;
    const range = name.match(/(\d+)\s*[-～~–]\s*(\d+)歲/);
    const open = name.match(/(\d+)歲\+/);
    const under = name.match(/(\d+)歲-/);
    if (range) band = [+range[1], +range[2]];
    else if (open) band = [+open[1], null];
    else if (under) band = [0, +under[1]];
    else band = metadata?.group_age_ranges?.[race]?.[name];
    return band ? {sex,min:band[0],max:band[1],source:metadata?.group_age_source || null} : null;
  }
  const value = age => `age:${age.sex}:${age.min}:${age.max === null ? 'plus' : age.max}`;
  function parse(value) {
    const m = value.match(/^age:(男|女):(\d+):(\d+|plus)$/);
    return m ? {sex:m[1],min:+m[2],max:m[3]==='plus'?null:+m[3]} : null;
  }
  const label = age => `${age.sex}性 · ${age.max===null?age.min+' 歲以上':age.min===0?age.max+' 歲以下':age.min+'–'+age.max+' 歲'}`;
  function match(groups, target) {
    // Combine adjacent whole source groups only when they exactly cover the band.
    const eligible = groups.filter(g => g.age && g.age.sex === target.sex && g.age.min >= target.min && (g.age.max ?? Infinity) <= (target.max ?? Infinity)).sort((a,b)=>a.age.min-b.age.min);
    let next = target.min;
    const chosen = [];
    for (const g of eligible) {
      if (g.age.min !== next) return [];
      chosen.push(g); next = g.age.max === null ? Infinity : g.age.max+1;
    }
    return next === (target.max === null ? Infinity : target.max+1) ? chosen : [];
  }
  function groupLabel(group) {
    if(group.age)return label(group.age)+(group.name.includes('歲')?'':`（${group.name}）`);
    if(/(?:甲|乙|丙|丁|戊|己|[A-H])組/.test(group.name))return `${group.name}（歲數定義待核實）`;
    if(/^(男|女)(子)?組$/.test(group.name))return `${group.name.startsWith('男')?'男性':'女性'}（不分齡）`;
    return group.name;
  }
  const api = {describe,value,parse,label,match,groupLabel};
  root.RunAge = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
