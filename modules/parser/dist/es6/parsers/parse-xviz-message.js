import { parseXVIZMessageSync } from './parse-xviz-message-sync';
import { postDeserialize } from './serialize';
import { getWorkerFarm, initializeWorkerFarm } from './parse-xviz-message-workerfarm';
export function initializeWorkers({
  worker,
  maxConcurrency = 4,
  capacity = null
}) {
  initializeWorkerFarm({
    worker,
    maxConcurrency,
    capacity
  });
}
export function parseXVIZMessage({
  message,
  onResult,
  onError,
  debug,
  worker = false,
  maxConcurrency = 4,
  capacity = null
}) {
  if (worker) {
    if (!getWorkerFarm()) {
      initializeWorkers({
        worker,
        maxConcurrency,
        capacity
      });
    }

    const workerFarm = getWorkerFarm();

    if (debug) {
      workerFarm.debug = debug;
    }

    const onMessage = data => onResult(postDeserialize(data));

    workerFarm.process(message, onMessage, onError);
  } else {
    parseXVIZMessageSync(message, onResult, onError);
  }
}
//# sourceMappingURL=parse-xviz-message.js.map