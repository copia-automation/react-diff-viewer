import getLinesToRender from "./getLinesToRender";

console.log("Loaded Worker");

self.onmessage = function (e) {
  try {
    const argumentObject = e.data;

    // Example: simple CPU-heavy simulation
    const result = getLinesToRender(argumentObject);

    // Send the result back to the main thread
    self.postMessage({ success: true, data: result });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  } finally {
    self.close();
  }
};
