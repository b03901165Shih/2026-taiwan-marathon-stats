/* Catalog is generated from events_config.json, so adding a race needs no HTML edits. */
window.RunDataReady = Promise.all((window.RunEventCatalog || []).map(entry => new Promise(resolve => {
  const script = document.createElement('script');
  script.src = entry.src;
  script.onload = () => {
    const event = window.marathonData?.[entry.metadata.event_id];
    if (entry.requires_ranking_audit && (!entry.ranking_audit || event?.metadata?.ranking_audit?.version !== 1
        || JSON.stringify(event.metadata.ranking_audit) !== JSON.stringify(entry.ranking_audit))) {
      if (window.marathonData) delete window.marathonData[entry.metadata.event_id];
      resolve(entry.metadata.event_name + '（來源查核缺漏或資料尚未同步）');
      return;
    }
    if (event) Object.assign(event.metadata, entry.metadata);
    resolve(event ? null : entry.metadata.event_name);
  };
  script.onerror = () => resolve(entry.metadata.event_name);
  document.head.append(script);
})));
