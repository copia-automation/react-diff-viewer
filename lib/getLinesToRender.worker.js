import getLinesToRender from "./getLinesToRender";
console.log("Loaded RDV Worker");
self.onmessage = function (e) {
    try {
        var argumentObject = e.data;
        // Example: simple CPU-heavy simulation
        var result = getLinesToRender(argumentObject);
        // Send the result back to the main thread
        self.postMessage({ success: true, data: result });
    }
    catch (error) {
        self.postMessage({ success: false, error: error.message });
    }
    finally {
        self.close();
    }
};
