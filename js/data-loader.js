/* Catalog is generated from events_config.json, so adding a race needs no HTML edits. */
window.RunDataReady = Promise.all((window.RunEventCatalog || []).map(entry => new Promise(resolve => {
  const script = document.createElement('script');
  script.src = entry.src;
  script.onload = () => {
    const event = window.marathonData?.[entry.metadata.event_id];
    if (event) Object.assign(event.metadata, entry.metadata);
    resolve(event ? null : entry.metadata.event_name);
  };
  script.onerror = () => resolve(entry.metadata.event_name);
  document.head.append(script);
})));
