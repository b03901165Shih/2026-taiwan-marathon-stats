/* Pure statistics, shared by every query. Times are integer seconds. */
(function(root) {
  function bound(arr, value, inclusive) {
    let lo = 0, hi = arr.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] < value || (inclusive && arr[mid] === value)) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  const lowerBound = (arr, value) => bound(arr, value, false);
  const upperBound = (arr, value) => bound(arr, value, true);
  function metrics(arr, sec) {
    if (!arr.length || !Number.isFinite(sec)) return null;
    const faster = lowerBound(arr, sec), through = upperBound(arr, sec);
    return {total:arr.length, faster, equal:through-faster, slower:arr.length-through,
      rank:faster+1, pr:(arr.length-through)/arr.length*100};
  }
  function target(arr, pr) {
    if (!arr.length || !Number.isFinite(pr) || pr < 0 || pr > 100) return null;
    // PR 0 has no upper limit; use the slowest observed time as a useful reference.
    if (pr === 0) return {sec:arr[arr.length-1], ...metrics(arr, arr[arr.length-1]), unbounded:true};
    let lo = 0, hi = arr[arr.length-1], answer = null;
    while (lo <= hi) {
      const mid = Math.floor((lo+hi)/2);
      if (metrics(arr, mid).pr + 1e-10 >= pr) {answer=mid; lo=mid+1;}
      else hi=mid-1;
    }
    return answer === null ? null : {sec:answer, ...metrics(arr,answer), unbounded:false};
  }
  function quantile(arr, fraction) {
    return arr.length ? arr[Math.max(0, Math.ceil(arr.length*fraction)-1)] : null;
  }
  function time(sec) {
    if (!Number.isFinite(sec)) return '—';
    sec=Math.floor(sec);
    return [Math.floor(sec/3600), Math.floor(sec%3600/60), sec%60].map(n=>String(n).padStart(2,'0')).join(':');
  }
  function category(group) {return group.includes('輪椅')?'輪椅':group.includes('視障')?'視障':'一般';}
  function gender(group) {return group.includes('男')?'男':group.includes('女')?'女':null;}
  function rankTarget(arr, place) {
    if (!Number.isInteger(place) || place < 1 || arr.length < place) return null;
    const cutoff = arr[place-1];
    const sec = cutoff > 0 ? cutoff-1 : null;
    return {cutoff,sec,total:arr.length,place,metric:sec===null?null:metrics(arr,sec)};
  }
  const api={lowerBound, upperBound, metrics, target, rankTarget, quantile, time, category, gender};
  root.RunStats=api;
  if (typeof module !== 'undefined') module.exports=api;
})(typeof window !== 'undefined' ? window : globalThis);
