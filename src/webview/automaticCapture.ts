let timer: ReturnType<typeof setTimeout> | undefined;
let pendingCapture: (() => void) | undefined;
let waitingForBreadcrumbs = false;

export function cancelAutomaticCapture() {
  clearTimeout(timer);
  timer = undefined;
  pendingCapture = undefined;
  waitingForBreadcrumbs = false;
}

export function scheduleAutomaticCapture(capture: () => void, waitForBreadcrumbs: boolean) {
  cancelAutomaticCapture();
  pendingCapture = capture;
  waitingForBreadcrumbs = waitForBreadcrumbs;
  // Keep automatic capture usable if a language service never responds.
  timer = setTimeout(
    () => {
      cancelAutomaticCapture();
      capture();
    },
    waitForBreadcrumbs ? 2000 : 100,
  );
}

export function notifyBreadcrumbsReady() {
  if (waitingForBreadcrumbs && pendingCapture) {
    // Allow the webview to render the updated breadcrumb before capturing.
    scheduleAutomaticCapture(pendingCapture, false);
  }
}
