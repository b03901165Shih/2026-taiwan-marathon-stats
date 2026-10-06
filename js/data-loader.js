/* Load one race first; keep speculative downloads bounded as the catalog grows. */
(() => {
  const catalog = window.RunEventCatalog || [];
  const entries = new Map(catalog.map(entry => [entry.metadata.event_id, entry]));
  const tasks = new Map(), failures = new Map(), listeners = new Set();
  const urgent = [], background = [];
  let active = 0;

  for (const entry of catalog) {
    if (entry.requires_ranking_audit && !entry.ranking_audit) {
      failures.set(entry.metadata.event_id, '來源查核缺漏');
    }
  }

  function notify(id, event, reason) {
    for (const listener of listeners) {
      try { listener({id, event, reason}); }
      catch (error) { console.error('Race data listener failed:', error); }
    }
  }

  function pump() {
    while (active < 2 && urgent.length) start(urgent.shift());
    if (active === 0 && background.length) start(background.shift());
  }

  function start(task) {
    active++;
    task.state = 'loading';
    const {entry, id} = task;
    const script = document.createElement('script');
    script.src = entry.src;
    script.async = true;
    let finished = false;
    const finish = (event, reason) => {
      if (finished) return;
      finished = true;
      active--;
      task.state = event ? 'loaded' : 'failed';
      if (reason) failures.set(id, reason);
      task.resolve(event);
      notify(id, event, reason);
      pump();
    };
    script.onload = () => {
      try {
        const event = window.marathonData?.[id];
        if (entry.requires_ranking_audit && (event?.metadata?.ranking_audit?.version !== 1
            || JSON.stringify(event.metadata.ranking_audit) !== JSON.stringify(entry.ranking_audit))) {
          if (window.marathonData) delete window.marathonData[id];
          finish(null, '來源查核缺漏或資料尚未同步');
          return;
        }
        if (!event || !Object.keys(event.binsAndPr || {}).length) {
          finish(null, '成績檔無法載入');
          return;
        }
        Object.assign(event.metadata, entry.metadata);
        finish(event, null);
      } catch {
        if (window.marathonData) delete window.marathonData[id];
        finish(null, '成績檔格式錯誤');
      }
    };
    script.onerror = () => finish(null, '成績檔無法載入');
    try { document.head.append(script); }
    catch { finish(null, '成績檔無法載入'); }
  }

  function load(id, priority = true, front = false) {
    const entry = entries.get(id);
    if (!entry || failures.has(id)) return Promise.resolve(null);
    if (tasks.has(id)) {
      const task = tasks.get(id);
      if (priority && task.state === 'queued-background') {
        background.splice(background.indexOf(task), 1);
        task.state = 'queued-urgent';
        urgent.unshift(task);
        pump();
      } else if (front && task.state === 'queued-urgent') {
        urgent.splice(urgent.indexOf(task), 1);
        urgent.unshift(task);
      }
      return task.promise;
    }
    const task = {id, entry, state: priority ? 'queued-urgent' : 'queued-background'};
    task.promise = new Promise(resolve => { task.resolve = resolve; });
    tasks.set(id, task);
    if (priority && front) urgent.unshift(task);
    else (priority ? urgent : background).push(task);
    pump();
    return task.promise;
  }

  window.RunDataStore = {
    catalog,
    load,
    prefetch(ids) { return Promise.all(ids.map(id => load(id, false))); },
    status(id) { return failures.has(id) ? 'failed' : tasks.get(id)?.state || 'unloaded'; },
    failures,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  };
})();
